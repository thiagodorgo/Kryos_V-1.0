# Metering Service

**Plano:** Control Plane

## Purpose
Medição de uso real por tenant — pontos de telemetria ingeridos, notificações enviadas, chamadas de API, armazenamento — base para cobrança e quotas.

## Responsibilities
- Agregar uso a partir dos eventos publicados por outros planos (nunca por leitura direta de banco de outro serviço).
- Publicar uso agregado periodicamente para billing e finops consumirem.

## Messaging (RabbitMQ)
- publica em `kryos.control` com routing key `{tenant}.usage.aggregated`
- consome de `kryos.data` com routing key `{tenant}.telemetry.raw.realtime`
- consome de `kryos.data` com routing key `{tenant}.telemetry.raw.history`
- consome de `kryos.operational` com routing key `{tenant}.notification.dispatched`

## Dependencies
- `shared/messaging-common`
- `shared/billing-common`
- `shared/tenant-context`

## Data Stores
- **clickhouse** — agregação de uso de longo prazo
- **postgres** — quotas e limites correntes por tenant

## Current Stage
Structure only. No business implementation yet — this README describes the approved design, not existing code.

## Not Implemented Yet
- domain model;
- APIs;
- database integration;
- messaging integration;
- business logic;
- domain tests;
- external integrations.

## Governance
Refer to:
- CLAUDE.md;
- module.yaml;
- quality-gates.yaml;
- docs/adr/0005-rabbitmq-unified-messaging-backbone.md (mensageria);
- .claude/agents/domain/rabbitmq-domain-agent.md (revisão de topologia).
