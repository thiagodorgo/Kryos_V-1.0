# Metodologia Técnica do Kryos, Validada em 10 SaaS de Refrigeração do Mundo

**Versão:** 1.0 · **Data:** 10/07/2026 · **Escopo:** somente SaaS especializados em refrigeração/cadeia do frio (automação industrial genérica excluída por correção de escopo do usuário)
**Objetivo:** definir, para o Kryos, métodos de aquisição, estilos de visualização, objetos/funções/classes, esquema, metodologia de exibição, inteligência cognitiva e planos/cobrança — cada definição validada contra o que os 10 melhores SaaS de refrigeração do mundo realmente fazem.

---

## 1. Método e os 10 players

Correção de escopo: a primeira rodada de pesquisa cobriu automação industrial genérica (Siemens, Rockwell, AVEVA, Ignition) — descartada a pedido. Esta pesquisa é exclusivamente de **SaaS especializados em refrigeração/cadeia do frio**, escolhidos por relevância global e diversidade de segmento (varejo alimentar, farma/cold-chain regulado, transporte refrigerado, fabricante de compressor, sensor-as-a-service):

| # | Player | Empresa | Segmento-âncora |
|---|---|---|---|
| 1 | **Alsense** | Danfoss | Varejo alimentar enterprise (Azure SaaS) |
| 2 | **ProAct + Lumity/E3** | Copeland (Emerson) | Supervisório + gestão enterprise, Smart Alarms |
| 3 | **boss / RemotePRO / tERA** | Carel | Fluxo canônico HVAC/R (estudado à parte) |
| 4 | **AIR** | Eliwell (Schneider Electric) | Refrigeração comercial plug-and-play |
| 5 | **AKONET.Cloud** | AKO Electromecánica | Multi-marca via NB-IoT, forte em LatAm/Europa |
| 6 | **ColdStream** | Sensitech (Carrier) | Cadeia do frio farma/GDP regulado |
| 7 | **Cold Chain Platform** | ORBCOMM | Telemetria de contêiner/reboque refrigerado |
| 8 | **SmartSense** | Digi | Sensing-as-a-Service, health score |
| 9 | **Digital Network (BDN)** | Bitzer | Cloud de fabricante de compressor |
| 10 | **iMonnit** | Monnit | Sensor IoT flexível, SaaS auto-serviço |

*Menções de apoio: Dickson (DicksonOne, compliance regulado), Squair (Brasil, já estudado em detalhe no benchmark anterior), TempGenius/Swift Sensors/myDevices (padrões de precificação de mercado).*

---

## 2. Métodos de aquisição

### 2.1 O que os 10 fazem

**Protocolo de campo:** Modbus RTU/TCP é o denominador comum entre controladores de refrigeração (AKO, Carel, Eliwell); acima dele, cada player resolve o "último metro" de forma diferente:
- **NB-IoT (Narrowband IoT)** — AKO usa como conectividade nativa dos próprios dispositivos porque penetra o efeito Faraday de câmaras frias e porões, onde Wi-Fi/RFID falham; é celular de baixo consumo, autenticação dupla, "praticamente ilimitado" em número de dispositivos por torre.
- **Wi-Fi plug-and-play** — Eliwell AIR WiFi: módulo de borda (AIR Edge) que conecta o equipamento e geolocaliza automaticamente.
- **Celular dual-mode + satélite** — ORBCOMM (PT 6000, CT 3600): "elimina black spots" trocando entre celular e satélite para contêineres em trânsito oceânico; bateria recarregável reporta por até 10 dias sem alimentação do veículo.
- **BLE (Bluetooth Low Energy)** — sensores complementares plugáveis em transporte refrigerado (ORBCOMM, Sensitech).
- **Gateway agregador de Modbus** — AKONET.Edge: um hub único que fala Modbus-RTU com os dispositivos locais e sobe ao AKONET.Cloud via Ethernet do cliente ou cartão de dados 2G/GPRS — o mesmo papel que o edge-collector do Kryos.

