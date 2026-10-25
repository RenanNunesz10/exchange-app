import React from 'react';
import { ExternalLink, Code } from 'lucide-react';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.info}>
          <p className={styles.projectName}>
            <strong>Currency Exchange App</strong> &bull; Projeto Individual SPA em React
          </p>
          <p className={styles.disclaimer}>
            Dados cambiais fornecidos pela{' '}
            <a
              href="https://frankfurter.dev"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              Frankfurter API <ExternalLink size={12} />
            </a>{' '}
            (referência oficial do Banco Central Europeu).
          </p>
        </div>

        <div className={styles.techStack}>
          <span className={styles.tag}><Code size={12} /> React 19</span>
          <span className={styles.tag}>Vite</span>
          <span className={styles.tag}>CSS Modules</span>
          <span className={styles.tag}>Recharts</span>
        </div>
      </div>
    </footer>
  );
}
