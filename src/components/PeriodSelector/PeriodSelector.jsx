import React from 'react';
import { Calendar } from 'lucide-react';
import { HISTORICAL_PERIODS } from '../../constants/periods.js';
import styles from './PeriodSelector.module.css';

/**
 * Seletor dos 8 períodos históricos obrigatórios.
 *
 * @param {{
 *   selectedPeriod: string,
 *   onSelectPeriod: (periodId: string) => void,
 *   disabled?: boolean
 * }} props
 */
export function PeriodSelector({
  selectedPeriod,
  onSelectPeriod,
  disabled = false,
}) {
  return (
    <div className={styles.container} aria-label="Seletor de Período Histórico">
      <div className={styles.labelWrapper}>
        <Calendar size={16} className={styles.icon} />
        <span className={styles.label}>Período de análise:</span>
      </div>

      <div className={styles.buttonGroup} role="group" aria-label="Períodos disponíveis">
        {HISTORICAL_PERIODS.map((p) => {
          const isActive = p.id === selectedPeriod;
          return (
            <button
              key={p.id}
              type="button"
              disabled={disabled}
              className={`${styles.periodButton} ${isActive ? styles.active : ''}`}
              onClick={() => onSelectPeriod(p.id)}
              title={`Visualizar dados dos últimos ${p.label}`}
              aria-pressed={isActive}
            >
              <span className={styles.shortLabel}>{p.shortLabel}</span>
              <span className={styles.fullLabel}>{p.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
