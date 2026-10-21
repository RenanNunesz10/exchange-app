# Levantamento de Requisitos — Currency Exchange App

## 1. Contexto do Projeto
Atualmente, usuários e analistas que precisam consultar taxas de câmbio, converter valores monetários e avaliar o comportamento histórico de pares de moedas realizam esse trabalho de forma fragmentada: acessam diferentes sites, fazem cálculos manuais e copiam dados para planilhas externas.

Para resolver esse problema, uma empresa de tecnologia financeira propôs a criação do **Currency Exchange App**, uma *Single Page Application* (SPA) desenvolvida em React que centraliza a conversão de moedas em tempo real e a análise histórica (via gráfico interativo, tabela filtrável/ordenável e exportação CSV) consumindo dados oficiais da **API Frankfurter**.

---

## 2. Público-Alvo
- **Pessoas físicas e viajantes** que desejam converter valores rapidamente entre duas moedas e verificar a cotação mais recente.
- **Profissionais de finanças, comércio exterior e estudantes** que precisam analisar a tendência histórica de um par cambial em diferentes janelas de tempo e exportar recortes de dados para relatórios ou planilhas.

---

## 3. Objetivo do Produto
Disponibilizar uma interface web intuitiva, responsiva e confiável que permita:
1. Converter valores entre duas moedas com base na cotação oficial mais recente disponível.
2. Visualizar a evolução histórica da taxa de câmbio em períodos pré-definidos (de 7 dias a 10 anos) por meio de um gráfico dinâmico.
3. Explorar os registros históricos em uma tabela com suporte a filtros combinados (intervalo de datas e faixa de cotação), ordenação (por data ou cotação) e exportação dos dados filtrados em formato **CSV**.

---

## 4. Escopo do Produto

### 4.1 Dentro do Escopo (Escopo Mínimo)
- **Conversor de Moedas**:
  - Seleção de moeda de origem (`base`) e moeda de destino (`quote`/`target`) a partir da lista oficial da API.
  - Entrada de valor numérico para conversão e cálculo automático na aplicação.
  - Exibição do valor convertido formatado, da taxa unitária utilizada e da data efetiva da cotação.
  - Botão para inversão rápida do par de moedas (`origem ↔ destino`).
  - Validação de entradas inválidas (valores negativos, vazios, zero ou moedas iguais).
- **Análise Histórica e Gráfico**:
  - Seleção de períodos pré-definidos: **7 dias**, **15 dias**, **30 dias**, **3 meses**, **6 meses**, **1 ano**, **5 anos** e **10 anos**.
  - Atualização automática do gráfico e da tabela sempre que o par de moedas ou o período selecionado mudar.
  - Exibição de indicadores rápidos do período (cotação mínima, máxima, média e variação percentual).
- **Tabela de Dados Históricos**:
  - Colunas mínimas obrigatórias: **Data**, **Moeda de Origem**, **Moeda de Destino** e **Cotação**.
  - Filtro por intervalo de datas (data inicial e data final dentro do período carregado).
  - Filtro por faixa de cotação (cotação mínima e cotação máxima).
  - Suporte à combinação simultânea de todos os filtros e botão para limpeza rápida dos filtros.
  - Ordenação crescente e decrescente por **Data** e por **Cotação**.
  - Contador exibindo a quantidade de registros encontrados após a aplicação dos filtros.
- **Exportação CSV**:
  - Geração e download no navegador de arquivo `.csv` contendo cabeçalhos e **apenas os registros resultantes dos filtros e da ordenação ativa**.
  - Bloqueio da exportação quando não houver registros filtrados disponíveis.
  - Nome de arquivo padronizado e identificável (ex.: `cambio_USD_BRL_30d_2026-10-20.csv`).

### 4.2 Fora do Escopo
- Autenticação, login ou cadastro de usuários.
- Back-end próprio ou banco de dados para persistência remota.
- Processamento de pagamentos, transferências ou compra/venda real de moedas.

---

## 5. Requisitos Funcionais (RF)

