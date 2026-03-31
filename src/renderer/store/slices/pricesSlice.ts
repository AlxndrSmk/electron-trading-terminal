import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { PriceStateEntry, PriceTick } from '@shared/types';

const MAX_HISTORY_POINTS = 180;

interface PricesState {
  bySymbol: Record<string, PriceStateEntry>;
}

const initialState: PricesState = {
  bySymbol: {},
};

const pricesSlice = createSlice({
  name: 'prices',
  initialState,
  reducers: {
    applyTicks(state, action: PayloadAction<PriceTick[]>) {
      for (const tick of action.payload) {
        const previous = state.bySymbol[tick.symbol];
        const nextHistory = previous?.history ? [...previous.history] : [];
        nextHistory.push({
          timestamp: tick.timestamp,
          mid: (tick.bid + tick.ask) / 2,
        });

        if (nextHistory.length > MAX_HISTORY_POINTS) {
          nextHistory.splice(0, nextHistory.length - MAX_HISTORY_POINTS);
        }

        state.bySymbol[tick.symbol] = {
          symbol: tick.symbol,
          bid: tick.bid,
          ask: tick.ask,
          timestamp: tick.timestamp,
          previousBid: previous?.bid ?? null,
          previousAsk: previous?.ask ?? null,
          history: nextHistory,
        };
      }
    },
  },
});

export const { applyTicks } = pricesSlice.actions;
export const pricesReducer = pricesSlice.reducer;
