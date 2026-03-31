import type { PriceTick } from '@shared/types';

type TickListener = (tick: PriceTick) => void;

const BASE_PRICES: Record<string, number> = {
  'BTC-USD': 68125,
  'ETH-USD': 3520,
  'SOL-USD': 178,
  'XRP-USD': 0.62,
  'ADA-USD': 0.49,
  'DOGE-USD': 0.17,
};

export class MockPriceSocket {
  private readonly listeners = new Set<TickListener>();
  private readonly latest = new Map<string, number>(Object.entries(BASE_PRICES));
  private timer: ReturnType<typeof setTimeout> | null = null;

  private createTick(symbol: string, mid: number): PriceTick {
    const spread = Math.max(mid * 0.0004, 0.00001);
    return {
      symbol,
      bid: Number((mid - spread / 2).toFixed(mid > 1 ? 2 : 5)),
      ask: Number((mid + spread / 2).toFixed(mid > 1 ? 2 : 5)),
      timestamp: Date.now(),
    };
  }

  private emitInitialSnapshot(): void {
    this.latest.forEach((mid, symbol) => {
      const tick = this.createTick(symbol, mid);
      this.listeners.forEach((listener) => listener(tick));
    });
  }

  start(): void {
    if (this.timer) {
      return;
    }

    this.emitInitialSnapshot();

    const emitBatch = () => {
      const symbols = Array.from(this.latest.keys());
      const updateCount = 1 + Math.floor(Math.random() * 3);

      for (let i = 0; i < updateCount; i += 1) {
        const symbol = symbols[Math.floor(Math.random() * symbols.length)];
        const previous = this.latest.get(symbol) ?? 1;
        const drift = previous * (Math.random() * 0.004 - 0.002);
        const mid = Math.max(0.00001, previous + drift);
        this.latest.set(symbol, mid);

        const tick = this.createTick(symbol, mid);

        this.listeners.forEach((listener) => listener(tick));
      }

      this.timer = setTimeout(emitBatch, 100 + Math.floor(Math.random() * 400));
    };

    emitBatch();
  }

  stop(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  subscribe(listener: TickListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}
