# Kryos — Requisitos de Produto do Frontend (Customer Portal + SaaS Admin Console)

**Versão:** 1.0 · **Data:** 09/07/2026 · **Estágio do repo:** structure-only · **Dono:** frontend-construction-agent
**Escopo:** `apps/customer-portal` e `apps/saas-admin-console`
**Fontes cruzadas:** `estudo-webapp-carel-boss.md` (dissecação do supervisório líder) + `kryos-v1-requisitos.md` (requisitos da plataforma, blocos RF-MON/RF-ALM/RF-CTRL/RF-REP/RNF-USAB) + governança do próprio repo (CLAUDE.md, .claude/rules).

> **Aviso de estágio.** Este documento é especificação, não implementação. No estágio structure-only nada aqui deve virar UI funcional ligada a dados reais. Ele define *o que* o frontend será e *como* deve se comportar, para que, quando um plano for aprovado, a construção siga um contrato já pensado, simulado e cruzado.

---

## 1. Como este documento foi produzido (análise, cruzamento, simulação)

O método seguiu o workflow obrigatório do repo (plan → simulate → replan → …). Três passos:

**Análise.** Reli os dois documentos de referência e extraí deles todo requisito com impacto de tela: os blocos RF-MON-01..14 (visualização), RF-ALM-09/10 (alarme na UI), RF-CTRL (comando governado), RF-REP (relatórios), RNF-USAB-01..09 (usabilidade), RNF-MAN-06 (motor único de UI) e RF-INT-04 (enumerações por perfil). Do estudo do boss extraí as lições comportamentais: binding por enumeração com fallback obrigatório, cor de estado por classe semântica, sino de alarme com três estados, slots de layout do detalhe, motor de sinóticos declarativo, kiosk de primeira classe — e os antipadrões a não herdar (três motores de UI, tema por página, dual-render SVG/VML, gráfico no servidor).

**Cruzamento.** Confrontei esses requisitos com a governança do repo. Três amarrações estruturais surgiram: (a) todo caminho de escrita na UI precisa passar pelo policy-engine e mostrar o ciclo recomendação→validação→aprovação (regra `.claude/rules/ai/human-in-the-loop.md` + Agent Execution Principle do CLAUDE.md); (b) toda tela é multi-tenant e respeita escopo por grupo de usuário (regra `multi-tenancy.md`); (c) nada afirma implementação inexistente (Documentation Rules). Isso transforma requisitos genéricos de dashboard em requisitos *governados*.

**Simulação.** Para cada tela, simulei o percurso do usuário e os estados-limite (sem dado, offline, sem permissão, carregando, erro, vazio) antes de descrever a tela. As simulações estão na seção 5, uma por tela, e é delas que saem os requisitos funcionais de frontend (RFF-*) da seção 4.

---

## 2. Princípios de frontend (a tese, destilada do cruzamento)

1. **Um motor de renderização dirigido por dados.** Cartão, detalhe, enumeração e sinótico consomem o mesmo Device Profile (evolução do Device XML de dupla camada). Nunca três pilhas de UI concorrentes (RNF-MAN-06; anti-lição do boss §12).
2. **Insight acionável, não dashboard poluído.** Cada tela tem hierarquia clara e uma "próxima ação" evidente. Curar informação, não empilhar gráficos.
3. **Estado é redundante e semântico.** normal/alarme/offline/desativado sempre por cor + ícone + texto, via token/classe, nunca cor literal (RF-MON-08; lição boss dev_status).
4. **Todo valor tem estado "sem dado".** `—`/`***`/cinza explícito, nunca zero mentiroso nem tela quebrada (lição boss/energy: kWh ausente = `***`).
5. **Escrita é governada e visível.** Views custom são somente-leitura; comando passa pelo policy-engine; a UI mostra recomendação → validação → aprovação e linka o decision ledger (RF-CTRL-03; human-in-the-loop).
6. **Tempo real por assinatura, nunca reload.** Cartões, detalhe e sinóticos atualizam via WebSocket/SSE; fragmentos atualizáveis identificados individualmente (RF-MON-14; lição boss "Refreshable").
7. **Multi-tenant e escopo por grupo em toda tela.** O que o usuário vê é resolvido na sessão pelo seu grupo/tenant; nenhuma tela vaza fora do escopo (RF-TEN-08; regra multi-tenancy).
8. **Densidade calibrada.** 14px, grid 8px, tabelas densas para o operador — mas com respiro e hierarquia. Nem legado apertado, nem web editorial espaçada.
9. **Piso de qualidade silencioso.** Responsivo até mobile, foco de teclado visível, reduced-motion respeitado, kiosk-safe, i18n pt-BR com fallback en.

