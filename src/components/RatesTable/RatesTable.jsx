import React, { useState, useMemo } from 'react';
import {
  Download,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Table as TableIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  INITIAL_TABLE_FILTERS,
  filterRateRecords,
  sortRateRecords,
} from '../../utils/filterAndSortUtils.js';
import { exportRecordsToCsv } from '../../utils/csvExport.js';
import { formatIsoDateToBR } from '../../utils/dateUtils.js';
import { formatExchangeRate } from '../../utils/currencyUtils.js';
import { TableFilters } from '../TableFilters/TableFilters.jsx';
import { FeedbackState } from '../FeedbackState/FeedbackState.jsx';
import styles from './RatesTable.module.css';

const ROWS_PER_PAGE = 10;

/**
 * Tabela de Dados Históricos com Filtros, Ordenação, Paginação e Exportação CSV.
 *
 * @param {{
 *   records: Array<{ date: string, base: string, quote: string, rate: number }>,
 *   baseCurrency: string,
 *   targetCurrency: string,
 *   selectedPeriod: string,
 *   loading: boolean,
 *   error: string | null,
 *   onRetry: () => void
 * }} props
 */
export function RatesTable({
  records = [],
  baseCurrency,
  targetCurrency,
  selectedPeriod,
  loading,
  error,
  onRetry,
}) {
  const [filters, setFilters] = useState(INITIAL_TABLE_FILTERS);
  const [sortConfig, setSortConfig] = useState({ field: 'date', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [exportSuccess, setExportSuccess] = useState(false);

  // Aplica filtros e ordenação aos registros
  const processedRecords = useMemo(() => {
    const filtered = filterRateRecords(records, filters);
    return sortRateRecords(filtered, sortConfig);
  }, [records, filters, sortConfig]);

  // Controle de paginação
  const totalRecords = processedRecords.length;
  const totalPages = Math.ceil(totalRecords / ROWS_PER_PAGE) || 1;
  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    return processedRecords.slice(startIndex, startIndex + ROWS_PER_PAGE);
  }, [processedRecords, currentPage]);

  const handleClearFilters = () => {
    setFilters(INITIAL_TABLE_FILTERS);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSortToggle = (field) => {
    setSortConfig((prev) => {
      if (prev.field === field) {
        return {
          field,
          direction: prev.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return { field, direction: 'asc' };
    });
    setCurrentPage(1);
  };

  const handleExportCsv = () => {
    if (processedRecords.length === 0) return;

    try {
      exportRecordsToCsv(processedRecords, {
        baseCurrency,
        targetCurrency,
        periodId: selectedPeriod,
      });
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (err) {
      alert(err.message || 'Erro ao exportar arquivo CSV.');
    }
  };

  const renderSortIcon = (field) => {
    if (sortConfig.field !== field) {
      return <ArrowUpDown size={14} className={styles.sortInactive} />;
    }
    return sortConfig.direction === 'asc' ? (
      <ArrowUp size={14} className={styles.sortActive} />
    ) : (
      <ArrowDown size={14} className={styles.sortActive} />
    );
  };

  return (
    <section className={styles.tableCard} aria-label="Tabela de Dados Históricos">
      {/* Cabeçalho da Tabela */}
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <div className={styles.iconBox}>
            <TableIcon size={20} />
          </div>
          <div>
            <h2 className={styles.title}>Tabela de Dados Históricos</h2>
            <p className={styles.subtitle}>
              Consulte, filtre, ordene e exporte o histórico cambial oficial
            </p>
          </div>
        </div>

        {/* Ações: Contador e Botão Exportar CSV */}
        <div className={styles.actions}>
          <div className={styles.counterBadge}>
            <strong>{processedRecords.length}</strong> de {records.length} registros
          </div>

          <button
            type="button"
            className={styles.exportButton}
            onClick={handleExportCsv}
            disabled={loading || processedRecords.length === 0}
            title={
              processedRecords.length === 0
                ? 'Nenhum registro para exportar'
                : 'Exportar registros filtrados em formato CSV'
            }
          >
            <Download size={16} />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Notificação de sucesso de download */}
      {exportSuccess && (
        <div className={styles.toastSuccess} role="status">
          Arquivo CSV baixado com sucesso no navegador!
        </div>
      )}

      {/* Componente de Filtros */}
      <TableFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        disabled={loading || records.length === 0}
      />

      {/* Estados visuais e Conteúdo */}
      {loading ? (
        <FeedbackState
          type="loading"
          title="Carregando dados da tabela..."
          message="Obtendo registros de cotação na API Frankfurter."
        />
      ) : error ? (
        <FeedbackState
          type="error"
          title="Erro ao carregar tabela"
          message={error}
          actionLabel="Tentar novamente"
          onAction={onRetry}
        />
      ) : records.length === 0 ? (
        <FeedbackState
          type="empty"
          title="Nenhum dado encontrado"
          message="Não há cotações disponíveis para o par e período selecionados."
        />
      ) : processedRecords.length === 0 ? (
        <FeedbackState
          type="empty"
          title="Nenhum registro encontrado para os filtros"
          message="Nenhuma cotação atendeu a todos os critérios de filtro informados."
          actionLabel="Limpar filtros"
          onAction={handleClearFilters}
        />
      ) : (
        <>
          <div className={styles.tableResponsive}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col" onClick={() => handleSortToggle('date')} className={styles.sortableTh}>
                    <div className={styles.thContent}>
                      <span>Data</span>
                      {renderSortIcon('date')}
                    </div>
                  </th>
                  <th scope="col">Moeda de Origem</th>
                  <th scope="col">Moeda de Destino</th>
                  <th scope="col" onClick={() => handleSortToggle('rate')} className={styles.sortableTh}>
                    <div className={styles.thContent}>
                      <span>Cotação</span>
                      {renderSortIcon('rate')}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedRecords.map((item, index) => (
                  <tr key={`${item.date}-${index}`}>
                    <td className={styles.dateCell}>{formatIsoDateToBR(item.date)}</td>
                    <td>
                      <span className={styles.currencyBadge}>{item.base}</span>
                    </td>
                    <td>
                      <span className={styles.currencyBadge}>{item.quote}</span>
                    </td>
                    <td className={styles.rateCell}>{formatExchangeRate(item.rate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <span className={styles.pageInfo}>
                Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
              </span>

              <div className={styles.paginationButtons}>
                <button
                  type="button"
                  className={styles.pageButton}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  aria-label="Página anterior"
                >
                  <ChevronLeft size={16} />
                  <span>Anterior</span>
                </button>

                <button
                  type="button"
                  className={styles.pageButton}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  aria-label="Próxima página"
                >
                  <span>Próxima</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
