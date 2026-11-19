import { useEffect, useState, type CSSProperties } from 'react';

const colors = ['#00e5ff', '#ff8a00', '#ffcb57', '#21c02b', '#0d6efd', '#ffffff'];
type Piece = { id: number; left: number; delay: number; dx: number; rot: number; color: string; scale: number };

/** Chuva de confete. Dispara sempre que `burst` muda para um valor maior que zero. */
export default function Confetti({ burst }: { burst: number }) {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    if (!burst) return;
    setPieces(Array.from({ length: 44 }, (_, id) => ({
      id,
      left: Math.random() * 100,
      delay: Math.random() * 0.35,
      dx: (Math.random() - 0.5) * 220,
      rot: 360 + Math.random() * 540,
      color: colors[id % colors.length],
      scale: 0.6 + Math.random() * 0.7
    })));
    const timer = window.setTimeout(() => setPieces([]), 2400);
    return () => window.clearTimeout(timer);
  }, [burst]);

  if (!pieces.length) return null;
  return <div className="confetti" aria-hidden="true">
    {pieces.map(piece => <i key={burst + '-' + piece.id} style={{
      left: piece.left + '%',
      background: piece.color,
      animationDelay: piece.delay + 's',
      transform: 'scale(' + piece.scale + ')',
      '--dx': piece.dx + 'px',
      '--rot': piece.rot + 'deg'
    } as CSSProperties} />)}
  </div>;
}