---

## 3. Arquitetura de frontend e sistema de tokens

### 3.1 Conceito central: o Device Profile como fonte da UI

O boss separa Server XML (estrutura: offsets, function codes) de Device XML (semântica: escala, unidade, enumerações, faixas, labels). O Kryos herda isso como **Device Profile** — um contrato de dados que a UI consome para saber, por variável: rótulo, unidade, decimais, faixa de alarme, e o mapa enumeração→(texto, ícone, cor). O mesmo profile alimenta o cartão, os slots do detalhe, as dinâmicas do sinótico e o render de estado. Um motor, um contrato (ADR-UI-001).

### 3.2 Tokens de design (proposta, derivada dos valores medidos no estudo dos 10 SaaS)

**Tipografia**
- Família base: sans-serif neo-grotesca (classe Inter); mono (classe Roboto/JetBrains Mono) para leituras numéricas de telemetria.
- Base **14px** (densidade de supervisão, não 16px editorial). Escala em px, múltiplos de 2: display 28, h1 24, h2 20, h3 18, h4 16, body 14, small 12, micro 11.
- Line-height: títulos ~1.2, corpo ~1.5, denso ~1.35; sempre par em px (alinhamento).
- Pesos: 400 corpo, 500/600 ênfase e títulos, 300 só ≥18px.
- Letter-spacing: +0.16px em texto ≤14px, 0 em títulos ≥20px, +0.32px em labels/código 12px.

**Espaçamento**: grid **8px**; escala 4, 8, 12, 16, 24, 32, 48, 64; meio-passo 4px para detalhe. Componente não tem margin próprio — gap no container (padrão Stack).

**Grid de layout**: 24 colunas para densidade; breakpoints xl/lg/md/sm/xs com xs ≤599px; um dashboard adapta widgets por breakpoint.

**Cor**: arquitetura semântica em camadas — papéis (primary/secondary/accent/info/success/warning/error), texto em 5 níveis (primary/secondary/disabled/link/maxContrast), fundo em 5 camadas de elevação (canvas/page/painel/card/elevated), borda em 3 forças. Claro e escuro nativos, ambos por token. Estado = verde(normal)/vermelho(crítico)/amarelo(atenção)/cinza(offline) **+ ícone + texto**.

**Ícones/mídia**: SVG, tematizável por token; sinóticos em SVG que refletem estado e animam por assinatura; gráficos client-side interativos (nunca render no servidor); ícone/miniatura do modelo no cartão (comunica tipo de equipamento), não foto.

### 3.3 Taxonomia de componentes (o alfabeto do frontend)

Toda tela é composta destes seis blocos:

1. **Cartão de Valor Atual** — valor grande em mono, label, unidade, estado (cor+ícone+texto), mini-sparkline opcional; variáveis do cartão configuráveis por dispositivo (RF-MON-13).
2. **Gráfico de Série** — histórico multi-variável, zoom, comparação de período, sobreposição de eventos (degelo/alarme/ação); client-side.
3. **Controle** — setpoint/switch/knob; **sempre via policy-engine**; confirmação em duas etapas; faixa segura do profile; registro de autor.
4. **Alarme (inbox)** — lista de linhas com tipo/ativo/hora/prioridade/status; ACK de um clique; abas Ativos/Reconhecidos/Todos; escalonamento Guardian visível.
5. **Estático** — rótulo/nota/HTML custom sem fonte de dado.
6. **Símbolo de Sinótico (SVG)** — compressor, evaporador, válvula, rack; estado e animação por assinatura ao Device Profile.

### 3.4 Stack e restrições de estágio

- Alvo: **PWA responsivo mobile-first**, instalável, kiosk-safe (RNF-USAB-01/09). Apenas navegadores evergreen — sem dual-render/CSS por navegador (RNF-PORT-04).
- Estágio structure-only: **não** escolher framework definitivo aqui nem instalar dependências pesadas; registrar a decisão de stack como ADR quando o plano for aprovado. O que se produz agora é contrato (tokens, APIs de componente, inventário de telas, skeleton de app com README/module.yaml/quality-gates).
- Backup é memória de estudo: o WebApp do boss **não** é copiado; serve só como referência de comportamento.

