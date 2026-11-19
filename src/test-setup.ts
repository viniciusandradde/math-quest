import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Sem `globals: true`, o Testing Library não registra a limpeza automática do DOM.
afterEach(() => cleanup());

// jsdom não implementa rolagem; evita ruído "Not implemented: window.scrollTo".
Object.defineProperty(window, 'scrollTo', { value: () => {}, writable: true });
