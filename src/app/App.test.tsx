import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { summarizeChallengeAttempts } from '../learning/challenges';
import { summarizeEarlyAttempts } from '../learning/early';
import type { AgeProfileId } from '../learning/profiles';
import { createState, DEFAULT_CONFIG, type WellbeingConfig, type WellbeingState } from '../wellbeing/core';
import { resetGateLockout } from '../wellbeing/ParentGate';

const dbMock = vi.hoisted(() => ({
  loadAgeProfile: vi.fn(),
  saveAgeProfile: vi.fn(async () => {}),
  getEarlySummary: vi.fn(),
  recordEarlyAttempt: vi.fn(async () => {}),
  getLearningOverview: vi.fn(),
  recordAnswer: vi.fn(async () => {}),
  recordChallengeAttempt: vi.fn(async () => {}),
  saveDiagnostic: vi.fn(async () => {}),
  saveMemorySession: vi.fn(async () => {}),
  loadWellbeing: vi.fn(),
  saveWellbeing: vi.fn(async () => {})
}));

vi.mock('virtual:pwa-register', () => ({ registerSW: () => async () => {} }));
vi.mock('../lib/db', () => dbMock);

import App from './App';

/** Janela de 24 h: os testes não dependem da hora em que rodam (nem do fuso do CI). */
const allDay = { windowStart: '00:00', windowEnd: '24:00' };
function wellbeingRecord(profile: AgeProfileId, state: Partial<WellbeingState> = {}, config: Partial<WellbeingConfig> = {}) {
  return { profile, config: { ...DEFAULT_CONFIG[profile], ...allDay, ...config }, state: { ...createState(Date.now()), ...state } };
}
function useWellbeingRecord(state?: Partial<WellbeingState>, config?: Partial<WellbeingConfig>) {
  dbMock.loadWellbeing.mockImplementation(async (profile: AgeProfileId) => wellbeingRecord(profile, state, config));
}
const lastSavedState = () => (dbMock.saveWellbeing.mock.calls.at(-1) as unknown as [{ state: WellbeingState }])[0].state;

/** Portão dos adultos: segurar 3 segundos. */
function holdGate() {
  const hold = screen.getByRole('button', { name: 'Segure por 3 segundos' });
  vi.useFakeTimers();
  try {
    fireEvent.pointerDown(hold);
    act(() => { vi.advanceTimersByTime(3100); });
  } finally {
    vi.useRealTimers();
  }
}
function answerGateSum() {
  const [a, b] = screen.getByText(/Quanto é/).textContent!.match(/(\d+) \+ (\d+)/)!.slice(1).map(Number);
  fireEvent.change(screen.getByLabelText(/Quanto é/), { target: { value: String(a + b) } });
  fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));
}

const emptyOverview = () => ({
  multiplication: { factsSeen: 0, attempts: 0, correct: 0, accuracy: 0 },
  challenges: summarizeChallengeAttempts([]),
  memory: { sessions: 0, bestAttempts: null },
  diagnosticCompleted: false
});