---

## 4. Requisitos Funcionais de Frontend (RFF)

Prioridade P0 = MVP, P1 = v1.0, P2 = evolução. Rastreabilidade: `[req:*]` = requisito de origem no doc da plataforma; `[boss]` = lição do estudo do WebApp; `[gov]` = amarração de governança do repo.

### 4.1 Casca da aplicação (App Shell)
- **RFF-SHELL-01 (P0)** — Casca com navegação lateral fixa por domínios (Plantas, Alarmes, Energia, Relatórios, Configuração), header com identidade do tenant, indicador global de alarme e menu do usuário. Navegação permanece visível ao trocar de seção. `[boss: 9 domínios de menu]`
- **RFF-SHELL-02 (P0)** — Cabeçalhos anti-cache em toda view dinâmica; dado de processo jamais servido de cache do navegador. `[req:RNF-DES-06] [boss: trio no-cache]`
- **RFF-SHELL-03 (P0)** — Tema claro/escuro por token, alternável, persistente por usuário; nunca tema por página. `[req:RNF-USAB-07]`
- **RFF-SHELL-04 (P0)** — i18n por dicionário de domínios com fallback en; pt-BR default. Unidades e formatos locais. `[req:RNF-USAB-06]`
- **RFF-SHELL-05 (P0)** — Escopo de tenant/grupo aplicado na casca: menus, listas e navegação só expõem o que o grupo do usuário pode ver. `[req:RF-TEN-08] [gov:multi-tenancy]`

### 4.2 Indicador e inbox de alarmes
- **RFF-ALM-01 (P0)** — Indicador global de alarme no header com três estados visuais distintos: sem alarme, alarme ativo, alarme escalonado (Guardian); alerta sonoro local opcional com mute por usuário. `[req:RF-ALM-09] [boss: top/alarm + alarm.wav]`
- **RFF-ALM-02 (P0)** — Inbox de alarmes como lista de linhas: tipo, ativo, valor/limite, hora, prioridade, status; filtros por período/planta/dispositivo/prioridade; abas Ativos / Reconhecidos / Todos. `[req:RF-ALM-03] [boss]`
- **RFF-ALM-03 (P0)** — ACK como ação de um clique com ícone dedicado; habilitado/desabilitado conforme permissão; registra autor e horário. `[req:RF-ALM-10] [boss: actions/ack]`
- **RFF-ALM-04 (P1)** — Alarme escalonado (Guardian) visualmente distinto na lista e no header; mostra a cadeia de escalonamento. `[req:RF-ALM-05]`
- **RFF-ALM-05 (P1)** — Snooze/inibição com prazo e motivo obrigatório, refletidos na UI e auditados. `[req:RF-ALM-06]`

### 4.3 Monitoramento e visualização
- **RFF-MON-01 (P0)** — Overview multi-site: mapa/lista de plantas com estado agregado, agregação por região/grupo, entrada para cada planta. `[req:RF-MON-04]`
- **RFF-MON-02 (P0)** — Dashboard de planta: grade de Cartões de Valor Atual, filtro por nome e status, ordenação; estados normal/alarme/offline/desativado por cor+ícone+texto. `[req:RF-MON-01, RF-MON-08]`
- **RFF-MON-03 (P0)** — Atualização em tempo real por assinatura (WebSocket/SSE) em cartões, detalhe e sinóticos; fragmentos atualizáveis identificados; sem reload. `[req:RF-MON-14] [boss: Refreshable]`
- **RFF-MON-04 (P1)** — Detalhe do dispositivo por slots configuráveis: principal somente-leitura, principal com escrita, régua de sondas, tabela completa; leitura e escrita visualmente distintas. `[req:RF-MON-09] [boss: varpos]`
- **RFF-MON-05 (P1)** — Gráfico de Série histórico multi-variável: zoom, comparação de período, sobreposição de eventos (degelo/alarme/ação). `[req:RF-MON-02]`
- **RFF-MON-06 (P1)** — Navegação sequencial entre dispositivos no detalhe (anterior/próximo/combo), respeitando escopo do usuário. `[req:RF-MON-11] [boss: IdDevicesCombo]`
- **RFF-MON-07 (P1)** — Cartão e mini-gráfico com variáveis selecionáveis por dispositivo pelo usuário. `[req:RF-MON-13] [kryos-v2]`
- **RFF-MON-08 (P1)** — Sinótico da instalação: SVG com dispositivos posicionados, valores ao vivo, dinâmicas declarativas (posição/cor/visibilidade por faixa de engenharia), fallback obrigatório e estados de carregando/erro desenhados. `[req:RF-MON-03, RF-MON-10] [boss: QuickDynamics]`
- **RFF-MON-09 (P2)** — Anotações sobre valores e mapas, por feature flag do plano, com autor e timestamp. `[req:RF-MON-12] [boss: value_note]`
- **RFF-MON-10 (P0)** — Enumerações valor→(texto, ícone, cor) vêm do Device Profile, com ordem semântica própria do equipamento e fragmento default obrigatório; renderizadas por componente genérico. `[req:RF-INT-04] [boss: gramática Assint]`

