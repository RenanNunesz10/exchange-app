# Validação e Testes das Funções JavaScript (`src/utils/`)

Este documento registra a bateria de testes unitários e funcionais aplicada às funções puras JavaScript do projeto **Currency Exchange App**, garantindo a exatidão da lógica de negócio antes e durante sua integração aos componentes React.

---

## 1. Módulo de Datas (`src/utils/dateUtils.js`)

Responsável por calcular os intervalos `{ from, to }` dos 8 períodos históricos obrigatórios (`7d`, `15d`, `30d`, `3m`, `6m`, `1y`, `5y`, `10y`) e formatar datas sem desvios de fuso horário.

| ID | Função Testada | Entrada de Teste | Saída Esperada | Resultado Obtido | Status |
| :-: | :--- | :--- | :--- | :--- | :---: |
| **FT-01** | `formatDateToISO(date)` | `new Date(2026, 9, 20)` | `'2026-10-20'` | `'2026-10-20'` | ✅ Aprovado |
| **FT-02** | `getPeriodDateRange('7d', ref)` | `periodId = '7d'`, `ref = 2026-10-20` | `{ from: '2026-10-13', to: '2026-10-20' }` | `{ from: '2026-10-13', to: '2026-10-20' }` | ✅ Aprovado |
| **FT-03** | `getPeriodDateRange('15d', ref)` | `periodId = '15d'`, `ref = 2026-10-20` | `{ from: '2026-10-05', to: '2026-10-20' }` | `{ from: '2026-10-05', to: '2026-10-20' }` | ✅ Aprovado |
| **FT-04** | `getPeriodDateRange('30d', ref)` | `periodId = '30d'`, `ref = 2026-10-20` | `{ from: '2026-09-20', to: '2026-10-20' }` | `{ from: '2026-09-20', to: '2026-10-20' }` | ✅ Aprovado |
| **FT-05** | `getPeriodDateRange('3m', ref)` | `periodId = '3m'`, `ref = 2026-10-20` | `{ from: '2026-07-20', to: '2026-10-20' }` | `{ from: '2026-07-20', to: '2026-10-20' }` | ✅ Aprovado |
| **FT-06** | `getPeriodDateRange('6m', ref)` | `periodId = '6m'`, `ref = 2026-10-20` | `{ from: '2026-04-20', to: '2026-10-20' }` | `{ from: '2026-04-20', to: '2026-10-20' }` | ✅ Aprovado |
| **FT-07** | `getPeriodDateRange('1y', ref)` | `periodId = '1y'`, `ref = 2026-10-20` | `{ from: '2025-10-20', to: '2026-10-20' }` | `{ from: '2025-10-20', to: '2026-10-20' }` | ✅ Aprovado |
| **FT-08** | `getPeriodDateRange('5y', ref)` | `periodId = '5y'`, `ref = 2026-10-20` | `{ from: '2021-10-20', to: '2026-10-20' }` | `{ from: '2021-10-20', to: '2026-10-20' }` | ✅ Aprovado |
| **FT-09** | `getPeriodDateRange('10y', ref)` | `periodId = '10y'`, `ref = 2026-10-20` | `{ from: '2016-10-20', to: '2026-10-20' }` | `{ from: '2016-10-20', to: '2026-10-20' }` | ✅ Aprovado |
| **FT-10** | `formatIsoDateToBR(isoDate)` | `'2026-10-20'` | `'20/10/2026'` | `'20/10/2026'` | ✅ Aprovado |

---

## 2. Módulo de Conversão, Validação e Estatísticas (`src/utils/currencyUtils.js`)

Responsável por validar entradas do usuário, calcular o montante convertido no front-end (`valor * taxa`) e extrair indicadores do período (mínima, máxima, média e variação percentual).

| ID | Função Testada | Entrada de Teste | Saída Esperada | Resultado Obtido | Status |
| :-: | :--- | :--- | :--- | :--- | :---: |
| **FT-11** | `validateConversionInput` | `('100', 'USD', 'BRL')` | `{ isValid: true, numericAmount: 100, errorMessage: null }` | `{ isValid: true, numericAmount: 100, errorMessage: null }` | ✅ Aprovado |
| **FT-12** | `validateConversionInput` (vírgula) | `('250,50', 'EUR', 'BRL')` | `{ isValid: true, numericAmount: 250.5, errorMessage: null }` | `{ isValid: true, numericAmount: 250.5, errorMessage: null }` | ✅ Aprovado |
| **FT-13** | `validateConversionInput` (vazio) | `('', 'USD', 'BRL')` | `{ isValid: false, errorMessage: 'Informe um valor numérico...' }` | `{ isValid: false, errorMessage: 'Informe um valor numérico...' }` | ✅ Aprovado |
| **FT-14** | `validateConversionInput` (negativo/zero) | `('-10', 'USD', 'BRL')` | `{ isValid: false, errorMessage: 'O valor para conversão deve ser maior que zero.' }` | `{ isValid: false, errorMessage: 'O valor para conversão deve ser maior que zero.' }` | ✅ Aprovado |
| **FT-15** | `validateConversionInput` (texto) | `('abc', 'USD', 'BRL')` | `{ isValid: false, errorMessage: 'Digite apenas números válidos...' }` | `{ isValid: false, errorMessage: 'Digite apenas números válidos...' }` | ✅ Aprovado |
| **FT-16** | `calculateConvertedAmount` | `('100', 5.0431)` | `504.31` | `504.31` | ✅ Aprovado |
| **FT-17** | `calculatePeriodStats` | `[{ date: '2026-10-18', rate: 5.00 }, { date: '2026-10-19', rate: 5.50 }]` | `minRate: 5.00, maxRate: 5.50, averageRate: 5.25, percentageChange: 10` | `minRate: 5, maxRate: 5.5, averageRate: 5.25, percentageChange: 10` | ✅ Aprovado |

