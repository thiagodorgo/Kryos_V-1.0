# Telemetry Writer

**Plano:** Data Plane

## Purpose
Serviço terminal do pipeline de telemetria: persiste série temporal em QuestDB e atualiza o hot state em Redis consultado pelo dashboard em tempo real.

## Responsibilities
- Escrever série temporal particionada por tenant e tempo.
- Atualizar 'últimos valores' em Redis com latência de leitura p95 ≤ 300ms.
- Aplicar retenção de histórico conforme o plano contratado do tenant.

## Messaging (RabbitMQ)
- Não publica mensagens.
- consome de `kryos.data` com routing key `{tenant}.telemetry.normalized.realtime`
- consome de `kryos.data` com routing key `{tenant}.telemetry.normalized.history`

## Dependencies
- `shared/messaging-common`
- `shared/telemetry-common`
- `shared/tenant-context`

## Data Stores
- **questdb** — série temporal de telemetria, partição por tenant+tempo
- **redis** — hot state de últimos valores

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
