import type { ReactNode } from 'react';

type IconProps = { className?: string };
const svg = (path: ReactNode) => ({ className = 'h-6 w-6' }: IconProps) =>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>{path}</svg>;

export const IconHome = svg(<><path d="M3 11.5 12 4l9 7.5" /><path d="M5.5 10v9.5h13V10" /><path d="M10 19.5v-5h4v5" /></>);
export const IconMap = svg(<><path d="M9 4 3 6.5v13L9 17l6 2.5 6-2.5v-13L15 6.5 9 4Z" /><path d="M9 4v13M15 6.5v13" /></>);
export const IconCards = svg(<><rect x="3" y="6" width="11" height="14" rx="2" /><path d="M8 4h11a2 2 0 0 1 2 2v12" /><path d="M8.5 11.5v.01M8.5 15v.01" /></>);
export const IconFlask = svg(<><path d="M9 3h6M10 3v6L4.5 18.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3" /><path d="M7.5 15h9" /></>);
export const IconFamily = svg(<><circle cx="8" cy="8" r="3" /><circle cx="17" cy="9.5" r="2.4" /><path d="M2.5 20a5.5 5.5 0 0 1 11 0M13.5 20a4 4 0 0 1 8 0" /></>);
export const IconSoundOn = svg(<><path d="M4 9.5v5h3.5L12 19V5L7.5 9.5H4Z" /><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" /></>);
export const IconSoundOff = svg(<><path d="M4 9.5v5h3.5L12 19V5L7.5 9.5H4Z" /><path d="m16 9.5 5 5M21 9.5l-5 5" /></>);
export const IconBack = svg(<path d="M15 5l-7 7 7 7" />);
export const IconLock = svg(<><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>);
