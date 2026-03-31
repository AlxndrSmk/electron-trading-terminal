import { useEffect, useRef } from 'react';
import type { PriceTick } from '@shared/types';
import { useAppDispatch } from './useAppDispatch';
import { applyTicks } from '@renderer/store/slices/pricesSlice';
import { MockPriceSocket } from '@renderer/services/mockPriceSocket';

export function useMockFeed(): void {
  const dispatch = useAppDispatch();
  const gotAnyTickRef = useRef(false);

  useEffect(() => {
    const socket = new MockPriceSocket();
    const fallbackPrices = new Map<string, number>([
      ['BTC-USD', 68125],
      ['ETH-USD', 3520],
      ['SOL-USD', 178],
      ['XRP-USD', 0.62],
      ['ADA-USD', 0.49],
      ['DOGE-USD', 0.17],
    ]);
    let fallbackTimer: ReturnType<typeof setInterval> | null = null;
    let fallbackActivationTimer: ReturnType<typeof setTimeout> | null = null;

    const unsubscribe = socket.subscribe((tick) => {
      gotAnyTickRef.current = true;
      dispatch(applyTicks([tick]));
    });

    socket.start();

    fallbackActivationTimer = setTimeout(() => {
      if (gotAnyTickRef.current) {
        return;
      }

      fallbackTimer = setInterval(() => {
        const symbols = Array.from(fallbackPrices.keys());
        const updates: PriceTick[] = [];
        const updateCount = 1 + Math.floor(Math.random() * 3);
        for (let i = 0; i < updateCount; i += 1) {
          const symbol = symbols[Math.floor(Math.random() * symbols.length)];
          const previous = fallbackPrices.get(symbol) ?? 1;
          const drift = previous * (Math.random() * 0.004 - 0.002);
          const mid = Math.max(0.00001, previous + drift);
          fallbackPrices.set(symbol, mid);
          const spread = Math.max(mid * 0.0004, 0.00001);
          updates.push({
            symbol,
            bid: Number((mid - spread / 2).toFixed(mid > 1 ? 2 : 5)),
            ask: Number((mid + spread / 2).toFixed(mid > 1 ? 2 : 5)),
            timestamp: Date.now(),
          });
        }
        if (updates.length > 0) {
          dispatch(applyTicks(updates));
        }
      }, 120);
    }, 1500);

    return () => {
      unsubscribe();
      socket.stop();
      if (fallbackActivationTimer !== null) {
        clearTimeout(fallbackActivationTimer);
      }
      if (fallbackTimer !== null) {
        clearInterval(fallbackTimer);
      }
    };
  }, [dispatch]);
}