| Código | Requisito | Descrição |
| :--- | :--- | :--- |
| **RF01** | Listar moedas disponíveis | O sistema deve buscar na API Frankfurter a lista de moedas suportadas (código ISO e nome) ao inicializar a aplicação. |
| **RF02** | Selecionar par de moedas | O usuário deve poder escolher a moeda de origem e a moeda de destino em campos de seleção (`select`). |
| **RF03** | Informar valor para conversão | O usuário deve poder digitar o montante que deseja converter na moeda de origem. |
| **RF04** | Calcular e exibir conversão | O sistema deve obter a taxa de câmbio vigente na API e calcular na aplicação o valor convertido (`valor * taxa`), exibindo também a taxa unitária e a data efetiva da cotação. |
| **RF05** | Inverter moedas | O usuário deve poder inverter a moeda de origem com a moeda de destino com um clique, recalculando automaticamente a cotação e o histórico. |
| **RF06** | Validar dados do conversor | O sistema deve validar valores vazios, iguais ou menores que zero, caracteres inválidos e seleção da mesma moeda na origem e no destino. |
| **RF07** | Selecionar período histórico | O usuário deve poder alternar entre os períodos de `7 dias`, `15 dias`, `30 dias`, `3 meses`, `6 meses`, `1 ano`, `5 anos` e `10 anos`. |
| **RF08** | Renderizar gráfico histórico | O sistema deve apresentar um gráfico de linha/área com a evolução das cotações do par selecionado ao longo do período ativo. |
| **RF09** | Exibir tabela de cotações | O sistema deve listar os registros históricos contendo Data, Moeda de Origem, Moeda de Destino e Cotação. |
| **RF10** | Filtrar registros da tabela | O usuário deve poder filtrar os registros carregados por intervalo de datas (início/fim) e por faixa de valores (cotação mínima/máxima), de forma isolada ou combinada. |
| **RF11** | Limpar filtros | O usuário deve poder restaurar todos os filtros da tabela ao estado inicial com um único clique. |
| **RF12** | Ordenar registros da tabela | O usuário deve poder ordenar os registros exibidos por **Data** (mais recente/mais antiga) ou por **Cotação** (maior/menor). |
| **RF13** | Exibir total de registros | A interface deve informar quantos registros estão sendo exibidos após a aplicação dos filtros em relação ao total carregado no período. |
| **RF14** | Exportar dados em CSV | O usuário deve poder exportar os dados filtrados e ordenados para um arquivo `.csv` gerado diretamente no navegador. |

---

## 6. Requisitos Não Funcionais (RNF)

| Código | Requisito | Descrição |
| :--- | :--- | :--- |
| **RNF01** | Arquitetura SPA em React | Aplicação construída com React + Vite utilizando componentes funcionais, JSX, Props, `useState`, `useEffect` e Custom Hooks. |
| **RNF02** | Isolamento de Estilos | Estilização modularizada obrigatoriamente com **CSS Modules** (`*.module.css`), evitando conflitos globais de classes. |
| **RNF03** | Responsividade | Layout adaptável para dispositivos Desktop (≥ 1024px), Tablet (768px–1023px) e Mobile (< 768px). |
| **RNF04** | Feedback Visual de Estados | Todas as operações assíncronas e listagens devem apresentar estados claros de *Loading* (carregamento), *Error* (falha na API/rede) e *Empty State* (ausência de dados). |
| **RNF05** | Consumo via Fetch + async/await | Comunicação com a API REST realizada com `fetch` nativo e sintaxe `async/await`, com tratamento adequado de exceções (`try/catch`) e códigos HTTP. |

---

## 7. Regras de Negócio (RN)

