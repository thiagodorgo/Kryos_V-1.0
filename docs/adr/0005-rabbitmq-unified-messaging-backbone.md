# ADR-0005: RabbitMQ como Backbone Unificado de Mensageria Interna

## Status
Accepted — 10/07/2026

## Contexto
O Kryos é composto por 17 microsserviços em 6 planos (Control, Data, Event, Agent Orchestration, Operational, Edge). Até esta decisão, `.claude/rules/global/rabbitmq.md` descrevia o RabbitMQ apenas como "o Event Plane" — ambíguo sobre se comandos do Control Plane, telemetria do Data Plane e recomendações do Agent Orchestration Plane deveriam ou não passar por ele. O dono do produto confirmou explicitamente: **RabbitMQ será usado para todo o fluxo de mensagem interna** entre os serviços da plataforma.

Esta decisão precisa de topologia concreta — não apenas a afirmação de que RabbitMQ existe — para que os 17 `module.yaml` e READMEs de serviço possam declarar, de forma verificável, o que publicam e o que consomem.

## Decisão

### 1. Escopo: o que passa por RabbitMQ e o que não passa
RabbitMQ é o backbone de **toda comunicação assíncrona entre serviços internos**: telemetria, alarmes, comandos/setpoints, recomendações de agente, eventos de auditoria, notificações, billing/metering, incidentes e despacho. **Não** é usado para chamadas síncronas de leitura que o frontend faz a um serviço (ex.: o portal listando plantas do tenant) — essas permanecem REST síncrono entre gateway/BFF e serviço, ou um modelo de leitura (read model) alimentado pelos eventos. Forçar consulta síncrona através de uma fila é antipadrão (lição registrada para não repetir erro comum do setor).

### 2. Topologia de exchanges — um exchange topic por plano
Seis exchanges topic, espelhando os 6 planos da arquitetura, para que o roteamento seja legível por onde uma mensagem nasce:
- `kryos.control` — tenant, identidade, módulos, billing, metering, finops
- `kryos.data` — telemetria bruta e normalizada
- `kryos.event` — alarmes e auditoria
- `kryos.agent` — recomendações de IA e decision ledger
- `kryos.operational` — incidentes, despacho, notificação, relatórios
- `kryos.edge` — canal de comando/configuração entre nuvem e coletor de borda

### 3. Convenção de routing key
`{tenantId}.{entidade}.{ação}` — ex.: `acme-corp.telemetry.raw`, `acme-corp.alarm.raised`, `acme-corp.setpoint.requested`. Colocar `tenantId` como primeiro segmento permite roteamento e particionamento por tenant no futuro sem redesenhar exchanges.

### 4. Convenção de nome de fila
`{service}.{propósito}.q` — ex.: `telemetry-normalizer.raw-in.q`, `alert-engine.telemetry-in.q`, `notification-service.alarm-in.q`. Uma fila por serviço-consumidor-propósito, nunca fila compartilhada entre serviços distintos (evita acoplamento oculto).

### 5. Prioridade REAL_TIME × HISTORY — filas separadas, não priority queue nativa
O motor C++ do backup já resolve isso na borda com fila de prioridade em memória. Na nuvem, a decisão é **filas separadas por classe**, não o recurso nativo `x-max-priority` do RabbitMQ: priority queues nativas têm custo de CPU maior e degradam com backlog grande (centenas de milhares de mensagens), exatamente o cenário de pico que a plataforma precisa suportar bem. Em vez disso: `telemetry-normalizer.raw-realtime.q` (vinculada a `*.telemetry.raw.realtime`) e `telemetry-normalizer.raw-history.q` (vinculada a `*.telemetry.raw.history`), cada uma com pool de consumidores dimensionado de forma independente — mais réplicas e menor lote no caminho realtime, lotes maiores e menor prioridade de CPU no caminho history.

### 6. Dead-lettering e retry
Toda fila declarada com `x-dead-letter-exchange` apontando para `kryos.{plano}.dlx`; mensagens mortas pousam em `{service}.{propósito}.dlq`. Retry automático limitado (3 tentativas, backoff exponencial via TTL+DLX ou plugin de delayed-exchange), depois a mensagem fica na DLQ para triagem manual ou automatizada — cumpre RNF-DISP-02 (at-least-once + DLQ), já presente no doc de requisitos da plataforma.

### 7. Cabeçalhos obrigatórios em toda mensagem
`tenantId`, `correlationId`, `causationId` (já previstos em `event-contracts.md`), mais dois novos: `messageId` (UUID, chave de deduplicação/idempotência no consumidor) e `schemaVersion` (SemVer do contrato do payload, alinhado à governança SemVer já estabelecida nos contratos v1.0 da base 1) e `producedAt` (timestamp de origem, distinto do timestamp do broker).

### 8. Idempotência obrigatória no consumidor
RabbitMQ garante *at-least-once*, não *exactly-once*. Todo consumidor deve ser idempotente via `messageId` (tabela de deduplicação ou semântica de upsert) — não é opcional, é requisito de aceitação de qualquer serviço que consome fila.

### 9. Canal de comando governado (Control × Edge)
Comandos/setpoints seguem o contrato setpoint+ACK já definido na base 1: `policy-engine-service` publica em `kryos.edge` com routing key `{tenant}.command.requested`; o edge-collector confirma publicando em `{tenant}.command.applied|rejected|failed` de volta em `kryos.edge`. Nenhum serviço escreve num dispositivo de campo fora deste canal.

## Consequências
- Todo `module.yaml` de serviço deve declarar `rabbitmq.planned: true` com `publishesEvents`/`consumesEvents` explícitos, referenciando exchange e routing key desta convenção — não mais `planned: false` genérico.
- `shared/messaging-common` passa a ser o dono da implementação dos cabeçalhos obrigatórios, da declaração de exchange/fila/DLX e do helper de idempotência — todo serviço depende dele para publicar/consumir, nunca reimplementa a conexão.
- `specs/events` deve conter o schema formal de cada mensagem antes de qualquer publisher ser implementado (RNF-MAN-04 já exige isso).
- Ainda **nada está implementado nesta etapa** — esta é uma decisão de arquitetura documentada, não código. Implementação segue o workflow plan → simulate → implement → test → review → approve.

## Alternativas consideradas e rejeitadas
- **Kafka** em vez de RabbitMQ: rejeitado — RabbitMQ já era a escolha do bootstrap inicial (docker-compose, module.yaml), e o padrão de mensagens do Kryos é majoritariamente comando/evento discreto com necessidade de roteamento flexível por tenant/entidade, não log distribuído de replay longo (caso de uso mais forte do Kafka). QuestDB/ClickHouse já cobrem a necessidade de replay/histórico de telemetria.
- **RabbitMQ priority queues nativas** para REAL_TIME × HISTORY: rejeitado por risco de degradação sob backlog, conforme item 5.
- **Fila compartilhada por plano** em vez de fila por serviço: rejeitado — esconde acoplamento e dificulta escalar consumidores de forma independente.

## Follow-ups
- Atualizar os 17 `module.yaml` de serviço com `publishesEvents`/`consumesEvents` concretos (feito nesta mesma rodada de trabalho para os serviços mais claramente definidos).
- Formalizar o schema de cada mensagem em `specs/events` antes de qualquer implementação de publisher/consumer.
- `infrastructure/rabbitmq` deve documentar (ainda sem manifests reais) a declaração de exchanges/filas conforme esta topologia, para que a etapa de implementação tenha um mapa único a seguir.