### 4.4 Comando governado
- **RFF-CTRL-01 (P1)** — Toda escrita (setpoint/comando) só a partir de slot de escrita ou tela de controle; jamais de view custom somente-leitura. `[req:RF-CTRL-03] [boss: seções read-only]`
- **RFF-CTRL-02 (P1)** — Fluxo de comando na UI mostra o ciclo governado: recomendação (agente/regra) → validação de política (faixa segura do profile, permissão, janela) → confirmação em duas etapas → aprovação humana quando exigida. `[gov:human-in-the-loop]`
- **RFF-CTRL-03 (P1)** — Registro visível: valor anterior/novo, autor, horário; link para a entrada correspondente no decision ledger. `[req:RF-AI-03] [gov:decision-ledger]`
- **RFF-CTRL-04 (P1)** — Faixa segura e limites de escrita lidos do Device Profile; UI impede submissão fora da faixa. `[req:RF-CTRL-01]`

### 4.5 Relatórios, energia e preditivo
- **RFF-REP-01 (P0)** — Relatórios sob demanda e agendados (diário/semanal/mensal/faixa) com exportação PDF/CSV; impressão nativa da tela (CSS print). `[req:RF-REP-01] [boss: print.css]`
- **RFF-REP-02 (P1)** — Modo HACCP: variáveis marcadas exibidas como somente-leitura imutável, relatório de excursões, evidência de cadeia de custódia. `[req:RF-REP-02]`
- **RFF-REP-03 (P1)** — Tela de energia: perfil por ativo/planta, hierarquia site→grupo→consumidor, janelas comparativas (dia/semana atual/semana anterior), semana ISO-8601, dado ausente = `***` explícito. `[req:RF-REP-06] [boss: plugin energy]`
- **RFF-REP-04 (P1)** — Tela de saúde/preditivo: health score 0–100 por ativo no topo; drill-down mostra os sinais que motivaram o score; recomendações no padrão "causa provável + ação sugerida". `[req:RF-AI-01, RF-AI-02]`

### 4.6 Onboarding e administração
- **RFF-ONB-01 (P1)** — Wizard de onboarding de planta: site → coletor → dispositivos → variáveis → alarmes → relatórios; inclui scan com progresso, cancelamento e aceite humano individual/lote antes de persistir. `[req:RF-MON-06, RF-EDGE-12] [kryos-v2: scans/accept]`
- **RFF-ADM-01 (P0)** — Console SaaS (app separado): gestão de tenants, planos, módulos, limites de uso, saúde de coletores por cliente, impersonação auditada. `[req:RF-TEN-06]`
- **RFF-ADM-02 (P1)** — Painel de saúde por tenant/coletor: última telemetria, backlog de fila, taxa de erro. `[req:RNF-OBS-02]`
- **RFF-CFG-01 (P0)** — Configurações: usuários e RBAC por grupo; canais de notificação com teste obrigatório de canal; preferências de tema/idioma/som. `[req:RF-TEN-02, RF-NOTIF-04]`

