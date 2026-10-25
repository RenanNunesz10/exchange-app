import React from 'react';
import { Loader2, AlertCircle, Inbox, RefreshCw } from 'lucide-react';
import styles from './FeedbackState.module.css';

/**
 * Componente reutilizável para estados de Loading, Erro e Empty State.
 *
 * @param {{
 *   type: 'loading' | 'error' | 'empty',
 *   title?: string,
 *   message?: string,
 *   actionLabel?: string,
 *   onAction?: () => void
 * }} props
 */
export function FeedbackState({
  type = 'loading',
  title,
  message,
  actionLabel,
  onAction,
}) {
  if (type === 'loading') {
    return (
      <div className={`${styles.container} ${styles.loading}`} role="status">
        <Loader2 className={styles.spinner} size={32} />
        <p className={styles.title}>{title || 'Carregando dados...'}</p>
        {message && <p className={styles.message}>{message}</p>}
      </div>
    );
  }

  if (type === 'error') {
    return (
      <div className={`${styles.container} ${styles.error}`} role="alert">
        <AlertCircle className={styles.errorIcon} size={36} />
        <p className={styles.title}>{title || 'Ocorreu um erro'}</p>
        <p className={styles.message}>
          {message || 'Não foi possível carregar as informações. Tente novamente.'}
        </p>
        {onAction && (
          <button type="button" className={styles.actionButton} onClick={onAction}>
            <RefreshCw size={16} />
            <span>{actionLabel || 'Tentar novamente'}</span>
          </button>
        )}
      </div>
    );
  }

  // empty state
  return (
    <div className={`${styles.container} ${styles.empty}`}>
      <Inbox className={styles.emptyIcon} size={40} />
      <p className={styles.title}>{title || 'Nenhum registro encontrado'}</p>
      <p className={styles.message}>
        {message || 'Ajuste os filtros ou selecione outro intervalo para visualizar os dados.'}
      </p>
      {onAction && (
        <button type="button" className={styles.secondaryButton} onClick={onAction}>
          <span>{actionLabel || 'Limpar filtros'}</span>
        </button>
      )}
    </div>
  );
}
