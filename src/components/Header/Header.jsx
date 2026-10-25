import React from 'react';
import { ArrowLeftRight, Activity } from 'lucide-react';
import styles from './Header.module.css';

/**
 * Cabeçalho institucional do Currency Exchange App.
 *
 * @param {{ lastUpdated?: string }} props
 */
export function Header({ lastUpdated }) {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <div className={styles.logoIcon}>
            <ArrowLeftRight size={24} />
          </div>
          <div>
            <h1 className={styles.title}>Currency Exchange App</h1>
            <p className={styles.subtitle}>
              Conversão e análise histórica com dados oficiais do Banco Central Europeu
            </p>
          </div>
        </div>

        <div className={styles.badgeContainer}>
          <div className={styles.apiBadge}>
            <Activity size={14} className={styles.pulseIcon} />
            <span>API Frankfurter v2</span>
          </div>
          {lastUpdated && (
            <span className={styles.lastUpdated}>
              Cotação de referência: <strong>{lastUpdated}</strong>
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