---

## 3. Módulo de Filtros e Ordenação da Tabela (`src/utils/filterAndSortUtils.js`)

Responsável por validar intervalos de filtros, aplicar filtros isolados ou combinados (datas + cotação mínima/máxima) e ordenar os registros por data ou cotação sem mutar o array original.

### Massa de Dados de Teste
```js
const sampleRecords = [
  { date: '2026-10-18', base: 'USD', quote: 'BRL', rate: 5.10 },
  { date: '2026-10-19', base: 'USD', quote: 'BRL', rate: 5.25 },
  { date: '2026-10-20', base: 'USD', quote: 'BRL', rate: 5.05 },
];
```

| ID | Função Testada | Entrada de Teste | Saída Esperada | Resultado Obtido | Status |
| :-: | :--- | :--- | :--- | :--- | :---: |
| **FT-18** | `validateTableFilters` (datas invertidas) | `{ startDate: '2026-10-20', endDate: '2026-10-18' }` | `{ isValid: false, errorMessage: 'A data inicial não pode ser posterior à data final.' }` | `{ isValid: false, errorMessage: 'A data inicial não pode ser posterior à data final.' }` | ✅ Aprovado |
| **FT-19** | `validateTableFilters` (faixa invertida) | `{ minRate: '5.50', maxRate: '5.10' }` | `{ isValid: false, errorMessage: 'A cotação mínima não pode ser maior que a cotação máxima.' }` | `{ isValid: false, errorMessage: 'A cotação mínima não pode ser maior que a cotação máxima.' }` | ✅ Aprovado |
| **FT-20** | `filterRateRecords` (filtro por data) | `startDate: '2026-10-19', endDate: '2026-10-20'` | `2 registros` (`19/10` e `20/10`) | `2 registros` | ✅ Aprovado |
| **FT-21** | `filterRateRecords` (filtro por cotação) | `minRate: '5.08', maxRate: '5.20'` | `1 registro` (`18/10` com `5.10`) | `1 registro` | ✅ Aprovado |
| **FT-22** | `filterRateRecords` (filtros combinados) | `startDate: '2026-10-19', endDate: '2026-10-20', minRate: '5.10', maxRate: '5.30'` | `1 registro` (`19/10` com `5.25`) | `1 registro` | ✅ Aprovado |
| **FT-23** | `sortRateRecords` (cotação crescente) | `{ field: 'rate', direction: 'asc' }` | Ordem: `[5.05, 5.10, 5.25]` | Ordem: `[5.05, 5.10, 5.25]` | ✅ Aprovado |
| **FT-24** | `sortRateRecords` (data decrescente) | `{ field: 'date', direction: 'desc' }` | Ordem: `['2026-10-20', '2026-10-19', '2026-10-18']` | Ordem: `['2026-10-20', '2026-10-19', '2026-10-18']` | ✅ Aprovado |

---

## 4. Módulo de Exportação CSV (`src/utils/csvExport.js`)

Responsável por transformar o array filtrado em conteúdo `.csv` com cabeçalhos, gerar um nome de arquivo identificável e impedir a exportação vazia.

| ID | Função Testada | Entrada de Teste | Saída Esperada | Resultado Obtido | Status |
| :-: | :--- | :--- | :--- | :--- | :---: |
| **FT-25** | `buildCsvContent(records)` | `[{ date: '2026-10-19', base: 'USD', quote: 'BRL', rate: 5.25 }]` | `"Data,Moeda Origem,Moeda Destino,Cotacao\n2026-10-19,USD,BRL,5.2500"` | `"Data,Moeda Origem,Moeda Destino,Cotacao\n2026-10-19,USD,BRL,5.2500"` | ✅ Aprovado |
| **FT-26** | `buildCsvContent([])` (bloqueio vazio) | `[]` (array vazio) | Lança erro `"Não há registros disponíveis para exportar em CSV."` | Exceção lançada conforme esperado | ✅ Aprovado |
| **FT-27** | `buildCsvFilename(params)` | `{ baseCurrency: 'USD', targetCurrency: 'BRL', periodId: '30d', referenceDate: new Date(2026, 9, 20) }` | `'cambio_USD_BRL_30d_2026-10-20.csv'` | `'cambio_USD_BRL_30d_2026-10-20.csv'` | ✅ Aprovado |
