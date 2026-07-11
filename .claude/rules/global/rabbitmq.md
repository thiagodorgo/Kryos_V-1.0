# Purpose
Governar o uso do RabbitMQ como backbone único de mensageria assíncrona interna do Kryos, conforme `docs/adr/0005-rabbitmq-unified-messaging-backbone.md`. Este arquivo é a referência que todo agente consulta antes de propor ou revisar qualquer publisher, consumer, exchange ou fila.

# Rules
- RabbitMQ é o transporte de **toda** comunicação assíncrona entre serviços: telemetria, alarmes, comandos/setpoints, recomendações de agente, auditoria, notificação, billing/metering, incidentes e despacho. Consultas síncronas de leitura do frontend não passam por fila (REST/BFF ou read model).
- Seis exchanges topic, um por plano: `kryos.control`, `kryos.data`, `kryos.event`, `kryos.agent`, `kryos.operational`, `kryos.edge`. Nenhum exchange novo sem atualizar o ADR-0005.
- Routing key sempre `{tenantId}.{entidade}.{ação}`. Nome de fila sempre `{service}.{propósito}.q`, nunca compartilhada entre serviços.
- Telemetria REAL_TIME e HISTORY usam **filas separadas**, nunca o recurso nativo `x-max-priority` (risco de degradação sob backlog).
- Toda fila declara `x-dead-letter-exchange` para `kryos.{plano}.dlx`; mensagens mortas em `{service}.{propósito}.dlq`; retry limitado com backoff antes de DLQ definitiva.
- Toda mensagem carrega `tenantId`, `correlationId`, `causationId`, `messageId` (idempotência) e `schemaVersion`. Nenhuma mensagem sem esses cabeçalhos é válida, nem em especificação nem em código futuro.
- Todo consumidor deve ser idempotente por `messageId` — requisito de aceitação, não otimização futura.
- `shared/messaging-common` é o único lugar onde a conexão, declaração de exchange/fila/DLX e helpers de idempotência são implementados; nenhum serviço reimplementa isso.
- Comando de escrita a dispositivo de campo só existe pelo canal `kryos.edge` com o contrato setpoint+ACK (`applied/rejected/failed`) — nenhum outro caminho de escrita é válido.
- Nada está implementado nesta etapa: esta é especificação de topologia, não código, conexão real ou deploy.

# Required Checks
- Confirmar stage structure-only em qualquer artefato gerado a partir desta regra.
- Toda proposta de exchange/fila/routing key nova é validada contra o ADR-0005 antes de aceitação; divergência exige atualização do ADR, não exceção silenciosa.
- Todo `module.yaml` de serviço que declara `rabbitmq.planned: true` deve listar `publishesEvents`/`consumesEvents` com exchange e routing key explícitos, não genéricos.
- Confirmar que nenhuma mensagem proposta carece dos cabeçalhos obrigatórios.

# Rejection Criteria
- Implementação prematura (conexão real, deploy, credenciais).
- Exchange, fila ou padrão de roteamento fora da convenção deste arquivo sem atualizar o ADR primeiro.
- Consumidor proposto sem estratégia de idempotência.
- Caminho de escrita a dispositivo de campo fora do canal `kryos.edge` governado.
- Alteração de memória de backup.
- Credenciais, deploy ou falsas afirmações de implementação.