### 4.7 Novos requisitos derivados da pesquisa de metodologia (10 SaaS de refrigeração)
- **RFF-ALM-06 (P1)** — Ação corretiva anexável a um alarme após o ACK: descrição, autor, categoria (ajuste/peça trocada/chamado aberto), timestamp; distinta do ACK (reconhecer ≠ resolver). `[metodologia: CorrectiveAction] [TempGenius]`
- **RFF-MON-11 (P1)** — Tela/painel de certificados de calibração por sensor: laboratório emissor, norma, validade, documento anexo; variável some do estado "certificado" (mas segue visível como "não-certificada") quando o certificado vence. `[metodologia: CalibrationCertificate]`
- **RFF-REP-05 (P1)** — Exibição de MKT (Temperatura Cinética Média) como métrica de primeira classe para clientes farma/regulados, ao lado de máx/mín/média simples. `[metodologia: Sensitech/ColdStream]`
- **RFF-AI-01 (P2)** — Interface de consulta em linguagem natural sobre o estado da operação do tenant ("quais plantas têm alarme crítico agora?"), evolução do RF-AI-06 de explicação de alarme individual para busca conversacional sobre todo o tenant. `[metodologia: nível 6 emergente]`

- **RNFF-01 (P0)** — PWA responsivo mobile-first, instalável, tela cheia, push. `[req:RNF-USAB-01]`
- **RNFF-02 (P0)** — Kiosk de primeira classe: sem seleção de texto, autofit de sinótico, telas dedicadas de carregando e erro em toda visualização, som local opcional. `[req:RNF-USAB-09] [boss: index.htm HMIs]`
- **RNFF-03 (P0)** — Leitura de "últimos valores" perceptível como imediata; servida do hot state, nunca da série histórica no caminho quente. `[req:RNF-DES-02]`
- **RNFF-04 (P0)** — Acessibilidade: contraste adequado, foco de teclado visível, estado nunca só por cor, estados vazios úteis nas telas densas, reduced-motion respeitado. `[req:RNF-USAB-04]`
- **RNFF-05 (P1)** — Suporte a painel touch: teclado virtual quando não houver físico, alvos de toque adequados, ajuda/tutoriais embutidos. `[req:RNF-USAB-08]`
- **RNFF-06 (P1)** — Marca branca leve: logo do cliente em portal e relatórios. `[req:RNF-USAB-05]`
- **RNFF-07 (P0)** — Um único motor de renderização dirigido por Device Profile para cartões, detalhe, enumerações e sinóticos; conteúdo custom entra como pacote versionado/instalável, nunca como código divergente. `[req:RNF-MAN-06]`
- **RNFF-08 (P0)** — Apenas navegadores evergreen; sem dual-render nem CSS por navegador. `[req:RNF-PORT-04]`
- **RNFF-09 (P0)** — Toda tela respeita escopo multi-tenant/grupo; nenhum recurso de outro tenant é alcançável pela UI. `[gov:multi-tenancy]`

---

## 6. Simulações de tela (percurso + estados-limite)

Cada simulação percorre o caminho feliz e os estados que quebram UIs mal pensadas: **sem dado, offline, sem permissão, carregando, erro, vazio**. É a validação de que os requisitos acima cobrem a realidade.

### 6.1 Overview multi-site
**Percurso:** técnico faz login → cai no overview → vê 12 lojas como cards/pins, cada um com contagem de alarmes ativos e estado agregado → filtra "só com alarme" → clica na Loja 07 → entra no dashboard da planta.
**Estados-limite:**
- *Carregando:* skeleton dos cards, não spinner de tela cheia; o header e o menu já respondem.
- *Loja sem coletor reportando:* card em estado offline (cinza + ícone + "sem comunicação há 8 min"), não some da lista.
- *Usuário com escopo de 3 lojas:* vê só 3; as outras 9 nem existem para ele (escopo por grupo).
- *Zero lojas (tenant novo):* estado vazio útil — "Nenhuma planta ainda" + atalho para o wizard de onboarding.
**Confirma:** RFF-MON-01, RFF-SHELL-05, RNFF-04.

### 6.2 Dashboard de planta
**Percurso:** dentro da Loja 07 → grade de cartões (câmara 1, câmara 2, rack, chiller…) → cada cartão mostra temp atual em mono grande, unidade, estado → uma câmara está em alarme (cartão vermelho, ícone, "acima do limite há 12 min") → ordena por status para trazer alarmes ao topo.
**Estados-limite:**
- *Variável sem leitura recente:* valor `—` em cinza, não `0`; timestamp da última leitura visível.
- *Degelo em curso:* estado "atenção" (amarelo), não "alarme" — porque o profile sabe distinguir degelo de excursão real.
- *Conexão do navegador cai:* banner discreto "reconectando…"; últimos valores congelam com marca de horário, não zeram nem desaparecem.
- *Sem permissão de escrita:* cartões e detalhe funcionam, mas controles aparecem desabilitados com tooltip de permissão.
**Confirma:** RFF-MON-02, RFF-MON-03, RFF-MON-10, princípio 4 (sem-dado) e 3 (estado semântico).

