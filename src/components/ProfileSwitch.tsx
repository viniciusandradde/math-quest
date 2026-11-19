import { useState } from 'react';
import { getAgeProfile, type AgeProfileId } from '../learning/profiles';

/** Troca de perfil em dois toques, para evitar trocas acidentais pelas crianças. */
export default function ProfileSwitch({ current, onChange }: { current: AgeProfileId; onChange: () => void }) {
  const [confirming, setConfirming] = useState(false);
  const profile = getAgeProfile(current);
  return <div className="mq-card mt-8 p-4">
    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Perfil de idade</p>
    <p className="mt-1 font-bold text-white">{profile.title} · {profile.ageRange}</p>
    {!confirming
      ? <button type="button" onClick={() => setConfirming(true)} className="btn btn-ghost mt-3 text-sm">Trocar perfil de idade</button>
      : <div className="mt-3">
        <p className="text-sm text-slate-200">O progresso de cada perfil continua salvo neste aparelho.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={onChange} className="btn btn-action text-sm">Escolher outro perfil</button>
          <button type="button" onClick={() => setConfirming(false)} className="btn btn-ghost text-sm">Cancelar</button>
        </div>
      </div>}
  </div>;
}