- **RN01 — Cálculo da Conversão no Front-end**: A API é consultada para obter a taxa unitária do par (`base` → `quote`). A multiplicação pelo valor digitado pelo usuário (`valorConvertido = valorEntrada * taxa`) é realizada pela própria aplicação para permitir resposta imediata ao digitar novos valores sem disparar requisições desnecessárias à API.
- **RN02 — Par de Moedas Idêntico**: Caso o usuário selecione a mesma moeda na origem e no destino (ou ao trocar uma das moedas ela se iguale à outra), o sistema pode impedir a requisição redundante e exibir taxa `1.0000` com aviso informativo, ou alternar automaticamente as moedas para manter um par válido.
- **RN03 — Validação de Valor Numérico**: O valor a ser convertido deve ser um número finito maior que zero (`valor > 0`). Enquanto o campo estiver vazio, zero ou negativo, o resultado convertido não deve ser exibido e uma mensagem de orientação amigável deve ser mostrada.
- **RN04 — Datas sem Publicação (Fins de Semana e Feriados)**: As taxas da API Frankfurter seguem os dias úteis de referência do Banco Central Europeu. Portanto, consultas em fins de semana ou feriados retornam a data efetiva do último dia útil disponível, a qual deve ser exibida com transparência ao usuário.
- **RN05 — Validação dos Filtros da Tabela**:
  - Se a data inicial informada no filtro for posterior à data final (`dataInicio > dataFim`), ou se a cotação mínima for maior que a cotação máxima (`cotacaoMin > cotacaoMax`), o sistema deve exibir um alerta de validação e indicar `0` registros compatíveis.
- **RN06 — Regras de Exportação CSV**:
  - O arquivo CSV deve refletir **exatamente** o subconjunto filtrado e a ordenação ativa na tabela no momento do clique.
  - Deve incluir linha de cabeçalho (`Data,Moeda Origem,Moeda Destino,Cotacao`).
  - O botão de exportação deve ficar desabilitado (e a função bloqueada) quando a lista filtrada estiver vazia (`0 registros`).
  - O nome do arquivo deve seguir o padrão `exchange_<ORIGEM>_<DESTINO>_<PERIODO>_<DATA>.csv`.

---

## 8. Critérios de Aceite (CA)

1. **CA01 — Conversão Funcional**:
   - *Dado* que o usuário selecionou `USD` como moeda de origem, `BRL` como moeda de destino e digitou `100`,
   - *Quando* a cotação da API for carregada,
   - *Então* o sistema deve exibir o valor convertido correspondente a `100 * taxa`, a taxa unitária (`1 USD = X BRL`) e a data oficial da cotação.
2. **CA02 — Inversão do Par**:
   - *Dado* que o par ativo é `EUR → USD`,
   - *Quando* o usuário clicar no botão de inverter moedas,
   - *Então* a origem deve passar a ser `USD` e o destino `EUR`, atualizando a taxa do conversor, o gráfico histórico e os registros da tabela.
3. **CA03 — Troca de Período Histórico**:
   - *Dado* um par de moedas válido selecionado,
   - *Quando* o usuário clicar em qualquer um dos 8 períodos (`7d`, `15d`, `30d`, `3m`, `6m`, `1a`, `5a`, `10a`),
   - *Então* o sistema deve buscar os dados correspondentes ao intervalo na API e atualizar tanto o gráfico quanto a tabela.
4. **CA04 — Filtros Combinados e Limpeza**:
   - *Dado* que a tabela possui registros carregados,
   - *Quando* o usuário definir um intervalo de datas e uma faixa de cotação mínima/máxima,
   - *Então* apenas os registros que atendam simultaneamente a todos os critérios devem ser listados e contabilizados; ao clicar em "Limpar filtros", todos os registros do período devem voltar a ser exibidos.
5. **CA05 — Ordenação da Tabela**:
   - *Dado* um conjunto de registros na tabela,
   - *Quando* o usuário selecionar ou clicar na ordenação por Data ou por Cotação,
   - *Então* as linhas devem ser reordenadas de acordo com o critério e a direção (crescente/decrescente) escolhida.
6. **CA06 — Exportação CSV Válida e Bloqueio de Vazio**:
   - *Dado* que existem registros filtrados na tabela,
   - *Quando* o usuário clicar em "Exportar CSV",
   - *Então* um arquivo `.csv` com cabeçalhos e apenas as linhas filtradas deve ser baixado com nome identificável. Caso os filtros resultem em `0` registros, o botão de exportação deve estar desabilitado.
7. **CA07 — Tratamento de Erros e Entradas Inválidas**:
   - *Dado* que o usuário inseriu um valor negativo ou vazio no conversor, ou que a API retornou erro de rede,
   - *Então* a aplicação não deve quebrar e deve exibir uma mensagem clara informando o problema e como proceder.
