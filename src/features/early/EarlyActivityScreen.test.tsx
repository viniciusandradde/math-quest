import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import EarlyActivityScreen from './EarlyActivityScreen';
import { buildEarlyRound } from '../../learning/early';

function seeded(seed: number) {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

describe('EarlyActivityScreen (3–6)', () => {
  it('explains the activity, lets the child retry and records only first-try evidence', () => {
    const round = buildEarlyRound('formas', 1, seeded(11));
    const onAnswer = vi.fn();
    render(<EarlyActivityScreen activityId="formas" level={1} random={seeded(11)} onBack={() => {}} onAnswer={onAnswer} />);
    // sem voz no jsdom, a explicação aparece inteira como legenda
    expect(screen.getByText(/Vamos conhecer as formas\./)).toBeInTheDocument();

    const first = round[0];
    const wrongIndex = first.answerIndex === 0 ? 1 : 0;
    fireEvent.click(screen.getByRole('button', { name: first.options[wrongIndex].label }));
    expect(onAnswer).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: first.options[wrongIndex].label })).toBeDisabled();
    expect(screen.getByText(new RegExp(first.hint[0].slice(0, 20)))).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: first.options[first.answerIndex].label }));
    expect(onAnswer).toHaveBeenCalledWith(expect.objectContaining({ activity: 'formas', level: 1, firstTry: false, tries: 2 }));

    for (let i = 1; i < round.length; i += 1) {
      fireEvent.click(screen.getByRole('button', { name: /Próxima/ }));
      fireEvent.click(screen.getByRole('button', { name: round[i].options[round[i].answerIndex].label }));
    }
    expect(onAnswer).toHaveBeenCalledTimes(round.length);
    expect(onAnswer).toHaveBeenLastCalledWith(expect.objectContaining({ firstTry: true, tries: 1 }));
    fireEvent.click(screen.getByRole('button', { name: 'Ver minhas estrelas' }));
    expect(screen.getByText('Você terminou a brincadeira!')).toBeInTheDocument();
    expect(screen.getByLabelText('Estrelas: ' + (round.length - 1) + ' de ' + round.length)).toBeInTheDocument();
  });

  it('lets the child tap each object to count it one by one', () => {
    const round = buildEarlyRound('contar', 2, seeded(5));
    const scene = round[0].scene;
    if (scene.kind !== 'count') throw new Error('scene');
    render(<EarlyActivityScreen activityId="contar" level={2} random={seeded(5)} onBack={() => {}} onAnswer={() => {}} />);
    const items = screen.getAllByRole('button', { name: 'Tocar para contar' });
    expect(items).toHaveLength(scene.count);
    items.forEach(item => fireEvent.click(item));
    expect(screen.getByRole('button', { name: 'Contado: ' + scene.count })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Tocar para contar' })).not.toBeInTheDocument();
  });

  it('shows dot helpers under numerals for the youngest level', () => {
    const round = buildEarlyRound('contar', 1, seeded(9));
    render(<EarlyActivityScreen activityId="contar" level={1} random={seeded(9)} onBack={() => {}} onAnswer={() => {}} />);
    const option = screen.getByRole('button', { name: round[0].options[0].label });
    expect(within(option).getByText(String(round[0].options[0].number))).toBeInTheDocument();
    expect(option.querySelectorAll('span.rounded-full').length).toBe(round[0].options[0].number);
  });
});
