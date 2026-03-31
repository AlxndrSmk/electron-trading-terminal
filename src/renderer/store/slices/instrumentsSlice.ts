import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import type { Instrument } from '@shared/types';

const instrumentsAdapter = createEntityAdapter<Instrument>({
  sortComparer: (a, b) => a.symbol.localeCompare(b.symbol),
});

const initialInstruments: Instrument[] = [
  { id: 'BTC-USD', symbol: 'BTC-USD', name: 'Bitcoin', base: 'BTC', quote: 'USD' },
  { id: 'ETH-USD', symbol: 'ETH-USD', name: 'Ethereum', base: 'ETH', quote: 'USD' },
  { id: 'SOL-USD', symbol: 'SOL-USD', name: 'Solana', base: 'SOL', quote: 'USD' },
  { id: 'XRP-USD', symbol: 'XRP-USD', name: 'Ripple', base: 'XRP', quote: 'USD' },
  { id: 'ADA-USD', symbol: 'ADA-USD', name: 'Cardano', base: 'ADA', quote: 'USD' },
  { id: 'DOGE-USD', symbol: 'DOGE-USD', name: 'Dogecoin', base: 'DOGE', quote: 'USD' },
];

const instrumentsSlice = createSlice({
  name: 'instruments',
  initialState: instrumentsAdapter.setAll(instrumentsAdapter.getInitialState(), initialInstruments),
  reducers: {},
});

export const instrumentsReducer = instrumentsSlice.reducer;
export const instrumentsSelectors = instrumentsAdapter.getSelectors();
