import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { summarizeChallengeAttempts } from '../learning/challenges';

const dbMock = vi.hoisted(() => ({
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
  memory: { sessions: 0, bestAttempts: null }
});

describe('App shell', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dbMock.getLearningOverview.mockResolvedValue(emptyOverview());
  });

  it('renders the home screen and main navigation', async () => {
    render(<App />);
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('Sua próxima descoberta');
    expect(screen.getByRole('navigation', { name: 'Navegação principal' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Início' })).toHaveAttribute('aria-current', 'page');
  });

  it('opens the memory game from the home card and from the navigation', async () => {
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
    fireEvent.click(await screen.findByRole('button', { name: /Iniciar missão estratégica/ }));
    expect(screen.getByText(/DESAFIO 1 \//)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/Sua resposta/), { target: { value: '17' } });
    fireEvent.click(screen.getByRole('button', { name: 'Conferir resposta' }));
    expect(screen.getByText(/Código correto!/)).toBeInTheDocument();
    expect(dbMock.recordChallengeAttempt).toHaveBeenCalledWith(expect.objectContaining({ challengeId: 'rescue-stock', correct: true, value: 17 }));
  });

  it('shows challenge and memory progress in the guardian summary', async () => {
    dbMock.getLearningOverview.mockResolvedValue({
      ...emptyOverview(),
      challenges: summarizeChallengeAttempts([
        { challengeId: 'rescue-stock', correct: true, value: 17, answeredAt: '2026-11-19T10:00:00.000Z' },
        { challengeId: 'fraction-parts', correct: false, value: 40, answeredAt: '2026-11-19T10:01:00.000Z' }
      ]),
      memory: { sessions: 3, bestAttempts: 7, lastCompletedAt: '2026-11-19T11:00:00.000Z' }
    });
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Responsáveis' }));
    expect(await screen.findByText('2 / 6')).toBeInTheDocument();
    const list = screen.getByRole('list', { name: 'Progresso por desafio' });
    expect(list).toHaveTextContent('Estoque de energia');
    expect(list).toHaveTextContent('Resolvido');
    expect(list).toHaveTextContent('Em andamento');
    expect(screen.getByText('Partidas concluídas').nextSibling).toHaveTextContent('3');
    expect(screen.getByText('Menos tentativas').nextSibling).toHaveTextContent('7');
  });
});
