import { formatDateToISO } from './dateUtils.js';

/**
 * Gera o conteúdo textual em formato CSV (com cabeçalhos) a partir dos registros filtrados.
 * Lança erro caso a lista esteja vazia (conforme RN06: impedir exportação vazia).
 *
 * @param {Array<{ date: string, base: string, quote: string, rate: number }>} records
 * @returns {string} Conteúdo CSV pronto para exportação
 */
export function buildCsvContent(records) {
  if (!Array.isArray(records) || records.length === 0) {
    throw new Error('Não há registros disponíveis para exportar em CSV.');
  }

  const headers = ['Data', 'Moeda Origem', 'Moeda Destino', 'Cotacao'];
  const rows = records.map((item) => [
    item.date,
    item.base,
    item.quote,
    Number(item.rate).toFixed(4),
  ]);

  const allLines = [headers, ...rows].map((columns) =>
    columns
      .map((col) => {
        const value = String(col ?? '');
        // Escapa aspas ou vírgulas caso existam
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      })
      .join(',')
  );

  return allLines.join('\n');
}

/**
 * Monta um nome de arquivo identificável e padronizado para o CSV exportado.
 * Exemplo: cambio_USD_BRL_30d_2026-10-20.csv
 *
 * @param {{ baseCurrency: string, targetCurrency: string, periodId: string, referenceDate?: Date }} params
 * @returns {string} Nome do arquivo .csv
 */
export function buildCsvFilename({
  baseCurrency = 'USD',
  targetCurrency = 'BRL',
  periodId = '30d',
  referenceDate = new Date(),
} = {}) {
  const safeBase = String(baseCurrency).toUpperCase().replace(/[^A-Z]/g, '');
  const safeTarget = String(targetCurrency).toUpperCase().replace(/[^A-Z]/g, '');
  const safePeriod = String(periodId).toLowerCase().replace(/[^a-z0-9]/g, '');
  const datePart = formatDateToISO(referenceDate);

  return `cambio_${safeBase}_${safeTarget}_${safePeriod}_${datePart}.csv`;
}

/**
 * Gera e dispara o download do arquivo CSV diretamente no navegador.
 * Impede a exportação caso o array de registros esteja vazio.
 *
 * @param {Array<{ date: string, base: string, quote: string, rate: number }>} records
 * @param {{ baseCurrency: string, targetCurrency: string, periodId: string }} metadata
 * @returns {{ filename: string, rowCount: number }}
 */
export function exportRecordsToCsv(records, metadata = {}) {
  const csvContent = buildCsvContent(records);
  const filename = buildCsvFilename(metadata);

  // Adiciona BOM UTF-8 (\uFEFF) para garantir acentuação correta no Excel
  const blob = new Blob([`\uFEFF${csvContent}`], {
    type: 'text/csv;charset=utf-8;',
  });

  const downloadUrl = URL.createObjectURL(blob);
  const linkElement = document.createElement('a');
  linkElement.href = downloadUrl;
  linkElement.setAttribute('download', filename);
  document.body.appendChild(linkElement);
  linkElement.click();
  document.body.removeChild(linkElement);
  URL.revokeObjectURL(downloadUrl);

  return {
    filename,
    rowCount: records.length,
  };
}
