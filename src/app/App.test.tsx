import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { summarizeChallengeAttempts } from '../learning/challenges';
import { summarizeEarlyAttempts } from '../learning/early';

const dbMock = vi.hoisted(() => ({
  loadAgeProfile: vi.fn(),
  saveAgeProfile: vi.fn(async () => {}),
  getEarlySummary: vi.fn(),
  recordEarlyAttempt: vi.fn(async () => {}),
  getLearningOverview: vi.fn(),
  recordAnswer: vi.fn(async () => {}),
  recordChallengeAttempt: vi.fn(async () => {}),
  saveDiagnostic: vi.fn(async () => {}),
  saveMemorySession: vi.fn(async () => {})
}));

vi.mock('virtual:pwa-register', () => ({ registerSW: () => async () => {} }));
vi.mock('../lib/db', () => dbMock);

import App from './App';

const emptyOverview = () => ({
  multiplication: { factsSeen: 0, attempts: 0, correct: 0, accuracy: 0 },
  challenges: summarizeChallengeAttempts([]),
  memory: { sessions: 0, bestAttempts: null },
  diagnosticCompleted: false
});

describe('age profile gate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
    fireEvent.click(screen.getByRole('button', { name: 'Trocar perfil de idade' }));
    fireEvent.click(screen.getByRole('button', { name: 'Escolher outro perfil' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Explorador Estratégico, 11 a 13 anos' }));
    expect(dbMock.saveAgeProfile).toHaveBeenLastCalledWith('age-11-13');
    expect(await screen.findByRole('button', { name: /JOGAR/ })).toBeInTheDocument();
  });

  it('can go back without switching', async () => {
    dbMock.loadAgeProfile.mockResolvedValue('age-11-13');
    render(<App />);
    fireEvent.click(await screen.findByRole('button', { name: 'Progresso' }));
    fireEvent.click(screen.getByRole('button', { name: 'Trocar perfil de idade' }));
    fireEvent.click(screen.getByRole('button', { name: 'Escolher outro perfil' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Voltar sem trocar' }));
    expect(await screen.findByRole('button', { name: /JOGAR/ })).toBeInTheDocument();
    expect(dbMock.saveAgeProfile).toHaveBeenLastCalledWith('age-11-13');
  });
});

describe('11–13 explorer app', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
