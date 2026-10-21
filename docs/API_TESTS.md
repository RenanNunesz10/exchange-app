# Investigação e Testes da API Frankfurter (Postman)

## 1. Visão Geral da API
- **Nome:** Frankfurter API (v2)
- **URL Base:** `https://api.frankfurter.dev/v2`
- **Documentação Oficial:** [https://frankfurter.dev/](https://frankfurter.dev/)
- **Autenticação:** Pública (não requer API Key)
- **Formato de Resposta:** `application/json; charset=utf-8`
- **Collection Exportada:** [`docs/postman_collection.json`](./postman_collection.json)

---

## 2. Endpoints Investigados

### 2.1 Listar Moedas Disponíveis (`GET /v2/currencies`)
Retorna a lista completa de moedas suportadas pela API, incluindo metadados como código ISO 4217, nome por extenso, símbolo monetário e o intervalo de datas disponível na base histórica (`start_date` e `end_date`).

- **Método e URL:**
  ```http
  GET https://api.frankfurter.dev/v2/currencies
  ```
- **Status Esperado:** `200 OK`
- **Estrutura do JSON Retornado:** Array de objetos.
  ```json
  [
    {
      "iso_code": "BRL",
      "iso_numeric": "986",
      "name": "Brazilian Real",
      "symbol": "R$",
      "start_date": "1994-07-05",
      "end_date": "2026-10-21"
    },
    {
      "iso_code": "EUR",
      "iso_numeric": "978",
      "name": "Euro",
      "symbol": "€",
      "start_date": "1999-01-04",
      "end_date": "2026-10-21"
    },
    {
      "iso_code": "USD",
      "iso_numeric": "840",
      "name": "US Dollar",
      "symbol": "$",
      "start_date": "1971-01-04",
      "end_date": "2026-10-21"
    }
  ]
  ```
- **Impacto na Aplicação:**
  - Utilizado no carregamento inicial do app (`useCurrencies`) para popular os `<select>` de moeda de origem e moeda de destino.
  - Como o endpoint retorna apenas a taxa unitária no endpoint de cotação, o valor informado pelo usuário é multiplicado pela propriedade `rate` diretamente no front-end.

---

### 2.2 Consultar Cotação Mais Recente de um Par (`GET /v2/rate/{base}/{quote}`)
Retorna a cotação unitária mais recente entre a moeda de origem (`base`) e a moeda de destino (`quote`), além da data efetiva da cotação (`date`).

- **Método e URL:**
  ```http
  GET https://api.frankfurter.dev/v2/rate/EUR/USD
  ```
- **Parâmetros de Rota (Path Params):**
  - `base`: código ISO de 3 letras da moeda de origem (ex.: `EUR`, `USD`).
  - `quote`: código ISO de 3 letras da moeda de destino (ex.: `USD`, `BRL`).
- **Status Esperado:** `200 OK`
- **Estrutura do JSON Retornado:** Objeto único.
  ```json
  {
    "date": "2026-10-21",
    "base": "EUR",
    "quote": "USD",
    "rate": 1.1226
  }
  ```
- **Observação Importante (Fórmula de Conversão):**
  - A API v2 não recebe um parâmetro `amount` neste endpoint: ela sempre retorna quanto vale **1 unidade** de `base` na moeda `quote`.
  - A aplicação calcula: `valorConvertido = valorInformado * response.rate`.

---

### 2.3 Consultar Histórico por Intervalo de Datas (`GET /v2/rates`)
Retorna a série temporal de taxas de câmbio de um par de moedas entre duas datas (`from` e `to`).

- **Método e URL:**
  ```http
  GET https://api.frankfurter.dev/v2/rates?from=2024-05-01&to=2024-05-31&base=EUR&quotes=USD
  ```
- **Parâmetros de Consulta (Query Params):**
  | Parâmetro | Obrigatório | Formato | Descrição |
  | :--- | :---: | :--- | :--- |
  | `from` | Sim | `YYYY-MM-DD` | Data inicial do período de análise. |
  | `to` | Sim | `YYYY-MM-DD` | Data final do período de análise. |
  | `base` | Sim | Código ISO (ex.: `EUR`) | Moeda base da comparação. |
  | `quotes` | Sim | Código ISO (ex.: `USD`) | Moeda de destino a ser cotada. |

- **Status Esperado:** `200 OK`
- **Estrutura do JSON Retornado:** Array ordenado cronologicamente (`date` ascendente).
  ```json
  [
    {
      "date": "2024-05-01",
      "base": "EUR",
      "quote": "USD",
      "rate": 1.0708
    },
    {
      "date": "2024-05-02",
      "base": "EUR",
      "quote": "USD",
      "rate": 1.0708
    },
    {
      "date": "2024-05-03",
      "base": "EUR",
      "quote": "USD",
      "rate": 1.0733
    }
  ]
  ```

---

## 3. Investigação de Casos Especiais e Erros

### 3.1 Moeda Inválida ou Inexistente (`422 Unprocessable Entity`)
- **Requisição testada:**
  ```http
  GET https://api.frankfurter.dev/v2/rate/EUR/INVALID
  ```
- **Status HTTP:** `422 Unprocessable Entity`
- **Corpo da Resposta:**
  ```json
  {
    "status": 422,
    "message": "invalid currency: INVALID"
  }
  ```
- **Tratamento na Aplicação:** O serviço `frankfurterApi.js` verifica `if (!response.ok)`, lê o JSON de erro e lança uma exceção tratada com mensagem clara ao usuário.

### 3.2 Par com Moedas Idênticas (`EUR -> EUR`)
- **Requisição testada:**
  ```http
  GET https://api.frankfurter.dev/v2/rate/EUR/EUR
  ```
- **Status HTTP:** `200 OK`
- **Corpo da Resposta:**
  ```json
  {
    "date": "2026-10-21",
    "base": "EUR",
    "quote": "EUR",
    "rate": 1.0
  }
  ```
- **Tratamento na Aplicação:** Apesar de a API retornar `rate: 1.0`, a regra de negócio `RN02` orienta validar quando `baseCurrency === targetCurrency` ou inverter automaticamente ao selecionar a mesma moeda, evitando consultas redundantes.

### 3.3 Intervalo de Datas Invertido (`from > to`)
- **Requisição testada:**
  ```http
  GET https://api.frankfurter.dev/v2/rates?from=2025-05-10&to=2025-05-01&base=EUR&quotes=USD
  ```
- **Status HTTP:** `200 OK`
- **Corpo da Resposta:** `[]` (array vazio)
- **Tratamento na Aplicação:** A aplicação valida se `startDate > endDate` nos filtros da tabela e também exibe o estado visual de **Ausência de Dados (`Empty State`)** caso a resposta ou o filtro retorne `0` registros.

### 3.4 Comportamento em Datas sem Publicação (Feriados e Fins de Semana)
- **Observação nos testes:** Em feriados (ex.: `2024-05-01` — Dia do Trabalhador na Europa) ou fins de semana, o mercado cambial de referência não publica nova taxa intradiária; a API mantém a última taxa oficial consolidada ou retorna a data de referência vigente no endpoint `/v2/rate/{base}/{quote}`.
- **Tratamento na Aplicação:** Exibir sempre o campo `date` retornado pela API como **"Data efetiva da cotação"**, garantindo transparência ao usuário.

---

## 4. Resumo da Bateria de Testes no Postman

| # | Nome do Caso de Teste | Endpoint | Status Obtido | Resultado |
| :-: | :--- | :--- | :---: | :---: |
| 01 | Listar todas as moedas disponíveis | `GET /v2/currencies` | `200 OK` | Aprovado |
| 02 | Cotação atual EUR para USD | `GET /v2/rate/EUR/USD` | `200 OK` | Aprovado |
| 03 | Cotação atual USD para BRL | `GET /v2/rate/USD/BRL` | `200 OK` | Aprovado |
| 04 | Histórico mensal (Maio/2024 EUR → USD) | `GET /v2/rates?from=2024-05-01&to=2024-05-31&base=EUR&quotes=USD` | `200 OK` | Aprovado |
| 05 | Histórico longo de 10 anos (USD → BRL) | `GET /v2/rates?from=2016-10-20&to=2026-10-20&base=USD&quotes=BRL` | `200 OK` | Aprovado (3653 registros) |
| 06 | Erro ao informar moeda inválida | `GET /v2/rate/EUR/INVALID` | `422 Unprocessable Entity` | Aprovado |
| 07 | Intervalo de datas invertido (`from > to`) | `GET /v2/rates?from=2025-05-10&to=2025-05-01&base=EUR&quotes=USD` | `200 OK` (`[]`) | Aprovado |
