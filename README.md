# Currency Exchange App 💱

Aplicação Single Page Application (SPA) em **React + JavaScript** para conversão de moedas e análise de séries temporais cambiais consumindo os dados oficiais do Banco Central Europeu por meio da **API Frankfurter v2**.

---

## 📌 Sumário
- [1. Visão Geral e Contexto](#1-visão-geral-e-contexto)
- [2. Principais Funcionalidades](#2-principais-funcionalidades)
- [3. Arquitetura e Estrutura de Pastas](#3-arquitetura-e-estrutura-de-pastas)
- [4. Tecnologias e Bibliotecas](#4-tecnologias-e-bibliotecas)
- [5. Instalação e Execução Local](#5-instalação-e-execução-local)
- [6. Testes Realizados e Validações](#6-testes-realizados-e-validações)
- [7. Documentação Técnica Completa](#7-documentação-técnica-completa)
- [8. Collection do Postman](#8-collection-do-postman)

---

## 1. Visão Geral e Contexto
O **Currency Exchange App** centraliza em um único painel financeiro moderno e intuitivo a consulta de taxas de câmbio atualizadas, a conversão monetária em tempo real e a exploração de dados históricos (com visualização em gráfico interativo, tabela paginada com filtros combinados e exportação de relatórios em CSV).

A aplicação foi desenvolvida seguindo os conceitos fundamentais de React trabalhados em aula:
- **Componentes funcionais com JSX**
- **Lifting State Up** para compartilhamento harmônico de dados entre conversor, gráfico e tabela
- **Custom Hooks** para desacoplar requisições assíncronas (`fetch` + `async/await`) e gerenciamento de ciclo de vida (`AbortController`)
- **CSS Modules** para isolamento total de estilos e design responsivo
- **Funções puras em JavaScript** para cálculos, ordenações e manipulações de dados

---

## 2. Principais Funcionalidades

### 💵 Conversor de Moedas Dinâmico
- Seleção de moeda de origem e destino a partir da lista oficial da API Frankfurter.
- Entrada numérica amigável (aceita vírgula ou ponto decimal).
- Cálculo instantâneo no front-end (`valor * taxa`), exibindo o valor convertido, a taxa de referência unitária (`1 USD = X BRL`) e a data efetiva da cotação.
- Inversão rápida do par cambial (`⇄`) com recalculo automático.
- Validação visual contra entradas vazias, zero, valores negativos ou pares com moedas idênticas.

### 📈 Histórico e Gráfico Interativo (Recharts)
- 8 períodos de análise obrigatórios: **7 dias**, **15 dias**, **30 dias**, **3 meses**, **6 meses**, **1 ano**, **5 anos** e **10 anos**.
- Cards de resumo estatístico do período selecionado: **Mínima** (com data), **Máxima** (com data), **Média aritmética** e **Variação percentual (%)** com badges de alta/baixa.
- Gráfico de área responsivo com escala dinâmica e tooltip detalhado com data formatada no padrão brasileiro (`DD/MM/AAAA`).

### 📊 Tabela Histórica com Filtros e Ordenação
- Exibição tabular contendo: **Data**, **Moeda de Origem**, **Moeda de Destino** e **Cotação**.
- Filtros simultâneos e combináveis por **Intervalo de Datas** (Data Inicial / Final) e por **Faixa de Cotação** (Mínima / Máxima).
- Validação automática de filtros (impede data inicial maior que data final ou cotação mínima maior que máxima).
- Botão de limpeza rápida de filtros.
- Ordenação alternável (crescente/decrescente) clicando nos cabeçalhos de **Data** e de **Cotação**.
- Contador dinâmico da quantidade de registros encontrados vs. total.
- Paginação suave (10 itens por página).

### 📁 Exportação de Dados em CSV
- Exporta **exatamente os registros resultantes dos filtros e da ordenação ativa**.
- Bloqueia download quando não houver registros correspondentes.
- Inclui cabeçalhos (`Data,Moeda Origem,Moeda Destino,Cotacao`) e caractere BOM UTF-8 (`\uFEFF`) para abertura perfeita no Microsoft Excel.
- Nome de arquivo descritivo padronizado (ex.: `cambio_USD_BRL_30d_2026-10-25.csv`).

### ⚡ Estados de Feedback e Resiliência
- **Loading:** Indicador visual de carregamento animado com `Loader2`.
- **Error:** Alerta explicativo com botão de ação rápida *"Tentar novamente"*.
- **Empty State:** Ilustração informativa com botão de ação *"Limpar filtros"*.

---

## 3. Arquitetura e Estrutura de Pastas

```text
exchange-app/
├── docs/
│   ├── REQUIREMENTS.md         # Requisitos funcionais, regras de negócio e critérios de aceite
│   ├── COMPONENTS.md           # Mapeamento detalhado de componentes, props e estados
│   ├── FIGMA.md                # Design Guide, wireframes desktop/mobile e prototipação
│   ├── API_TESTS.md            # Relatório técnico de investigação da API Frankfurter v2
│   ├── FUNCTION_TESTS.md       # Bateria de testes das funções puras JavaScript
│   ├── AI_USAGE.md             # Registro de transparência do uso de Inteligência Artificial
│   └── postman_collection.json # Collection oficial do Postman v2.1 para importação
├── src/
│   ├── assets/                 # Ícones e imagens estáticas
│   ├── components/             # Componentes funcionais organizados com CSS Modules
│   │   ├── CurrencyConverter/  # Formulário de conversão, inversão e validação
│   │   ├── FeedbackState/      # Componente reutilizável de Loading, Erro e Vazio
│   │   ├── Header/             # Cabeçalho da aplicação e identidade visual
│   │   ├── HistoryChart/       # Gráfico responsivo com Recharts
│   │   ├── PeriodSelector/     # Barra de seleção dos 8 períodos
│   │   ├── RatesTable/         # Tabela de cotações, paginação e exportação CSV
│   │   ├── StatsSummary/       # Cards de indicadores estatísticos (min/max/méd/var)
│   │   └── TableFilters/       # Painel de filtros de datas e valores
│   ├── constants/              # Definições de períodos, moedas padrão e nomes em PT
│   ├── hooks/                  # Custom Hooks (useCurrencies, useExchangeRate, useHistoricalRates)
│   ├── services/               # Camada de comunicação com a API Frankfurter v2 (fetch)
│   ├── utils/                  # Funções puras (cálculo de datas, conversão, filtros, CSV)
│   ├── App.jsx                 # Orquestrador do estado compartilhado (Lifting State Up)
│   ├── App.module.css          # Estilos do layout principal
│   ├── index.css               # Tema global com variáveis CSS (Dark Finance)
│   └── main.jsx                # Ponto de entrada do React
├── package.json
├── vite.config.js
└── README.md
```

---

## 4. Tecnologias e Bibliotecas

| Recurso | Versão | Finalidade no Projeto |
| :--- | :---: | :--- |
| **React** | `^19.3.1` | Biblioteca base para construção da Single Page Application |
| **Vite** | `^8.3.4` | Build tool rápida para desenvolvimento e bundling de produção |
| **CSS Modules** | Nativo | Estilização isolada por componente (`*.module.css`) |
| **Recharts** | `^3.x` | Renderização do gráfico histórico responsivo |
| **Lucide React** | `^1.x` | Conjunto leve e consistente de ícones da interface |
| **Frankfurter API** | `v2` | API REST pública oficial com dados cambiais do BCE |

---

## 5. Instalação e Execução Local

### Pré-requisitos
- **Node.js** (versão 18 ou superior recomendada)
- Gerenciador de pacotes **npm**

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/SEU-USUARIO/exchange-app.git
   cd exchange-app
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento local:**
   ```bash
   npm run dev
   ```
   Acesse a aplicação no navegador em `http://localhost:5173`.

4. **Gerar build otimizado de produção:**
   ```bash
   npm run build
   npm run preview
   ```

---

## 6. Testes Realizados e Validações

Todos os itens do **Escopo Mínimo** e dos **Critérios de Avaliação** foram rigorosamente validados:

- [x] **Conversão entre duas moedas:** Cálculo correto em tempo real no front-end.
- [x] **Inversão das moedas:** Troca simultânea de origem/destino e atualização automática de todas as seções.
- [x] **Atualização ao alterar o par:** Disparo coordenado dos Custom Hooks.
- [x] **Todos os 8 períodos históricos:** Validação de 7d, 15d, 30d, 3m, 6m, 1a, 5a e 10a.
- [x] **Gráfico com dados reais:** Curva de evolução contínua com tooltips customizados.
- [x] **Tabela com dados reais:** Linhas dinâmicas com colunas obrigatórias e paginação.
- [x] **Filtros individuais e combinados:** Filtragem por intervalo de datas e por cotação mínima/máxima.
- [x] **Ordenação:** Suporte a ordenação ascendente e descendente por Data e Cotação.
- [x] **Exportação CSV:** Download de arquivo contendo cabeçalhos, formatação UTF-8 e apenas os dados filtrados.
- [x] **Bloqueio de exportação vazia:** Botão desabilitado quando a tabela filtrada possui 0 registros.
- [x] **Entradas inválidas:** Tratamento de valores negativos, caracteres não numéricos e mesma moeda.
- [x] **Estados de loading e erro:** Feedbacks visuais integrados em todas as camadas assíncronas.
- [x] **Responsividade:** Layout testado e otimizado para dispositivos Desktop, Tablets e Smartphones.

---

## 7. Documentação Técnica Completa

Os documentos detalhados exigidos pela especificação estão disponíveis na pasta `docs/`:
- 📄 [REQUIREMENTS.md](docs/REQUIREMENTS.md) — Requisitos funcionais, não funcionais, regras de negócio e critérios de aceite.
- 📐 [COMPONENTS.md](docs/COMPONENTS.md) — Mapeamento de componentes, props, estados e diagrama de hierarquia.
- 🎨 [FIGMA.md](docs/FIGMA.md) — Design Guide, especificações de cores, tipografia e wireframes.
- 🧪 [API_TESTS.md](docs/API_TESTS.md) — Investigação detalhada dos endpoints da API Frankfurter v2.
- 🔬 [FUNCTION_TESTS.md](docs/FUNCTION_TESTS.md) — Bateria de 27 casos de teste das funções JavaScript utilitárias.
- 🤖 [AI_USAGE.md](docs/AI_USAGE.md) — Registro de transparência do uso de Inteligência Artificial no projeto.

---

## 8. Collection do Postman

A collection pronta para testes dos endpoints pode ser importada no Postman a partir do arquivo:
👉 [`docs/postman_collection.json`](docs/postman_collection.json)

---

## 📝 Licença e Autoria
Desenvolvido como projeto acadêmico individual de Front-End em React. Sinta-se à vontade para explorar, aprender e contribuir!
