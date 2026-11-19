import { useEffect, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

export default function PwaStatus() {
  const [online, setOnline] = useState(() => typeof navigator === 'undefined' ? true : navigator.onLine);
  const [installEvent, setInstallEvent] = useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(() => typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateSW, setUpdateSW] = useState<((reloadPage?: boolean) => Promise<void>) | null>(null);

  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    const capturePrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as InstallPromptEvent);
    };
    const markInstalled = () => {
      setInstalled(true);
      setInstallEvent(null);
    };

    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    window.addEventListener('beforeinstallprompt', capturePrompt);
    window.addEventListener('appinstalled', markInstalled);

    const update = registerSW({
      immediate: true,
      onNeedRefresh() { setUpdateAvailable(true); },
      onOfflineReady() { /* Offline resources are ready after the first successful cache. */ },
      onRegisterError(error) { console.error('Falha no registro do PWA:', error); }
    });
    setUpdateSW(() => update);

    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('beforeinstallprompt', capturePrompt);
      window.removeEventListener('appinstalled', markInstalled);
    };
  }, []);

  async function install() {
    if (!installEvent) return;
    await installEvent.prompt();
    await installEvent.userChoice;
    setInstallEvent(null);
  }

  return <section aria-label="Estado do aplicativo" className="mt-4 flex flex-wrap items-center gap-2 text-xs">
    <span role="status" className={'rounded-full border px-3 py-2 font-semibold ' + (online ? 'border-cyan-300/20 bg-cyan-300/10 text-cyan-100' : 'border-orange-300/30 bg-orange-300/10 text-orange-100')}>
      {online ? '● Conectado' : '● Sem internet · recursos já carregados podem funcionar'}
    </span>
    <span className="rounded-full border border-white/10 px-3 py-2 text-slate-300">Versão 0.1.0-beta.1</span>
    {installed && <span className="rounded-full border border-emerald-300/20 px-3 py-2 text-emerald-200">Instalado</span>}
    {installEvent && !installed && <button type="button" onClick={() => void install()} className="rounded-full bg-cyan-300 px-3 py-2 font-bold text-slate-950">Instalar aplicativo</button>}
    {updateAvailable && <button type="button" onClick={() => { if (updateSW) void updateSW(true); }} className="rounded-full bg-orange-400 px-3 py-2 font-bold text-slate-950">Atualizar aplicativo</button>}
  </section>;
}
