# Telemetry Normalizer

**Plano:** Data Plane

## Purpose
Converte registrador cru em valor de engenharia (°C, bar, %, kWh) aplicando o Device Profile do dispositivo (escala, offset, enumeração), preservando o valor cru ao lado do normalizado para auditoria.

## Responsibilities
- Consumir telemetria bruta REAL_TIME e HISTORY separadamente.
- Aplicar fator/offset/curva do Device Profile e resolver enumerações valor→estado.
- Publicar telemetria normalizada mantendo a mesma separação de classe.

## Messaging (RabbitMQ)
- publica em `kryos.data` com routing key `{tenant}.telemetry.normalized.realtime`
- publica em `kryos.data` com routing key `{tenant}.telemetry.normalized.history`
- consome de `kryos.data` com routing key `{tenant}.telemetry.raw.realtime`
- consome de `kryos.data` com routing key `{tenant}.telemetry.raw.history`

## Dependencies
- `shared/messaging-common`
- `shared/telemetry-common`
- `shared/tenant-context`

## Data Stores
- **redis** — cache de Device Profile para evitar consulta repetida por mensagem

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
