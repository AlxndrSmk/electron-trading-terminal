import type { ThemeMode } from '@shared/types';

declare global {
  interface Window {
    electronAPI: {
      openTradeDetails: (symbol: string) => Promise<{ ok: boolean }>;
      publishSelection: (symbol: string) => void;
      onSelectionUpdated: (callback: (symbol: string) => void) => () => void;
      getSelection: () => Promise<string>;
      setTheme: (theme: ThemeMode) => void;
      getTheme: () => Promise<ThemeMode>;
      onThemeUpdated: (callback: (theme: ThemeMode) => void) => () => void;
    };
  }
}

export {};
