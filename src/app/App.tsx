import { useEffect, useState } from 'react';
import { loadAgeProfile, saveAgeProfile } from '../lib/db';
import type { AgeProfileId } from '../learning/profiles';
import { stopVoice } from '../lib/voice';
import ProfileSelectScreen from '../features/profile/ProfileSelectScreen';
import EarlyApp from './EarlyApp';
import ExplorerApp from './ExplorerApp';

const logo = import.meta.env.BASE_URL + 'brand/math-quest-logo.svg';

/** Porta de entrada: na primeira vez pede a faixa de idade e depois abre o app certo. */
export default function App() {
  const [profile, setProfile] = useState<AgeProfileId | null | undefined>(undefined);
  const [previous, setPrevious] = useState<AgeProfileId | null>(null);

  useEffect(() => {
    let active = true;
    loadAgeProfile().then(value => { if (active) setProfile(value); }, () => { if (active) setProfile(null); });
    return () => { active = false; };
  }, []);

  function choose(next: AgeProfileId) {
    setProfile(next);
    setPrevious(null);
    void saveAgeProfile(next).catch(error => console.error('Não foi possível salvar o perfil:', error));
  }

  function changeProfile() {
    stopVoice();
    setPrevious(profile ?? null);
    setProfile(null);
  }

  if (profile === undefined) {
    return <div className="flex min-h-screen items-center justify-center" role="status" aria-label="Carregando">
      <img src={logo} alt="" className="h-20 w-20 animate-float" />
    </div>;
  }
  if (profile === null) return <ProfileSelectScreen onSelect={choose} onCancel={previous ? () => choose(previous) : undefined} />;
  return profile === 'age-3-6' ? <EarlyApp onChangeProfile={changeProfile} /> : <ExplorerApp onChangeProfile={changeProfile} />;
}
