import { useState } from 'react';

const rowColors = ['bg-mq-cyan shadow-[0_0_12px_rgba(0,229,255,.6)]', 'bg-mq-orange shadow-[0_0_12px_rgba(255,138,0,.6)]', 'bg-mq-yellow shadow-[0_0_12px_rgba(255,203,87,.6)]', 'bg-mq-green shadow-[0_0_12px_rgba(33,192,43,.6)]', 'bg-[#5b9dff] shadow-[0_0_12px_rgba(13,110,253,.6)]'];

function Stepper({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return <div className="mq-card p-3">
    <p className="text-xs font-bold uppercase tracking-wider text-slate-300">{label}</p>
    <div className="mt-2 flex items-center justify-between gap-2">
      <button type="button" onClick={() => onChange(Math.max(2, value - 1))} disabled={value <= 2} aria-label={'Diminuir ' + label.toLowerCase()} className="btn btn-ghost h-11 w-11 p-0 text-xl">−</button>
      <output aria-live="polite" aria-label={label} className="num text-3xl font-black text-white">{value}</output>
      <button type="button" onClick={() => onChange(Math.min(5, value + 1))} disabled={value >= 5} aria-label={'Aumentar ' + label.toLowerCase()} className="btn btn-blue h-11 w-11 p-0 text-xl">+</button>
    </div>
  </div>;
}

export default function ArrayLab() {
  const [rows, setRows] = useState(3);
  const [columns, setColumns] = useState(4);
  const total = rows * columns;
  return <section className="mt-6 rounded-3xl border border-mq-cyan/25 bg-mq-night/50 p-5 sm:p-7">
    <p className="font-display text-xs font-bold uppercase tracking-[.2em] text-mq-cyan">Laboratório visual · CPA</p>
    <h2 className="mt-2 font-display text-2xl font-black text-white">Monte sua matriz</h2>
    <p className="mt-2 text-sm text-slate-300">Escolha quantas linhas e colunas terá sua matriz. Observe como a mesma quantidade pode ser organizada de maneiras diferentes.</p>
    <div className="mt-5 grid grid-cols-2 gap-3">
      <Stepper label="Linhas" value={rows} onChange={setRows} />
      <Stepper label="Colunas" value={columns} onChange={setColumns} />
    </div>
    <div className="mx-auto my-7 grid max-w-xs gap-2.5">
      {Array.from({ length: rows }, (_, row) => <div key={row} className="grid gap-2.5" style={{ gridTemplateColumns: 'repeat(' + columns + ', minmax(0, 1fr))' }}>
        {Array.from({ length: columns }, (_, col) => <div key={col} aria-label={'Linha ' + (row + 1) + ', coluna ' + (col + 1)} className="flex aspect-square items-center justify-center rounded-xl border border-white/10 bg-mq-deep/70 animate-pop" style={{ animationDelay: (row * columns + col) * 18 + 'ms' }}>
          <span className={'h-1/2 w-1/2 rounded-full ' + rowColors[row % rowColors.length]} />
        </div>)}
      </div>)}
    </div>
    <div className="rounded-2xl border border-white/10 bg-mq-navy/80 p-4 text-center">
      <p className="text-xs uppercase tracking-widest text-slate-400">Representação abstrata</p>
      <p className="mt-2 num text-4xl font-black text-white">{rows} × {columns} = <span className="text-mq-orange">{total}</span></p>
      <p className="mt-2 text-sm text-slate-300">{Array.from({ length: rows }, () => columns).join(' + ')} = {total}</p>
      <p className="mt-2 text-xs text-mq-cyan">Concreto: grupos · Pictórico: matriz · Abstrato: multiplicação</p>
    </div>
    <p className="mt-4 text-sm text-slate-300">Desafio: troque linhas por colunas. O total muda? Você acabou de explorar a propriedade comutativa.</p>
  </section>;
}
