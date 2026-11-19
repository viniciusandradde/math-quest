import { kit } from '../app/kit';

type Props = { id: string; className?: string; locked?: boolean; alt?: string };

export default function Item({ id, className = 'h-8 w-8', locked = false, alt = '' }: Props) {
  return <img src={kit.item(id)} alt={alt} draggable={false} className={'select-none object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,.4)] ' + (locked ? 'item-locked ' : '') + className} />;
}
