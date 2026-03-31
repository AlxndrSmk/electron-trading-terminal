export type ThemeMode = 'dark' | 'light';

export interface Instrument {
  id: string;
  symbol: string;
  name: string;
  base: string;
  quote: string;
}

export interface PriceTick {
  symbol: string;
  bid: number;
  ask: number;
  timestamp: number;
}

export interface PricePoint {
  timestamp: number;
  mid: number;
}

export interface PriceStateEntry {
  symbol: string;
  bid: number;
  ask: number;
  timestamp: number;
  previousBid: number | null;
  previousAsk: number | null;
  history: PricePoint[];
}
