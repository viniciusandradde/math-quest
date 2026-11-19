import Item from '../../components/Item';
import type { EarlyActivity } from '../../learning/early';
import Shape from './Shape';

/** Ilustração do cartão de cada brincadeira. */
export default function ActivityIcon({ activity }: { activity: EarlyActivity }) {
  switch (activity.id) {
    case 'igual':
      return <span className="flex items-center gap-1"><Shape token={{ shape: 'circulo', color: 'azul' }} className="h-12 w-12" /><span className="text-2xl font-black text-white">=</span><Shape token={{ shape: 'circulo', color: 'azul' }} className="h-12 w-12" /></span>;
    case 'diferente':
      return <span className="flex items-center gap-0.5"><Shape token={{ shape: 'quadrado', color: 'amarelo' }} className="h-10 w-10" /><Shape token={{ shape: 'quadrado', color: 'amarelo' }} className="h-10 w-10" /><Shape token={{ shape: 'triangulo', color: 'azul' }} className="h-10 w-10" /></span>;
    case 'tamanhos':
      return <span className="flex items-end gap-1"><Item id="estrela" className="h-14 w-14" /><Item id="estrela" className="h-7 w-7" /></span>;
    case 'comparar':
      return <span className="flex items-end gap-2"><Item id="moeda" className="h-9 w-9" /><span className="flex -space-x-3"><Item id="moeda" className="h-9 w-9" /><Item id="moeda" className="h-9 w-9" /><Item id="moeda" className="h-9 w-9" /></span></span>;
    case 'formas':
      return <span className="flex items-end gap-1"><Shape token={{ shape: 'circulo', color: 'amarelo' }} className="h-11 w-11" /><Shape token={{ shape: 'quadrado', color: 'azul' }} className="h-11 w-11" /><Shape token={{ shape: 'triangulo', color: 'verde' }} className="h-11 w-11" /></span>;
    case 'sequencias':
      return <span className="flex items-center gap-0.5"><Shape token={{ shape: 'circulo', color: 'laranja' }} className="h-9 w-9" /><Shape token={{ shape: 'quadrado', color: 'azul' }} className="h-9 w-9" /><Shape token={{ shape: 'circulo', color: 'laranja' }} className="h-9 w-9" /><span className="ml-1 flex h-9 w-9 items-center justify-center rounded-lg border-2 border-dashed border-white/70 text-xl font-black text-white">?</span></span>;
    case 'vizinhos':
      return <span className="flex items-center gap-1">{['1', '2', '?'].map(label => <span key={label} className={'num flex h-10 w-10 items-center justify-center rounded-xl text-xl ' + (label === '?' ? 'border-2 border-dashed border-white/80 text-white' : 'bg-white/90 text-[#0b2a6b]')}>{label}</span>)}</span>;
    case 'juntar':
      return <span className="flex items-center gap-1"><Item id="cristal" className="h-10 w-10" /><span className="text-2xl font-black text-white">+</span><Item id="cristal" className="h-10 w-10" /></span>;
    case 'tirar':
      return <span className="flex items-center gap-0.5"><Item id="chave" className="h-9 w-9" /><Item id="chave" className="h-9 w-9" /><span className="px-0.5 text-2xl font-black text-white">−</span><Item id="chave" className="h-9 w-9 opacity-30 grayscale" /></span>;
    default:
      return <span className="flex -space-x-2"><Item id="estrela" className="h-11 w-11" /><Item id="estrela" className="h-11 w-11" /><Item id="estrela" className="h-11 w-11" /></span>;
  }
}
