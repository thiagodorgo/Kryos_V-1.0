# Module Registry Service

**Plano:** Control Plane

## Purpose
Feature flags e módulos habilitados por tenant conforme plano contratado (monitoramento, alarmes avançados, energia, IA preditiva, despacho).

## Responsibilities
- Manter o catálogo de módulos disponíveis e o que está habilitado por tenant.
- Reagir a mudança de plano habilitando/desabilitando módulo automaticamente.

## Messaging (RabbitMQ)
- publica em `kryos.control` com routing key `{tenant}.module.enabled`
- publica em `kryos.control` com routing key `{tenant}.module.disabled`
- consome de `kryos.control` com routing key `{tenant}.plan.changed`

## Dependencies
- `shared/messaging-common`
- `shared/tenant-context`

## Data Stores
- **postgres** — catálogo de módulos, habilitação por tenant

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