### 6.3 Detalhe do dispositivo
**Percurso:** clica no chiller → detalhe com slots: topo somente-leitura (setpoint atual, status), régua de sondas (sucção, descarga, evaporação), tabela completa de variáveis, seção de escrita (alterar setpoint) → navega "próximo" para o rack sem voltar à lista.
**Estados-limite:**
- *secA vazio no profile:* slot presente mas em branco, sem quebrar o layout (tolerância a seção vazia — lição boss `pR300/secA` 0 bytes).
- *Enumeração desconhecida:* valor fora do mapa enum → renderiza o fragmento default do profile, nunca em branco.
- *Escrita fora de faixa:* campo de setpoint recusa submissão fora da faixa segura do profile, com mensagem clara.
- *Escrita sem aprovação:* ao confirmar, a UI mostra "aguardando validação de política" → "aguardando aprovação humana", não aplica direto.
**Confirma:** RFF-MON-04, RFF-MON-06, RFF-CTRL-01..04.

### 6.4 Inbox de alarmes
**Percurso:** sino no header pisca (estado Guardian) → abre inbox → linhas ordenadas por prioridade → reconhece (ACK) a de temperatura alta com um clique → filtra por "Loja 07, últimas 24h" → a de comunicação segue ativa (dispositivo ainda offline).
**Estados-limite:**
- *Muitos alarmes (fadiga):* agrupamento por ativo/tipo; críticos destacados; a UI não vira uma parede plana de linhas.
- *ACK sem permissão:* botão desabilitado com motivo; ninguém reconhece o que não pode.
- *Alarme escalonado:* linha e sino visualmente distintos; cadeia de escalonamento visível ao expandir.
- *Inbox vazio:* estado "sem alarmes ativos" — e o sino em verde, som mudo.
**Confirma:** RFF-ALM-01..05.

### 6.5 Sinótico da instalação
**Percurso:** abre o sinótico da sala de máquinas → SVG com compressores, evaporadores e tubos → valores ao vivo sobre os símbolos → um compressor em alarme pisca em vermelho → em modo kiosk numa TV da loja, autofit preenche a tela sem barra de rolagem.
**Estados-limite:**
- *Pacote de sinótico ainda não instalado:* estado "nenhum mapa configurado" (slot vazio, não erro) — lição boss (placeholder.txt).
- *Valor ausente num símbolo:* fallback obrigatório desenhado (símbolo em cinza), nunca símbolo mudo.
- *Carregando/erro:* telas dedicadas de loading e erro do próprio sinótico, antes de qualquer dado (lição boss: loadingscreen/errorscreen).
**Confirma:** RFF-MON-08, RNFF-02, RNFF-07.

### 6.6 Relatórios / Energia
**Percurso:** gera relatório mensal de temperatura da câmara → exporta PDF → agenda envio semanal por e-mail → abre a tela de energia → compara kWh da semana atual vs anterior por consumidor.
**Estados-limite:**
- *kWh indisponível:* célula mostra `***`, nunca `0` (lição boss/energy).
- *Semana ISO na virada do ano:* numeração de semana correta (ISO-8601), sem desalinhar dezembro/janeiro.
- *HACCP:* variáveis marcadas aparecem imutáveis (somente-leitura), com evidência de quem coletou e quando.
- *Impressão:* CSS print gera saída limpa direto da tela.
**Confirma:** RFF-REP-01..03, princípio 4.

### 6.7 Saúde / Preditivo
**Percurso:** abre saúde da Loja 07 → chiller com score 62/100 (amarelo) → drill-down mostra os sinais (ciclos de degelo longos, corrente de compressor subindo, ΔT alto) → recomendação "causa provável: sujeira no condensador; ação sugerida: limpeza + inspeção".
**Estados-limite:**
- *Dados insuficientes para score:* "coletando dados — score em N dias", não um número falso.
- *Recomendação exige ação de campo:* botão gera um incidente/despacho, não executa nada no equipamento sozinho.
**Confirma:** RFF-REP-04, princípio 5 (human-in-the-loop).