describe('age profile gate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetGateLockout();
    useWellbeingRecord();
    dbMock.loadAgeProfile.mockResolvedValue(null);
    dbMock.getEarlySummary.mockResolvedValue(summarizeEarlyAttempts([]));
    dbMock.getLearningOverview.mockResolvedValue(emptyOverview());
  });

  it('asks who is playing on first open and offers both age bands', async () => {
    render(<App />);
    expect(await screen.findByRole('heading', { name: 'Quem vai jogar?' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Pequeno Explorador, 3 a 6 anos' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Explorador Estratégico, 11 a 13 anos' })).toBeInTheDocument();
  });

  it('opens the 3–6 activities and remembers the choice', async () => {
    render(<App />);
    fireEvent.click(await screen.findByRole('button', { name: 'Pequeno Explorador, 3 a 6 anos' }));
    expect(dbMock.saveAgeProfile).toHaveBeenCalledWith('age-3-6');
    const list = await screen.findByRole('list', { name: 'Brincadeiras' });
    expect(within(list).getAllByRole('button')).toHaveLength(10);
    expect(screen.getByText(/Oi! Eu sou o Robô/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /JOGAR/ })).not.toBeInTheDocument();
  });

  it('opens straight into the saved profile and lets an adult switch it', async () => {
    dbMock.loadAgeProfile.mockResolvedValue('age-3-6');
    render(<App />);
    fireEvent.click(await screen.findByRole('button', { name: 'Adultos' }));
    expect(screen.queryByRole('button', { name: 'Trocar perfil de idade' })).not.toBeInTheDocument();
    holdGate();
    answerGateSum();
    fireEvent.click(await screen.findByRole('button', { name: 'Trocar perfil de idade' }));
    fireEvent.click(screen.getByRole('button', { name: 'Escolher outro perfil' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Explorador Estratégico, 11 a 13 anos' }));
    expect(dbMock.saveAgeProfile).toHaveBeenLastCalledWith('age-11-13');
    expect(await screen.findByRole('button', { name: /JOGAR/ })).toBeInTheDocument();
  });

  it('can go back without switching', async () => {
    dbMock.loadAgeProfile.mockResolvedValue('age-11-13');
    render(<App />);
    fireEvent.click(await screen.findByRole('button', { name: 'Progresso' }));
    fireEvent.click(screen.getByRole('button', { name: 'Abrir área dos adultos' }));
    holdGate();
    answerGateSum();
    fireEvent.change(screen.getByLabelText('Novo PIN'), { target: { value: '4821' } });
    fireEvent.change(screen.getByLabelText('Repita o PIN'), { target: { value: '4821' } });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar PIN e entrar' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Trocar perfil de idade' }));
    fireEvent.click(screen.getByRole('button', { name: 'Escolher outro perfil' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Voltar sem trocar' }));
    expect(await screen.findByRole('button', { name: /JOGAR/ })).toBeInTheDocument();
    expect(dbMock.saveAgeProfile).toHaveBeenLastCalledWith('age-11-13');
  });
});

describe('11–13 explorer app', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetGateLockout();
    useWellbeingRecord();
    dbMock.loadAgeProfile.mockResolvedValue('age-11-13');
    dbMock.getLearningOverview.mockResolvedValue(emptyOverview());
  });

  it('renders the home screen, explorer level and main navigation', async () => {
    render(<App />);
    expect(await screen.findByRole('heading', { level: 1, name: 'Math Quest: a aventura da matemática' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Explorador Nível 1' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Navegação principal' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Início' })).toHaveAttribute('aria-current', 'page');
    expect(within(screen.getByRole('list', { name: 'Coleção de itens' })).getAllByRole('listitem')).toHaveLength(10);
  });

  it('shows the six missions on the map and opens the chosen one', async () => {
    render(<App />);
    const map = await screen.findByRole('list', { name: 'Mapa de missões' });
    expect(within(map).getAllByRole('button')).toHaveLength(6);
    fireEvent.click(within(map).getByRole('button', { name: /Missão 3: Compra no centro de comando/ }));
    expect(screen.getByText(/DESAFIO 3 \//)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Compra no centro de comando');
  });

  it('opens the memory game from its world card and from the navigation', async () => {
    render(<App />);
    fireEvent.click(await screen.findByRole('button', { name: /Memória matemática/ }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Conecte cada operação ao resultado');

    fireEvent.click(screen.getByRole('button', { name: 'Início' }));
    fireEvent.click(screen.getByRole('button', { name: 'Memória' }));
    expect(screen.getByRole('button', { name: 'Memória' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getAllByRole('button', { name: /virada para baixo/ }).length).toBeGreaterThan(0);
  });

  it('records each strategic challenge answer locally', async () => {
    render(<App />);
    fireEvent.click(await screen.findByRole('button', { name: /JOGAR/ }));
    expect(screen.getByText(/DESAFIO 1 \//)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/Sua resposta/), { target: { value: '17' } });
    fireEvent.click(screen.getByRole('button', { name: 'Conferir resposta' }));
    expect(screen.getByText(/Código correto!/)).toBeInTheDocument();
    expect(dbMock.recordChallengeAttempt).toHaveBeenCalledWith(expect.objectContaining({ challengeId: 'rescue-stock', correct: true, value: 17 }));
  });

  it('lets the child turn sound effects off and on', async () => {
    render(<App />);
    fireEvent.click(await screen.findByRole('button', { name: 'Desligar som' }));
    expect(screen.getByRole('button', { name: 'Ligar som' })).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(screen.getByRole('button', { name: 'Ligar som' }));
    expect(screen.getByRole('button', { name: 'Desligar som' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('shows challenge, memory and collection progress in the guardian summary', async () => {
    dbMock.getLearningOverview.mockResolvedValue({
      ...emptyOverview(),
      challenges: summarizeChallengeAttempts([
        { challengeId: 'rescue-stock', correct: true, value: 17, answeredAt: '2026-11-19T10:00:00.000Z' },
        { challengeId: 'fraction-parts', correct: false, value: 40, answeredAt: '2026-11-19T10:01:00.000Z' }
      ]),
      memory: { sessions: 3, bestAttempts: 7, lastCompletedAt: '2026-11-19T11:00:00.000Z' }
    });
    render(<App />);
    fireEvent.click(await screen.findByRole('button', { name: 'Progresso' }));
    expect(await screen.findByText('2 / 6')).toBeInTheDocument();
    const list = screen.getByRole('list', { name: 'Progresso por desafio' });
    expect(list).toHaveTextContent('Estoque de energia');
    expect(list).toHaveTextContent('Resolvido');
    expect(list).toHaveTextContent('Em andamento');
    expect(screen.getByText('Partidas concluídas').nextSibling).toHaveTextContent('3');
    expect(screen.getByText('Menos tentativas').nextSibling).toHaveTextContent('7');
    const items = screen.getByRole('list', { name: 'Itens e como conquistar' });
    expect(items).toHaveTextContent('Chip IA');
    expect(within(items).getAllByText('Conquistado').length).toBeGreaterThanOrEqual(3);
  });
});

describe('healthy pause (Padrão VSA de Bem-Estar)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetGateLockout();
    dbMock.getEarlySummary.mockResolvedValue(summarizeEarlyAttempts([]));
    dbMock.getLearningOverview.mockResolvedValue(emptyOverview());
  });

  it('3–6: keeps the adults area behind the hold + 2-digit sum gate', async () => {
    useWellbeingRecord();
    dbMock.loadAgeProfile.mockResolvedValue('age-3-6');
    render(<App />);
    fireEvent.click(await screen.findByRole('button', { name: 'Adultos' }));
    expect(screen.getByRole('dialog', { name: 'Área dos adultos' })).toBeInTheDocument();
    holdGate();
    fireEvent.change(screen.getByLabelText(/Quanto é/), { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Resposta incorreta');
    answerGateSum();
    expect(await screen.findByRole('heading', { name: 'Pausa saudável' })).toBeInTheDocument();
    expect(screen.getByRole('switch', { name: 'Pausa saudável ligada' })).toHaveAttribute('aria-checked', 'true');
    const session = screen.getByRole('radiogroup', { name: 'Tempo de uso por rodada' });
    expect(within(session).getByRole('radio', { name: '15 min', checked: true })).toBeInTheDocument();
    expect(within(screen.getByRole('list', { name: 'Uso nos últimos 7 dias' })).getAllByRole('listitem')).toHaveLength(7);
    fireEvent.click(within(session).getByRole('radio', { name: '20 min' }));
    expect(lastSavedState()).toBeDefined();
    expect((dbMock.saveWellbeing.mock.calls.at(-1) as unknown as [{ config: WellbeingConfig }])[0].config.sessionMin).toBe(20);
  });

  it('3–6: mission → touch the hand → sun break, without numbers', async () => {
    useWellbeingRecord({ status: 'mission', missionId: 'contar-brinquedos' });
    dbMock.loadAgeProfile.mockResolvedValue('age-3-6');
    render(<App />);
    expect(await screen.findByRole('heading', { name: 'Missão especial!' })).toBeInTheDocument();
    expect(screen.getByText('Conte seus brinquedos')).toBeInTheDocument();
    expect(screen.queryByRole('navigation', { name: 'Navegação principal' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Toque na mão e vá!' }));
    expect(lastSavedState()).toMatchObject({ status: 'break' });
    const sky = await screen.findByRole('button', { name: /O sol está atravessando o céu/ });
    expect(sky).not.toHaveTextContent(/\d/);
    fireEvent.click(sky);
    expect(lastSavedState()).toMatchObject({ insistCount: 1 });
  });

  it('3–6: after the break the child gives a high five and goes back to playing', async () => {
    useWellbeingRecord({ status: 'break', missionId: 'agua', breakStartedAt: Date.now() - 16 * 60_000 });
    dbMock.loadAgeProfile.mockResolvedValue('age-3-6');
    render(<App />);
    fireEvent.click(await screen.findByRole('button', { name: 'Toca aqui!' }));
    expect(lastSavedState()).toMatchObject({ status: 'idle', roundsToday: 1, activeSec: 0 });
    expect(await screen.findByRole('list', { name: 'Brincadeiras' })).toBeInTheDocument();
  });

  it('3–6: shows "Até amanhã" after the last round and outside the allowed hours', async () => {
    useWellbeingRecord({ status: 'done', roundsToday: 2 });
    dbMock.loadAgeProfile.mockResolvedValue('age-3-6');
    const { unmount } = render(<App />);
    expect(await screen.findByRole('heading', { name: 'Até amanhã!' })).toBeInTheDocument();
    expect(screen.queryByRole('list', { name: 'Brincadeiras' })).not.toBeInTheDocument();
    unmount();

    useWellbeingRecord({}, { windowStart: '10:00', windowEnd: '10:00' });
    render(<App />);
    expect(await screen.findByRole('heading', { name: 'Hora de descansar' })).toBeInTheDocument();
  });

  it('3–6: an adult can unlock a pause from the pause screen', async () => {
    useWellbeingRecord({ status: 'break', missionId: 'agua', breakStartedAt: Date.now() });
    dbMock.loadAgeProfile.mockResolvedValue('age-3-6');
    render(<App />);
    await screen.findByRole('heading', { name: 'Hora da missão fora da tela' });
    fireEvent.click(screen.getByRole('button', { name: 'Adultos' }));
    holdGate();
    answerGateSum();
    fireEvent.click(await screen.findByRole('button', { name: 'Liberar agora' }));
    expect(lastSavedState()).toMatchObject({ status: 'idle', activeSec: 0 });
    fireEvent.click(screen.getByRole('button', { name: 'Brincadeiras' }));
    expect(await screen.findByText('Combinado com o adulto. Vamos continuar! Toque em uma brincadeira.')).toBeInTheDocument();
  });

  it('11–13: shows the "Pausa ativa" card and starts the break', async () => {
    useWellbeingRecord({ status: 'mission', missionId: 'area-quarto' });
    dbMock.loadAgeProfile.mockResolvedValue('age-11-13');
    render(<App />);
    expect(await screen.findByRole('heading', { name: 'Pausa ativa' })).toBeInTheDocument();
    expect(screen.getByText(/EF05MA20/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Começar a pausa' }));
    expect(lastSavedState()).toMatchObject({ status: 'break' });
    expect(await screen.findByRole('heading', { name: 'Pausa ativa em andamento' })).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: 'Progresso da pausa' })).toBeInTheDocument();
  });

  it('11–13: locks the PIN for 30 seconds after 3 wrong attempts', async () => {
    const { hashPin } = await import('../wellbeing/core');
    useWellbeingRecord({}, { pinSalt: 'sal', pinHash: await hashPin('4821', 'sal') });
    dbMock.loadAgeProfile.mockResolvedValue('age-11-13');
    render(<App />);
    fireEvent.click(await screen.findByRole('button', { name: 'Progresso' }));
    fireEvent.click(screen.getByRole('button', { name: 'Abrir área dos adultos' }));
    holdGate();
    for (let i = 0; i < 3; i += 1) {
      fireEvent.change(screen.getByLabelText('Digite o PIN dos adultos'), { target: { value: '1111' } });
      fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));
      await screen.findByRole('alert');
    }
    expect(await screen.findByText(/Aguarde 30 segundos/)).toBeInTheDocument();
    expect(screen.getByLabelText('Digite o PIN dos adultos')).toBeDisabled();
  });

  it('11–13: the right PIN opens the screen-time settings', async () => {
    const { hashPin } = await import('../wellbeing/core');
    useWellbeingRecord({}, { pinSalt: 'sal', pinHash: await hashPin('4821', 'sal') });
    dbMock.loadAgeProfile.mockResolvedValue('age-11-13');
    render(<App />);
    fireEvent.click(await screen.findByRole('button', { name: 'Progresso' }));
    fireEvent.click(screen.getByRole('button', { name: 'Abrir área dos adultos' }));
    holdGate();
    fireEvent.change(screen.getByLabelText('Digite o PIN dos adultos'), { target: { value: '4821' } });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));
    expect(await screen.findByRole('heading', { name: 'Pausa saudável' })).toBeInTheDocument();
    expect(within(screen.getByRole('radiogroup', { name: 'Tempo de uso por rodada' })).getByRole('radio', { name: '30 min', checked: true })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Pausar no próximo ponto de parada' }));
    expect(lastSavedState().activeSec).toBe(30 * 60);
  });
});
