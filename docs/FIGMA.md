# Prototipação e Guia de Design (Figma) — Currency Exchange App

## 1. Link do Protótipo no Figma
> **Link do projeto no Figma:** `[Inserir link público do Figma aqui antes da entrega final]`

---

## 2. Design Guide (Sistema de Design)

A interface foi projetada com foco em **clareza financeira, legibilidade de dados tabulares e contraste acessível (WCAG AA)**.

### 2.1 Paleta de Cores

| Token CSS | Cor (Hex) | Aplicação na Interface |
| :--- | :--- | :--- |
| `--bg-primary` | `#0B1120` | Fundo principal da página (Dark Slate Finance) |
| `--bg-surface` | `#111827` | Fundo de cartões (Conversor, Gráfico, Tabela) |
| `--bg-elevated` | `#1E293B` | Campos de entrada (`input`, `select`), cabeçalhos de tabela e hover |
| `--border-subtle` | `#334155` | Bordas de cartões, divisórias e inputs |
| `--text-primary` | `#F8FAFC` | Títulos, valores convertidos e dados principais |
| `--text-secondary` | `#94A3B8` | Rótulos (`labels`), datas secundárias e legendas de eixos |
| `--accent-primary` | `#3B82F6` | Cor de destaque principal (botões ativos, linha do gráfico, foco) |
| `--accent-hover` | `#2563EB` | Estado hover de botões primários |
| `--status-success` | `#10B981` | Variação cambial positiva (alta no período) e badges de status |
| `--status-danger` | `#EF4444` | Variação cambial negativa (queda) e estados de erro/validação |
| `--status-warning` | `#F59E0B` | Avisos de filtros ou datas de dias úteis |

### 2.2 Tipografia
- **Fonte Principal (UI e Textos)**: `Inter`, `-apple-system`, `BlinkMacSystemFont`, `sans-serif`
- **Fonte Numérica / Tabular (Cotações e Datas)**: `font-variant-numeric: tabular-nums` para garantir alinhamento vertical perfeito nas colunas de cotação e nos cards de resumo.
- **Hierarquia de Tamanhos**:
  - Título Principal (`h1`): `1.75rem` (`28px`), `font-weight: 700`
  - Títulos de Seção (`h2`): `1.25rem` (`20px`), `font-weight: 600`
  - Valor Convertido em Destaque: `2rem` (`32px`), `font-weight: 700`
  - Corpo e Tabela: `0.9375rem` (`15px`), `font-weight: 400`
  - Labels e Badges: `0.75rem` (`12px`), `font-weight: 600`, ` uppercase`

---

## 3. Wireframe de Baixa Fidelidade (Estrutura de Blocos)

### 3.1 Versão Desktop (≥ 1024px)
```text
+-----------------------------------------------------------------------------------+
| [Logo] Currency Exchange App                           [Fonte: API Frankfurter]   |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  | CONVERSOR DE MOEDAS                                                         |  |
|  | [ Valor: 100.00 ]   [ De: USD - Dólar v ]  ( ⇄ )  [ Para: BRL - Real v ]    |  |
|  |                                                                             |  |
|  | Resultado: 100.00 USD = 568.42 BRL                                          |  |
|  | Taxa utilizada: 1 USD = 5.6842 BRL  |  Data da cotação: 20/10/2026          |  |
|  +-----------------------------------------------------------------------------+  |
|                                                                                   |
|  PERÍODO DE ANÁLISE:  [7D] [15D] [*30D*] [3M] [6M] [1A] [5A] [10A]                |
|                                                                                   |
|  +-------------------+ +-------------------+ +-------------------+ +-----------+  |
|  | Mínima no Período | | Máxima no Período | | Média no Período  | | Variação  |  |
|  | 5.4120 BRL        | | 5.7310 BRL        | | 5.5890 BRL        | | +2.14% ▲  |  |
|  +-------------------+ +-------------------+ +-------------------+ +-----------+  |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  | EVOLUÇÃO HISTÓRICA (USD -> BRL | Últimos 30 dias)                           |  |
|  |   ^                                                                         |  |
|  | 5.7 |          /\        / \                                                |  |
|  | 5.5 |   /\____/  \______/   \____/\                                         |  |
|  |     +------------------------------------------------------------------->   |  |
|  +-----------------------------------------------------------------------------+  |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  | TABELA DE DADOS HISTÓRICOS                   [22 registros] [Exportar CSV]  |  |
|  | Filtros: [Data Início] [Data Fim] [Cotação Mín] [Cotação Máx] [Limpar]      |  |
|  |-----------------------------------------------------------------------------|  |
|  | DATA (↕)       | MOEDA ORIGEM | MOEDA DESTINO | COTAÇÃO (↕)                 |  |
|  | 20/10/2026     | USD          | BRL           | 5.6842                      |  |
|  | 19/10/2026     | USD          | BRL           | 5.6610                      |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
```

### 3.2 Proposta de Adaptação Mobile (< 768px)
```text
+--------------------------------------+
| Currency Exchange App                |
| [API Frankfurter]                    |
+--------------------------------------+
| CONVERSOR DE MOEDAS                  |
| [ Valor: 100.00                    ] |
| [ De: USD - Dólar Americano      v ] |
|            ( ⇅ Inverter )            |
| [ Para: BRL - Real Brasileiro    v ] |
|--------------------------------------|
| 100 USD = 568,42 BRL                 |
| Taxa: 5.6842 | Cotação: 20/10/2026   |
+--------------------------------------+
| PERÍODO (Grid 4x2):                  |
| [ 7D ] [ 15D ] [ *30D* ] [ 3M ]      |
| [ 6M ] [ 1A  ] [  5A   ] [ 10A ]     |
+--------------------------------------+
| RESUMO (Grid 2x2):                   |
| [ Mín: 5.4120 ]  [ Máx: 5.7310 ]     |
| [ Méd: 5.5890 ]  [ Var: +2.14% ]     |
+--------------------------------------+
| GRÁFICO HISTÓRICO (Altura adaptada)  |
| [ ~~~ Gráfico Responsivo ~~~       ] |
+--------------------------------------+
| TABELA E FILTROS (Empilhados)        |
| [ Data Inicial   ] [ Data Final    ] |
| [ Cotação Mínima ] [ Cotação Máx   ] |
| [ Limpar Filtros ] [ Exportar CSV  ] |
| (Scroll horizontal suave na tabela)  |
+--------------------------------------+
```

---

## 4. Estados Visuais Obrigatórios (Loading, Erro e Ausência de Dados)

1. **Estado de Carregamento (`Loading`)**:
   - Exibido enquanto `fetch` aguarda resposta da API Frankfurter.
   - Apresenta ícone animado de carregamento (`Loader2`) e texto descritivo (*"Buscando cotações atualizadas na API Frankfurter..."*), evitando mudanças bruscas de layout (*layout shift*).
2. **Estado de Erro (`Error`)**:
   - Exibido quando ocorre falha de rede ou erro HTTP (`4xx`/`5xx`).
   - Apresenta card com borda vermelha sutil, ícone de alerta, explicação amigável do motivo da falha e botão **"Tentar novamente"** que dispara o `refetch`.
3. **Estado de Ausência de Dados (`Empty State`)**:
   - Exibido quando a combinação de filtros da tabela (datas ou cotação mínima/máxima) não encontra nenhum registro correspondente.
   - Apresenta ícone informativo, mensagem explicando que nenhum registro atende aos filtros aplicados e botão de ação rápida **"Limpar filtros"** (além de manter o botão de exportação CSV desabilitado).