**Buffer e resiliência:** armazenamento local durante queda de conectividade é prática universal — myDevices continua logando por até 7 dias durante interrupção; ORBCOMM reporta por até 10 dias sem energia externa via bateria interna. Isso valida (e calibra) o RNF-DISP-01 do Kryos (72h de buffer local).

**Escrita governada (two-way):** ORBCOMM/Carrier/Thermo King permitem alterar setpoint, trocar modo de operação (contínuo/start-stop/degelo), limpar alarme e reiniciar remotamente — sempre como comando de duas vias auditado, nunca escrita direta sem rastro.

**Calibração como parte da aquisição, não só do sensor:** TempGenius e Swift Sensors tratam certificado de calibração NIST/ISO 17025 como parte do ciclo de vida do dispositivo — com validade, renovação anual gerenciada pela própria plataforma, e opção de recalibração remota ("basta trocar o sensor, o certificado já vem documentado").

### 2.2 Definição para o Kryos — Métodos de Aquisição

1. **Modbus RTU/TCP permanece o protocolo primário de campo** (já implementado no motor C++ do backup) — confirmado como consenso de mercado, não escolha isolada.
2. **Adicionar suporte a conectividade celular NB-IoT/LTE-M como opção de transporte do edge-collector**, especificamente para câmaras frias e ambientes de blindagem de sinal (efeito Faraday) onde Wi-Fi/Ethernet do cliente não é viável — lição direta do AKO.
3. **Buffer local do edge deve ser dimensionado por cenário de bateria/energia, não só por tempo:** o padrão de mercado (7–10 dias) é para dispositivos alimentados por bateria; o Kryos, alimentado por rede, mantém a meta de 72h já definida, mas o *dado do sensor* (quando aplicável a sensor sem fio complementar) deve seguir o padrão de dias, não horas.
4. **Todo comando remoto é de duas vias, auditado e reversível** (start/stop, setpoint, degelo forçado, reboot do coletor) — já coberto por RF-CTRL-03, agora validado com exemplos concretos de mercado (troca de modo, degelo forçado, reboot).
5. **Novo objeto de domínio: Certificado de Calibração.** Sensor/sonda tem um certificado com validade, laboratório emissor e rastreabilidade NIST/ISO 17025; a plataforma alerta vencimento e bloqueia leitura como "compliance-grade" após expirar (mantendo a leitura como "não certificada", nunca escondendo o dado).

---

## 3. Estilos de visualização

### 3.1 O que os 10 fazem

- **"Actionable insights, not cluttered dashboards"** (Alsense, citado antes) — tese repetida em quase todo material de marketing do setor; a interface vencedora não é a mais densa, é a mais curada.
- **Visão de pássaro → detalhe** (Bitzer BDN: "observe... from a bird's-eye view and prepare detailed analyses"): todo player estrutura navegação em dois níveis — panorama primeiro, mergulho depois, nunca o inverso.
- **Gráficos dinâmicos e compartilháveis** (ORBCOMM: "dynamic reefer temperature charts that are easy to share") — o gráfico de temperatura é um artefato que sai da plataforma (link, export, anexo de e-mail para o cliente/handoff de carga).
- **Geolocalização como camada de visualização própria** — AKO agrupa por "estabelecimento, região, refrigeração positiva/negativa, áreas dentro do estabelecimento"; ORBCOMM mostra posição de cada reboque no mapa; Bitzer permite gerenciar "componentes, sistemas e sites inteiros" com poucos cliques.
- **Marca branca como recurso de primeira classe, não add-on cosmético** — Carel ("customização gráfica com a marca do cliente"), myDevices (app web e mobile com logo/cores do revendedor rodando em domínio próprio). Isso é estratégico: quem revende a plataforma (integrador, distribuidor) precisa apresentá-la como sua.
- **Perfis de acesso diferenciados por papel** — Carel: "múltiplos operadores com papéis diferentes"; instalador vê o que o gestor de loja não vê e vice-versa.

