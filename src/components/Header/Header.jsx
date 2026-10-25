import React from 'react';
import { ArrowLeftRight } from 'lucide-react';
import styles from './Header.module.css';

/**
 * Cabeçalho institucional do Currency Exchange App.
 */
export function Header() {
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
      </div>
    </header>
  );
}
