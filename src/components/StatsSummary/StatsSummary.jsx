import React from 'react';
import { TrendingUp, TrendingDown, ArrowDownRight, ArrowUpRight, BarChart2, Hash } from 'lucide-react';
import { calculatePeriodStats, formatExchangeRate } from '../../utils/currencyUtils.js';
import { formatIsoDateToBR } from '../../utils/dateUtils.js';
import styles from './StatsSummary.module.css';

/**
 * Resumo dos indicadores estatísticos do período histórico selecionado.
 *
 * @param {{
 *   records: Array<{ date: string, rate: number }>,
 *   baseCurrency: string,
 *   targetCurrency: string,
 *   loading?: boolean
 * }} props
 */
export function StatsSummary({
  records = [],
  baseCurrency,
  targetCurrency,
  loading = false,
}) {
  const stats = calculatePeriodStats(records);

  if (loading || !stats) {
    return null;
  }

  const isPositive = stats.percentageChange >= 0;
  const changeFormatted = `${isPositive ? '+' : ''}${stats.percentageChange.toFixed(2)}%`;

  return (
    <div className={styles.grid} aria-label="Estatísticas do Período">
      {/* Cotação Mínima */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Mínima no Período</span>
          <ArrowDownRight size={16} className={styles.iconMin} />
        </div>
        <div className={styles.rateValue}>{formatExchangeRate(stats.minRate)}</div>
        <div className={styles.cardFooter}>
          {targetCurrency} &bull; em {formatIsoDateToBR(stats.minDate)}
        </div>
      </div>

      {/* Cotação Máxima */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Máxima no Período</span>
          <ArrowUpRight size={16} className={styles.iconMax} />
        </div>
        <div className={styles.rateValue}>{formatExchangeRate(stats.maxRate)}</div>
        <div className={styles.cardFooter}>
          {targetCurrency} &bull; em {formatIsoDateToBR(stats.maxDate)}
        </div>
      </div>

      {/* Cotação Média */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Média no Período</span>
          <BarChart2 size={16} className={styles.iconAvg} />
        </div>
        <div className={styles.rateValue}>{formatExchangeRate(stats.averageRate)}</div>
        <div className={styles.cardFooter}>
          Média aritmética de {stats.count} registros
        </div>
      </div>

      {/* Variação no Período */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Variação no Período</span>
          {isPositive ? (
            <TrendingUp size={16} className={styles.iconPositive} />
          ) : (
            <TrendingDown size={16} className={styles.iconNegative} />
          )}
        </div>
        <div
          className={`${styles.rateValue} ${
            isPositive ? styles.textPositive : styles.textNegative
          }`}
        >
          {changeFormatted}
        </div>
        <div className={styles.cardFooter}>
          De {formatExchangeRate(stats.firstRate)} para {formatExchangeRate(stats.lastRate)}
        </div>
      </div>
    </div>
  );
}
