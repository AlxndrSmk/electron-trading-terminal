import type { ThemeMode } from './types';

export const IPCChannels = {
  openTradeDetails: 'window:open-trade-details',
  selectionChanged: 'selection:changed',
  selectionUpdated: 'selection:updated',
  getSelection: 'selection:get',
  setTheme: 'theme:set',
  themeUpdated: 'theme:updated',
  getTheme: 'theme:get',
} as const;

export interface SelectionPayload {
  symbol: string;
}

export interface ThemePayload {
  theme: ThemeMode;
}
