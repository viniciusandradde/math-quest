import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('virtual:pwa-register', () => ({ registerSW: () => async () => {} }));
vi.mock('../lib/db', () => ({
  getProgressSummary: vi.fn(async () => ({ factsSeen: 0, attempts: 0, correct: 0, accuracy: 0 })),
  recordAnswer: vi.fn(async () => {}),
  saveDiagnostic: vi.fn(async () => {})
}));

import App from './App';

describe('App shell', () => {
  it('renders the home screen and main navigation', async () => {
    render(<App />);
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('Sua próxima descoberta');
    const nav = screen.getByRole('navigation', { name: 'Navegação principal' });
    expect(nav).toBeInTheDocument();
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

  it('opens the strategic challenges', async () => {
    render(<App />);
    fireEvent.click(await screen.findByRole('button', { name: /Iniciar missão estratégica/ }));
    expect(screen.getByText(/DESAFIO 1 \//)).toBeInTheDocument();
  });
});
