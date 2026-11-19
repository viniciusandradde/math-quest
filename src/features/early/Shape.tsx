import type React from 'react';
import type { ColorId, ShapeId, ShapeToken } from '../../learning/early';

export const shapeFill: Record<ColorId, string> = { azul: '#3d8bff', amarelo: '#ffcb57', verde: '#3ddc4a', laranja: '#ff8a00' };

type Props = { token: ShapeToken; className?: string; title?: string };

/** Forma geométrica grande e arredondada, com contorno claro; "pequeno" ocupa metade do espaço. */
export default function Shape({ token, className = 'h-16 w-16', title }: Props) {
  const fill = shapeFill[token.color];
  const common = { fill, stroke: '#ffffff', strokeWidth: 4, strokeLinejoin: 'round' as const };
  const paths: Record<ShapeId, React.ReactNode> = {
    circulo: <circle cx="50" cy="50" r="38" {...common} />,
    quadrado: <rect x="14" y="14" width="72" height="72" rx="8" {...common} />,
    triangulo: <path d="M50 12 L88 84 L12 84 Z" {...common} />,
    retangulo: <rect x="6" y="28" width="88" height="46" rx="8" {...common} />,
    oval: <ellipse cx="50" cy="50" rx="44" ry="28" {...common} />,
    losango: <path d="M50 6 L86 50 L50 94 L14 50 Z" {...common} />,
    estrela: <path d="M 50.0 10.0 L 61.2 38.6 L 91.8 40.4 L 68.1 59.9 L 75.9 89.6 L 50.0 73.0 L 24.1 89.6 L 31.9 59.9 L 8.2 40.4 L 38.8 38.6 Z" {...common} />
  };
  const small = token.size === 'pequeno';
  return <svg viewBox="0 0 100 100" className={'drop-shadow-[0_6px_10px_rgba(0,0,0,.35)] ' + className} role={title ? 'img' : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
    {small ? <g transform="translate(26 26) scale(0.48)">{paths[token.shape]}</g> : paths[token.shape]}
  </svg>;
}
