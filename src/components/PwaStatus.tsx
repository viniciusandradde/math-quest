import { useEffect, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

export default function PwaStatus() {
  const [online, setOnline] = useState(() => typeof navigator === 'undefined' ? true : navigator.onLine);
  const [installEvent, setInstallEvent] = useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(() => typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(display-mode: standalone)').matches);
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

  if (online && !(installEvent && !installed) && !updateAvailable) {
    return <p role="status" className="sr-only">Conectado</p>;
  }

  return <section aria-label="Estado do aplicativo" className="mb-4 flex flex-wrap items-center gap-2 text-xs animate-pop">
    <span role="status" className={'rounded-full border px-3 py-2 font-semibold ' + (online ? 'border-mq-cyan/30 bg-mq-cyan/10 text-[#b9f6ff]' : 'border-mq-orange/40 bg-mq-orange/15 text-mq-yellow')}>
      {online ? '● Conectado' : '● Sem internet · recursos já carregados podem funcionar'}
    </span>
    {installed && <span className="rounded-full border border-mq-green/40 px-3 py-2 text-[#7dff84]">Instalado</span>}
    {installEvent && !installed && <button type="button" onClick={() => void install()} className="btn btn-cyan px-3 py-2 text-xs">Instalar aplicativo</button>}
    {updateAvailable && <button type="button" onClick={() => { if (updateSW) void updateSW(true); }} className="btn btn-action px-3 py-2 text-xs">Atualizar aplicativo</button>}
  </section>;
}
