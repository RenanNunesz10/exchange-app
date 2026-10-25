import React from 'react';
import { Filter, X, AlertTriangle } from 'lucide-react';
import { validateTableFilters, hasActiveTableFilters } from '../../utils/filterAndSortUtils.js';
import styles from './TableFilters.module.css';

/**
 * Componente de Filtros da Tabela Histórica.
 *
 * @param {{
 *   filters: { startDate: string, endDate: string, minRate: string, maxRate: string },
 *   onFilterChange: (newFilters: object) => void,
 *   onClearFilters: () => void,
 *   disabled?: boolean
 * }} props
 */
export function TableFilters({
  filters,
  onFilterChange,
  onClearFilters,
  disabled = false,
}) {
  const validation = validateTableFilters(filters);
  const isFiltering = hasActiveTableFilters(filters);

  const handleChange = (field, value) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  return (
    <div className={styles.filterContainer} aria-label="Filtros da Tabela">
      <div className={styles.filterHeader}>
        <div className={styles.titleWrapper}>
          <Filter size={16} className={styles.filterIcon} />
          <span className={styles.title}>Filtros de Registros</span>
        </div>

        {isFiltering && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={onClearFilters}
            disabled={disabled}
            title="Restaurar todos os filtros"
          >
            <X size={14} />
            <span>Limpar filtros</span>
          </button>
        )}
      </div>

      <div className={styles.grid}>
        {/* Filtro Data Inicial */}
        <div className={styles.inputGroup}>
          <label htmlFor="filter-start-date" className={styles.label}>
            Data Inicial
          </label>
          <input
            id="filter-start-date"
            type="date"
            className={styles.input}
            value={filters.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            disabled={disabled}
          />
        </div>

        {/* Filtro Data Final */}
        <div className={styles.inputGroup}>
          <label htmlFor="filter-end-date" className={styles.label}>
            Data Final
          </label>
          <input
            id="filter-end-date"
            type="date"
            className={styles.input}
            value={filters.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
            disabled={disabled}
          />
        </div>

        {/* Filtro Cotação Mínima */}
        <div className={styles.inputGroup}>
          <label htmlFor="filter-min-rate" className={styles.label}>
            Cotação Mínima
          </label>
          <input
            id="filter-min-rate"
            type="text"
            inputMode="decimal"
            placeholder="Ex: 5.10"
            className={styles.input}
            value={filters.minRate}
            onChange={(e) => handleChange('minRate', e.target.value)}
            disabled={disabled}
          />
        </div>

        {/* Filtro Cotação Máxima */}
        <div className={styles.inputGroup}>
          <label htmlFor="filter-max-rate" className={styles.label}>
            Cotação Máxima
          </label>
          <input
            id="filter-max-rate"
            type="text"
            inputMode="decimal"
            placeholder="Ex: 5.60"
            className={styles.input}
            value={filters.maxRate}
            onChange={(e) => handleChange('maxRate', e.target.value)}
            disabled={disabled}
          />
        </div>
      </div>

      {/* Erro de validação de intervalos */}
      {!validation.isValid && (
        <div className={styles.validationError} role="alert">
          <AlertTriangle size={15} />
          <span>{validation.errorMessage}</span>
        </div>
      )}
    </div>
  );
}