### 3.2 Definição para o Kryos — Estilos de Visualização

1. **Confirma e reforça o princípio "insight acionável, não dashboard poluído"** já presente no doc de requisitos (RNF já definido) — agora com três citações de mercado independentes convergindo na mesma tese.
2. **Navegação em dois níveis obrigatória em toda tela de listagem:** panorama (bird's-eye) com estado agregado → clique leva ao detalhe. Nunca abrir direto em detalhe denso.
3. **Gráfico de série exportável/compartilhável como artefato de primeira classe** — link direto, PDF, imagem — não apenas visualização inline. Relevante para handoff de carga/evidência para cliente ou auditor.
4. **Marca branca é requisito P1 confirmado** (já existia como RNF-USAB-05) — a validação de mercado eleva sua importância: para o Kryos vender através de integradores/distribuidores (padrão do setor brasileiro: Refrisat, Centrivac, SmartMonit), marca branca é habilitador comercial, não luxo.
5. **Agrupamento geográfico/lógico como filtro de primeira classe** no overview multi-site: por região, por tipo de refrigeração (positiva/negativa), por área dentro do site — não só lista plana de plantas.

---

## 4. Objetos, funções, classes e esquema

### 4.1 O que os 10 fazem

Todos os 10 convergem para a mesma **hierarquia de ativos**, com nomes diferentes mas a mesma forma: Empresa/Tenant → Site/Loja/Planta → Sistema/Circuito → Dispositivo/Componente → Sensor/Variável.
- AKO: "agrupar dispositivos por estabelecimento, região, refrigeração positiva/negativa, áreas dentro do estabelecimento."
- Bitzer: "gerenciar componentes... bem como sistemas e sites inteiros."
- ORBCOMM: ativo (reboque/contêiner) → zona de temperatura (até 3 sensores/zonas por unidade PT 6000).
- Carel: unidade → site → múltiplos operadores com papéis.

**Objetos funcionais recorrentes além da telemetria:**
- **Alarme** (todos) — com severidade, ciclo de vida, ACK.
- **Registro de Ação Corretiva** (TempGenius: "corrective action inputs allow you to enforce and track responses to out-of-range temperatures") — objeto que liga um alarme a uma ação humana documentada, distinto do simples ACK.
- **Atividade de Serviço/Manutenção** (Bitzer: "upload documents... and manage and track related service activities") — histórico de manutenção vinculado ao ativo, não à conta.
- **Certificado de Calibração** (TempGenius, Swift Sensors) — objeto com validade, laboratório, ativo, e vínculo ao sensor específico.
- **Comando/Mudança de Setpoint** (ORBCOMM) — objeto de auditoria: valor anterior, novo, autor, timestamp, resultado.
- **Modelo de Relatório** (Carel, Sensitech) — configuração reutilizável de variáveis + período + layout.
- **Perfil/Papel de Usuário** (todos) — RBAC com escopo por site/grupo.
- **Registro de Compliance/Excursão** (Sensitech, Monnit) — nunca editável, com MKT calculado (ver seção 6) para farma.

### 4.2 Definição para o Kryos — Objetos/Classes/Esquema

A hierarquia e os objetos acima **confirmam e refinam** o Device Profile e o modelo de domínio já descritos no `frontend-product-requirements.md` e nos RF-TEN/RF-MON do doc de requisitos da plataforma. Dois objetos novos, ainda não modelados explicitamente, entram no esquema:

1. **`CorrectiveAction`** — liga-se a um `Alarm` (1:N — um alarme pode ter várias ações ao longo do tempo), campos: descrição, autor, timestamp, categoria (ajuste, peça trocada, chamado técnico aberto), e opcionalmente referência ao `ServiceTicket`. Diferente de ACK: ACK é "estou ciente", ação corretiva é "eu fiz algo a respeito". Isso separa reconhecimento de resolução — lacuna real no doc atual (RF-ALM-10 só cobre ACK).
2. **`CalibrationCertificate`** — vinculado a `Device`/`Sensor`, campos: laboratório emissor, norma (NIST/ISO 17025/INMETRO no Brasil), data de emissão, validade, documento anexo. Alimenta um novo estado de variável: "leitura não-certificada" quando o certificado vence, sem esconder o dado (mantém o princípio de nunca mentir sobre o dado).

A hierarquia de ativos (Tenant→Site→System→Device→Variable) já está implícita no modelo relacional do `kryos-base1` (companies→plants→devices→variables→telemetry) — este estudo confirma que é o desenho correto e universal do setor, não uma escolha arbitrária.

---

## 5. Metodologia de exibição

### 5.1 O que os 10 fazem

- **Exceção primeiro, não tudo de uma vez** — a MaaS (Monitoring-as-a-Service, ver seção 7) só existe porque o valor está em "a analítica, os relatórios e a interpretação especializada que transformam dado bruto em decisão operacional", não em mostrar mais gráficos.
- **Cascata de notificação multicanal com escalonamento** — SMS → e-mail → push → telefone automatizado para alarmes críticos não reconhecidos (padrão universal, já confirmado no estudo anterior).
- **Relatório de conformidade gerado automaticamente, pronto para auditoria** — "audit-ready documentation retrievable within 24 hours" (FSMA 204); Eliwell: "com o Módulo HACCP, o registro de temperatura e alarme é totalmente automático... sempre disponível em PDF ou CSV, pronto para inspeções."
- **Ignorar falso-positivo por padrão de operação conhecido** — degelo, abertura de porta — configurável na origem da regra (Monnit: "configure settings to ignore periodic defrost cycles or rise in cooler temperature when door is open, minimizing false freezer alarms"). Já capturado no estudo do Carel; confirmado aqui como prática universal, não peculiaridade de um fornecedor.

### 5.2 Definição para o Kryos — Metodologia de Exibição

1. Adiciona ao inventário de telas: a tela de **Ação Corretiva** dentro do fluxo de alarme — depois do ACK, o operador pode (não é obrigatório) registrar o que foi feito, criando o `CorrectiveAction`. Isso fecha o loop que hoje só vai até "reconhecido".
2. Relatórios de compliance devem ser **recuperáveis em até 24h por padrão de auditoria** (referência de mercado FSMA 204) — meta de desempenho explícita, não só "existe exportação".
3. Regras de supressão de falso-positivo (degelo, porta aberta) são **parte do Device Profile**, não configuração solta por tela — reforça RNF-MAN-06 (motor único dirigido por perfil).

---

## 6. Inteligência cognitiva

### 6.1 O que os 10 fazem — a escada específica de refrigeração

Retomando a escada de 7 níveis do benchmark anterior, a pesquisa focada em refrigeração acrescenta dois patamares concretos e uma prática de mercado emergente:

- **Nível 3.5 — Métrica derivada regulatória: MKT (Mean Kinetic Temperature).** Sensitech/ColdStream calcula a Temperatura Cinética Média — não é a temperatura simples, é uma média ponderada termodinamicamente que representa o efeito cumulativo de flutuações térmicas sobre um produto farmacêutico. É o padrão que auditores GDP/FDA esperam ver, não apenas "máxima e mínima".
- **Nível 4 confirmado — Health score e sinal precoce por degradação de padrão operacional.** O exemplo mais concreto encontrado: "quando o monitoramento identifica que um freezer específico está com tempo de recuperação de degelo progressivamente maior nas últimas duas semanas, isso é sinal precoce de problema no compressor — detectável e acionável muito antes de virar emergência" (MaaS, varejo). Não é o valor de temperatura que aciona, é a **tendência de um comportamento secundário** (tempo de recuperação).
- **Nível 5 confirmado — Causa provável + ação sugerida** (já validado com Copeland Smart Alarms no estudo anterior; mantido).
- **Nível 6 emergente — Consulta em linguagem natural sobre a cadeia do frio.** Ferramentas de IA de terceiros (ex.: Debales, conectando-se via API a Sensitech/ORBCOMM/Carrier) permitem perguntas em português/inglês simples ("quais embarques estão em risco?") e encadeiam automaticamente: leitura → alerta de desvio → entrada de auditoria → dado de sinistro, tudo em segundos, sem intervenção manual em cada etapa.
- **Nível 6 (execução) confirmado — Comando de duas vias governado** (ORBCOMM: trocar setpoint, modo, degelo, reboot remotamente, sempre com registro).

### 6.2 Definição para o Kryos — Inteligência Cognitiva

1. **Adicionar `MKT` (Temperatura Cinética Média) como métrica calculada de primeira classe** no plano de energia/compliance para clientes farma/regulados — não apenas máx/mín/média simples. Fórmula termodinâmica padrão (Haynes), calculável a partir da série já coletada, sem novo hardware.
2. **O health score (RF-AI-01 já existente) deve considerar sinais secundários de tendência, não só o valor primário** — especificamente tempo de recuperação pós-degelo, corrente de partida do compressor, e frequência de ciclo — confirmando e detalhando o que já estava previsto de forma genérica no requisito.
3. **Novo requisito: consulta em linguagem natural sobre o estado da operação** ("quais plantas têm alarme crítico agora?", "qual câmara teve mais excursões este mês?") — evolução natural do RF-AI-06 (explicação de alarme), agora como uma interface de busca/pergunta sobre todo o tenant, não só por alarme individual. Isso é a fronteira que o mercado está cruzando agora (2026) e ninguém em refrigeração fechou bem ainda — oportunidade real de diferencial.
4. **O padrão "leitura → alerta → auditoria → dado operacional" deve ser uma cadeia automática no decision ledger**, não passos manuais — cada elo gerado automaticamente pelo anterior, com o humano aprovando apenas onde a política exige (RF-CTRL-03 já cobre a governança; este é o encadeamento de dados que sustenta a UI).

---

## 7. Planos e cobrança

### 7.1 O que os 10 fazem

Cinco padrões comerciais distintos coexistem no setor — o Kryos deve escolher deliberadamente, não herdar um por acidente:

1. **MaaS (Monitoring-as-a-Service) tudo incluso** — hardware, software, alertas, relatórios e suporte num único valor mensal previsível, **sem investimento de capital inicial**. Elimina a barreira de entrada para operações menores. É o modelo que mais se parece com "SaaS puro" no setor.
2. **Por sensor/dispositivo, com desconto por volume** — quanto mais dispositivos, menor o custo unitário (myDevices: "per-device subscription prices decrease as your deployments begin to increase in volume"). Modelo previsível e fácil de explicar a um cliente pequeno.
3. **Por faixa de sensores em degraus (tiered)** — Monnit iMonnit Premiere: US$45/ano até 6 sensores, depois sobe por faixa. Simples de vender self-service, sem contato comercial.
4. **Camada gratuita de prova de conceito (POC)** — myDevices: grátis até 5 dispositivos conectados. Reduz fricção de adoção e é o gancho de entrada de vendas self-service — mesmo padrão que Siemens Insights Hub usa no automação genérica ("Start for Free").
5. **Embutido gratuitamente na venda do hardware (modelo OEM)** — Bitzer Digital Network é gratuito para todos os parceiros que compram compressores Bitzer; a monetização não é a assinatura, é a venda de equipamento + redução de custo de atendimento técnico + retenção de cliente. Não é o modelo do Kryos (que não fabrica hardware), mas é referência para eventuais parcerias com fabricantes de controladores.

**Alavancas de upsell recorrentes:**
- **Módulos de compliance como camada premium** — Módulo HACCP (Eliwell), calibração NIST/ISO gerenciada (TempGenius, Swift Sensors), 21 CFR Part 11/ERES (Monnit, Sensitech) — todos cobrados como adicional sobre o monitoramento básico, nunca incluídos no plano de entrada.
- **Marca branca como tier comercial** — myDevices e Carel tratam customização de marca como recurso de plano superior, habilitando o cliente (tipicamente um integrador/revendedor) a vender a plataforma como sua.
- **Leasing como alternativa à assinatura pura** — TempGenius oferece compra, assinatura mensal ou leasing do hardware, reconhecendo que operações pequenas preferem opex a capex mas grandes cadeias às vezes preferem ativo próprio.
- **Degradação graciosa por inadimplência, nunca perda de dados dentro da retenção** (Alsense, já confirmado no estudo anterior).

### 7.2 Definição para o Kryos — Planos e Cobrança

Cruzando com `RF-BILL-01..05` já existentes no doc de requisitos da plataforma (que definem plano por nº de dispositivos, retenção, canais, módulos, usuários), este estudo adiciona:

1. **Modelo primário recomendado: híbrido MaaS + por-dispositivo com desconto por volume.** Plano de entrada com preço por dispositivo transparente (sem "fale com vendas" para operações pequenas), com desconto automático a partir de faixas de volume (ex.: 1-20, 21-100, 101-500, 500+) — replica o padrão myDevices/Monnit, mas com a curadoria de insight (não só telemetria) incluída, replicando a proposta MaaS.
2. **Camada gratuita de prova de conceito, limitada por dispositivo (não por tempo)** — ex.: grátis até 5 dispositivos, permanente, não trial de 30 dias — reduz fricção e funciona como canal de aquisição self-service, especialmente para pequenos integradores testando o Kryos antes de propor a um cliente maior.
3. **Marca branca confirmada como tier comercial superior** (não recurso universal) — habilita o modelo de canal com integradores brasileiros (Refrisat, Centrivac, SmartMonit) revendendo o Kryos como plataforma própria, consistente com o RNF-USAB-05 já existente.
4. **Módulos de compliance (HACCP, calibração gerenciada, trilha regulatória) como add-on pago explícito**, não obrigatório no plano base — mercado já precifica assim; entrar diferente exigiria educar o mercado sem necessidade.
5. **MKT e health score avançado como recursos do tier "Preditivo/IA"** (RF-AI-*) — separando o valor de "ver o dado" do valor de "a IA me diz o que fazer", que é onde o mercado paga mais (Copeland Smart Alarms, Debales) e onde o diferencial de policy-engine do Kryos se justifica comercialmente.

---

## 8. Síntese e o que muda no Kryos

Este estudo, ao restringir a pesquisa a SaaS puros de refrigeração (em vez de automação industrial genérica), produziu definições mais específicas de domínio do que o benchmark anterior. Três adições concretas ao modelo de produto:

- **Dois objetos de domínio novos:** `CorrectiveAction` (fecha o loop pós-ACK) e `CalibrationCertificate` (rastreabilidade de sensor).
- **Uma métrica regulatória nova:** MKT (Temperatura Cinética Média), de primeira classe para clientes farma/regulados.
- **Um modelo de comercialização recomendado:** híbrido MaaS + por-dispositivo com desconto por volume, camada POC gratuita permanente, marca branca como tier comercial, compliance como add-on — decisão deliberada em vez de herança acidental.

Estas definições devem ser incorporadas como adendo ao `kryos-v1-requisitos.md` (novos RF-OPS/RF-DATA para os objetos, RF-REP para MKT, RF-BILL revisado para o modelo comercial) na próxima rodada de consolidação.

*Fontes: páginas oficiais e documentação técnica de Danfoss Alsense, Copeland/Emerson ProAct+Lumity, Carel, Eliwell (Schneider Electric), AKO Electromecánica, Sensitech/Carrier, ORBCOMM, SmartSense/Digi, Bitzer, Monnit; artigos de mercado especializados em cold-chain e temperature monitoring (2025-2026). Documento produzido cruzando estes achados com `kryos-v1-requisitos.md`, `estudo-webapp-carel-boss.md` e `frontend-product-requirements.md`.*
