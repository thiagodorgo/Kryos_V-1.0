# Dispatch Service

**Plano:** Operational Plane

## Purpose
Atribui incidente a técnico ou empresa parceira, com checklist de atendimento e encerramento com evidência.

## Responsibilities
- Atribuir incidente a técnico/parceiro conforme escopo e disponibilidade.
- Rastrear checklist de atendimento, causa raiz e peças usadas.
- Registrar encerramento com evidência (foto, leitura pós-reparo).

## Messaging (RabbitMQ)
- publica em `kryos.operational` com routing key `{tenant}.dispatch.assigned`
- publica em `kryos.operational` com routing key `{tenant}.dispatch.completed`
- consome de `kryos.operational` com routing key `{tenant}.incident.opened`

## Dependencies
- `shared/messaging-common`
- `shared/tenant-context`

## Data Stores
- **postgres** — atribuições, checklist, evidência de atendimento

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