### 6.8 Onboarding (wizard)
**Percurso:** tenant novo → wizard → cadastra a planta → aponta o coletor → dispara scan → acompanha progresso → revisa dispositivos descobertos → aceita em lote → define alarmes básicos → conclui.
**Estados-limite:**
- *Scan em progresso:* barra de progresso com opção de cancelar; nada é persistido antes do aceite.
- *Dispositivo duplicado/ambíguo:* marcado para revisão manual, não aceito automaticamente.
- *Sem conectividade com o coletor:* mensagem clara e caminho de retry, sem travar o wizard.
**Confirma:** RFF-ONB-01.

### 6.9 Console SaaS (admin)
**Percurso:** operador Kryos abre o console → lista de tenants → saúde dos coletores por cliente → suspende um tenant inadimplente → o portal daquele cliente degrada graciosamente (somente leitura), sem apagar dados na retenção.
**Estados-limite:**
- *Impersonação:* toda sessão impersonada é auditada e visivelmente sinalizada.
- *Suspensão:* degradação graciosa (leitura → suspenso), nunca perda de dados dentro da retenção (RF-BILL-03).
**Confirma:** RFF-ADM-01/02.

---

## 7. Inventário de telas (12) e mapa para os apps

| # | Tela | App | Prioridade | RFF principais |
|---|---|---|---|---|
| 1 | Login (2FA) | ambos | P0 | RFF-SHELL-05 |
| 2 | Overview multi-site | customer-portal | P0 | RFF-MON-01 |
| 3 | Dashboard de planta | customer-portal | P0 | RFF-MON-02/03/10 |
| 4 | Detalhe do dispositivo | customer-portal | P1 | RFF-MON-04/06, RFF-CTRL-* |
| 5 | Inbox de alarmes | customer-portal | P0 | RFF-ALM-01..05 |
| 6 | Sinótico | customer-portal | P1 | RFF-MON-08 |
| 7 | Relatórios | customer-portal | P0 | RFF-REP-01/02 |
| 8 | Energia | customer-portal | P1 | RFF-REP-03 |
| 9 | Saúde/Preditivo | customer-portal | P1 | RFF-REP-04 |
| 10 | Onboarding/Setup | customer-portal | P1 | RFF-ONB-01 |
| 11 | Console SaaS | saas-admin-console | P0 | RFF-ADM-01/02 |
| 12 | Configurações | ambos | P0 | RFF-CFG-01 |
| 13 | Ação corretiva (dentro do fluxo de alarme) | customer-portal | P1 | RFF-ALM-06 |
| 14 | Calibração de sensores | customer-portal | P1 | RFF-MON-11 |
| 15 | Consulta em linguagem natural | customer-portal | P2 | RFF-AI-01 |

---

## 8. ADRs de frontend sugeridos (para `docs/adr` quando aprovado)

- **ADR-UI-001 — Motor único dirigido por Device Profile.** Cartões, slots do detalhe, enumerações e dinâmicas de sinótico consomem o mesmo profile; proíbe pilhas de UI divergentes.
- **ADR-UI-002 — Escrita só pelo policy-engine.** Views custom são somente-leitura; todo comando roteia por recomendação→validação→execução→aprovação, com decision ledger linkado.
- **ADR-UI-003 — Escolha de stack de frontend.** A decidir quando o estágio avançar (candidatos e trade-offs a documentar); nada instalado no estágio structure-only.
- **ADR-UI-004 — Sistema de tokens.** Congela tipografia (14px base), grid 8px, 24 colunas, cor semântica em camadas, claro/escuro por token.

## 9. Limites de estágio (o que NÃO fazer agora)

Coerente com o CLAUDE.md (structure-only): não construir UI funcional ligada a dados, não implementar autenticação, não instalar bibliotecas pesadas, não escolher framework definitivo por código, não copiar código/assets do WebApp Carel, não afirmar como implementado o que é apenas especificado. O próximo passo permitido é converter estes RFF/RNFF em contratos de componente e skeleton de app — sempre sob plano aprovado e revisão humana.

*Documento produzido pelo frontend-construction-agent cruzando o estudo do WebApp Carel e os requisitos da plataforma, sob a governança do repositório. 09/07/2026.*
