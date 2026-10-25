import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { formatIsoDateToBR, formatIsoDateForChart } from '../../utils/dateUtils.js';
import { formatExchangeRate } from '../../utils/currencyUtils.js';
import { FeedbackState } from '../FeedbackState/FeedbackState.jsx';
import styles from './HistoryChart.module.css';

/**
 * Custom Tooltip para o Recharts
 */
function CustomChartTooltip({ active, payload, label, targetCurrency, baseCurrency }) {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload;
    return (
      <div className={styles.tooltipBox}>
        <p className={styles.tooltipDate}>{formatIsoDateToBR(dataPoint.date)}</p>
        <p className={styles.tooltipValue}>
          1 {baseCurrency} = <strong>{formatExchangeRate(dataPoint.rate)}</strong> {targetCurrency}
        </p>
      </div>
    );
  }
  return null;
}

/**
 * Gráfico interativo de histórico cambial utilizando Recharts.
 *
 * @param {{
 *   records: Array<{ date: string, rate: number }>,
 *   baseCurrency: string,
 *   targetCurrency: string,
 *   selectedPeriod: string,
 *   periodLabel: string,
 *   loading: boolean,
 *   error: string | null,
 *   onRetry: () => void
 * }} props
 */
export function HistoryChart({
  records = [],
  baseCurrency,
  targetCurrency,
  selectedPeriod,
  periodLabel,
  loading,
  error,
  onRetry,
}) {
  if (loading) {
    return (
      <section className={styles.chartCard} aria-label="Gráfico de Evolução Histórica">
        <div className={styles.header}>
          <h2 className={styles.title}>Evolução Histórica ({baseCurrency} &rarr; {targetCurrency})</h2>
          <span className={styles.badge}>{periodLabel}</span>
        </div>
        <FeedbackState
          type="loading"
          title="Carregando histórico cambial..."
          message="Buscando série temporal na API Frankfurter."
        />
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.chartCard} aria-label="Gráfico de Evolução Histórica">
        <div className={styles.header}>
          <h2 className={styles.title}>Evolução Histórica ({baseCurrency} &rarr; {targetCurrency})</h2>
          <span className={styles.badge}>{periodLabel}</span>
        </div>
        <FeedbackState
          type="error"
          title="Falha ao carregar gráfico"
          message={error}
          actionLabel="Recarregar gráfico"
          onAction={onRetry}
        />
      </section>
    );
  }

  if (records.length === 0) {
    return (
      <section className={styles.chartCard} aria-label="Gráfico de Evolução Histórica">
        <div className={styles.header}>
          <h2 className={styles.title}>Evolução Histórica ({baseCurrency} &rarr; {targetCurrency})</h2>
          <span className={styles.badge}>{periodLabel}</span>
        </div>
        <FeedbackState
          type="empty"
          title="Sem dados para o período"
          message="Não encontramos cotações para este intervalo de datas."
        />
      </section>
    );
  }

  // Calcula domínio do eixo Y com margem de respiro de 1%
  const rates = records.map((r) => Number(r.rate));
  const minRate = Math.min(...rates);
  const maxRate = Math.max(...rates);
  const diff = maxRate - minRate || maxRate * 0.05 || 0.01;
  const yDomainMin = Math.max(0, +(minRate - diff * 0.1).toFixed(4));
  const yDomainMax = +(maxRate + diff * 0.1).toFixed(4);

  return (
    <section className={styles.chartCard} aria-label="Gráfico de Evolução Histórica">
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>
            Evolução Histórica: <span>{baseCurrency} &rarr; {targetCurrency}</span>
          </h2>
          <p className={styles.subtitle}>
            Acompanhe as oscilações cambiais consolidadas dia a dia
          </p>
        </div>
        <span className={styles.badge}>{periodLabel}</span>
      </div>

      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={360}>
          <AreaChart data={records} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="rateGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />

            <XAxis
              dataKey="date"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              tickFormatter={(date) => formatIsoDateForChart(date, selectedPeriod)}
              minTickGap={28}
            />

            <YAxis
              domain={[yDomainMin, yDomainMax]}
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => Number(val).toFixed(2)}
              width={50}
            />

            <Tooltip
              content={
                <CustomChartTooltip
                  targetCurrency={targetCurrency}
                  baseCurrency={baseCurrency}
                />
              }
            />

            <Area
              type="monotone"
              dataKey="rate"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#rateGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
