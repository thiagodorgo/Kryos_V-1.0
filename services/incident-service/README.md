# Incident Service

**Plano:** Operational Plane

## Purpose
Converte alarmes isolados ou correlacionados em incidentes com responsável, criticidade, SLA e linha do tempo de evidências.

## Responsibilities
- Abrir incidente a partir de alarme (ou correlação de múltiplos alarmes do mesmo ativo).
- Rastrear SLA: tempo até ACK, tempo até normalização, reincidência por ativo.
- Encerrar incidente com evidência vinculada (ação corretiva, foto pós-reparo).

## Messaging (RabbitMQ)
- publica em `kryos.operational` com routing key `{tenant}.incident.opened`
- publica em `kryos.operational` com routing key `{tenant}.incident.closed`
- consome de `kryos.event` com routing key `{tenant}.alarm.raised`

## Dependencies
- `shared/messaging-common`
- `shared/tenant-context`

## Data Stores
- **postgres** — incidentes, SLA, ações corretivas vinculadas

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
