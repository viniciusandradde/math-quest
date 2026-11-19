import type React from 'react';
import { kit } from '../app/kit';

type Props = { id: string; className?: string; locked?: boolean; alt?: string; style?: React.CSSProperties };

export default function Item({ id, className = 'h-8 w-8', locked = false, alt = '', style }: Props) {
  return <img src={kit.item(id)} alt={alt} draggable={false} style={style} className={'select-none object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,.4)] ' + (locked ? 'item-locked ' : '') + className} />;
}
