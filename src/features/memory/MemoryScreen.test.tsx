import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import MemoryScreen from './MemoryScreen';
import { buildMemoryDeck, memoryPairs } from '../../learning/memory';

const fixedRandom = () => 0.5;
const deck = buildMemoryDeck(fixedRandom);
const position = (pairId: string, kind: 'operation' | 'result') => deck.findIndex(card => card.pairId === pairId && card.kind === kind) + 1;
const cardButton = (pairId: string, kind: 'operation' | 'result') => screen.getByRole('button', { name: 'Carta ' + position(pairId, kind) + ', virada para baixo' });

describe('MemoryScreen', () => {
  afterEach(() => vi.useRealTimers());

  it('starts with every card face down', () => {
    render(<MemoryScreen onBack={() => {}} random={fixedRandom} />);
    expect(screen.getAllByRole('button', { name: /virada para baixo/ })).toHaveLength(memoryPairs.length * 2);
    expect(screen.getByText('Pares: 0 / ' + memoryPairs.length)).toBeInTheDocument();
  });

  it('explains a found pair', () => {
    render(<MemoryScreen onBack={() => {}} random={fixedRandom} />);
    fireEvent.click(cardButton('percentage', 'operation'));
    fireEvent.click(cardButton('percentage', 'result'));
    expect(screen.getByRole('status')).toHaveTextContent('Par encontrado! 25% de 80 = 20.');
    expect(screen.getByRole('button', { name: 'Operação: 25% de 80, par encontrado' })).toBeDisabled();
  });

  it('hides a mismatch after a pause without counting it as a pair', () => {
    vi.useFakeTimers();
    render(<MemoryScreen onBack={() => {}} random={fixedRandom} />);
    fireEvent.click(cardButton('percentage', 'operation'));
    fireEvent.click(cardButton('decimals', 'result'));
    expect(screen.getByRole('status')).toHaveTextContent('25% de 80 não resulta em 4,25');
    expect(screen.getByText('Tentativas: 1')).toBeInTheDocument();
    act(() => { vi.advanceTimersByTime(3000); });
    expect(screen.getAllByRole('button', { name: /virada para baixo/ })).toHaveLength(memoryPairs.length * 2);
    expect(screen.getByText('Pares: 0 / ' + memoryPairs.length)).toBeInTheDocument();
  });

  it('reports the session when every pair is found', () => {
    const onComplete = vi.fn();
    render(<MemoryScreen onBack={() => {}} onComplete={onComplete} random={fixedRandom} />);
    for (const pair of memoryPairs) {
      fireEvent.click(cardButton(pair.id, 'operation'));
      fireEvent.click(cardButton(pair.id, 'result'));
    }
    expect(screen.getByText('Todos os ' + memoryPairs.length + ' pares encontrados!')).toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledWith(expect.objectContaining({ attempts: memoryPairs.length, pairs: memoryPairs.length }));

    fireEvent.click(screen.getByRole('button', { name: 'Jogar novamente' }));
    expect(screen.getByText('Pares: 0 / ' + memoryPairs.length)).toBeInTheDocument();
  });
});
