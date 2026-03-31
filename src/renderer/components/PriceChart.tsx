import { memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { makeSelectSymbolHistory } from '@renderer/store/selectors';

interface PriceChartProps {
  symbol: string;
  title?: string;
}

function PriceChartBase({ symbol, title }: PriceChartProps) {
  const selectHistory = useMemo(() => makeSelectSymbolHistory(symbol), [symbol]);
  const history = useSelector(selectHistory);

  return (
    <section className="panel chart-panel">
      <div className="panel-title">{title ?? `${symbol} Mid Price`}</div>
      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={history}>
            <defs>
              <linearGradient id={`gradient-${symbol}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4fd1c5" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#4fd1c5" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="timestamp"
              tickFormatter={(value: number) =>
                new Date(value).toLocaleTimeString([], { minute: '2-digit', second: '2-digit' })
              }
              minTickGap={40}
              stroke="#7d8aa3"
            />
            <YAxis domain={['auto', 'auto']} stroke="#7d8aa3" width={75} />
            <Tooltip
              labelFormatter={(value) => new Date(value as number).toLocaleTimeString()}
              formatter={(value) => [Number(value).toFixed(4), 'Mid']}
            />
            <Area
              type="monotone"
              dataKey="mid"
              stroke="#4fd1c5"
              fill={`url(#gradient-${symbol})`}
              strokeWidth={2}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export const PriceChart = memo(PriceChartBase);
