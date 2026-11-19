import Item from '../../components/Item';
import type { EarlyActivity } from '../../learning/early';
import Shape from './Shape';

/** Ilustração do cartão de cada brincadeira. */
export default function ActivityIcon({ activity }: { activity: EarlyActivity }) {
  if (activity.icon === 'igual') return <span className="flex items-center gap-1"><Shape token={{ shape: 'circulo', color: 'azul' }} className="h-12 w-12" /><span className="text-2xl font-black text-white">=</span><Shape token={{ shape: 'circulo', color: 'azul' }} className="h-12 w-12" /></span>;
  if (activity.icon === 'formas') return <span className="flex items-end gap-1"><Shape token={{ shape: 'circulo', color: 'amarelo' }} className="h-11 w-11" /><Shape token={{ shape: 'quadrado', color: 'azul' }} className="h-11 w-11" /><Shape token={{ shape: 'triangulo', color: 'verde' }} className="h-11 w-11" /></span>;
  if (activity.icon === 'sequencias') return <span className="flex items-center gap-0.5"><Shape token={{ shape: 'circulo', color: 'laranja' }} className="h-9 w-9" /><Shape token={{ shape: 'quadrado', color: 'azul' }} className="h-9 w-9" /><Shape token={{ shape: 'circulo', color: 'laranja' }} className="h-9 w-9" /><span className="ml-1 flex h-9 w-9 items-center justify-center rounded-lg border-2 border-dashed border-white/70 text-xl font-black text-white">?</span></span>;
  if (activity.id === 'juntar') return <span className="flex items-center gap-1"><Item id="cristal" className="h-10 w-10" /><span className="text-2xl font-black text-white">+</span><Item id="cristal" className="h-10 w-10" /></span>;
  if (activity.id === 'comparar') return <span className="flex items-end gap-2"><span className="flex"><Item id="moeda" className="h-9 w-9" /></span><span className="flex -space-x-3"><Item id="moeda" className="h-9 w-9" /><Item id="moeda" className="h-9 w-9" /><Item id="moeda" className="h-9 w-9" /></span></span>;
  return <span className="flex -space-x-2"><Item id="estrela" className="h-11 w-11" /><Item id="estrela" className="h-11 w-11" /><Item id="estrela" className="h-11 w-11" /></span>;
}
