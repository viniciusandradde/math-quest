import { useState } from 'react';

export default function ArrayLab() {
  const [rows, setRows] = useState(3);
  const [columns, setColumns] = useState(4);
  const total = rows * columns;
  return <section className="mt-6 rounded-3xl border border-cyan-300/20 bg-[#0b1b30] p-5 sm:p-7">
    <p className="text-xs font-bold uppercase tracking-[.2em] text-cyan-300">Laboratório visual · CPA</p>
    <h2 className="mt-2 text-2xl font-black">Monte sua matriz</h2>
    <p className="mt-2 text-sm text-slate-300">Escolha quantas linhas e colunas terá sua matriz. Observe como a mesma quantidade pode ser organizada de maneiras diferentes.</p>
    <div className="mt-5 grid grid-cols-2 gap-4">
      <label className="text-sm text-slate-300">Linhas
        <select value={rows} onChange={event => setRows(Number(event.target.value))} className="mt-2 block w-full rounded-lg border border-white/15 bg-slate-900 p-3 text-white">
          {[2,3,4,5].map(value => <option key={value} value={value}>{value}</option>)}
        </select>
      </label>
      <label className="text-sm text-slate-300">Colunas
        <select value={columns} onChange={event => setColumns(Number(event.target.value))} className="mt-2 block w-full rounded-lg border border-white/15 bg-slate-900 p-3 text-white">
          {[2,3,4,5].map(value => <option key={value} value={value}>{value}</option>)}
        </select>
      </label>
    </div>
    <div className="mx-auto my-7 grid max-w-xs gap-2" style={{gridTemplateRows: 'repeat(' + rows + ', minmax(0, 1fr)'}}>
      {Array.from({length:rows},(_,row)=><div key={row} className="grid gap-2" style={{gridTemplateColumns:'repeat(' + columns + ', minmax(0, 1fr))'}}>
        {Array.from({length:columns},(_,col)=><div key={col} aria-label={'Linha ' + (row+1) + ', coluna ' + (col+1)} className="aspect-square rounded-lg border border-cyan-300/30 bg-cyan-300/10 shadow-[inset_0_0_18px_rgba(34,211,238,.08)]"><div className="flex h-full items-center justify-center text-xl text-cyan-200">●</div></div>)}
      </div>)}
    </div>
    <div className="rounded-2xl bg-slate-950/50 p-4 text-center">
      <p className="text-xs uppercase tracking-widest text-slate-400">Representação abstrata</p>
      <p className="mt-2 text-3xl font-black text-white">{rows} × {columns} = <span className="text-orange-300">{total}</span></p>
      <p className="mt-2 text-sm text-slate-300">{Array.from({length:rows},()=>columns).join(' + ')} = {total}</p>
      <p className="mt-2 text-xs text-cyan-200">Concreto: grupos · Pictórico: matriz · Abstrato: multiplicação</p>
    </div>
    <p className="mt-4 text-sm text-slate-400">Desafio: troque linhas por colunas. O total muda? Você acabou de explorar a propriedade comutativa.</p>
  </section>;
}
