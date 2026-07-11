# Alert Engine

**Plano:** Event Plane

## Purpose
Motor de regras que avalia telemetria normalizada contra limites, histerese e janelas de calendário, gerando alarmes com prioridade e escalonamento tipo Guardian.

## Responsibilities
- Avaliar regras simples e compostas (multi-variável, multi-dispositivo) por tenant.
- Suprimir falso-positivo conhecido (degelo, abertura de porta) definido no Device Profile.
- Publicar ciclo de vida do alarme: levantado, reconhecido, normalizado, encerrado, escalonado.

## Messaging (RabbitMQ)
- publica em `kryos.event` com routing key `{tenant}.alarm.raised`
- publica em `kryos.event` com routing key `{tenant}.alarm.escalated`
- publica em `kryos.event` com routing key `{tenant}.alarm.cleared`
- consome de `kryos.data` com routing key `{tenant}.telemetry.normalized.realtime`

## Dependencies
- `shared/messaging-common`
- `shared/telemetry-common`
- `shared/tenant-context`

## Data Stores
- **postgres** — regras de alarme e estado corrente por dispositivo/variável

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
