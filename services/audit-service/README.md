# Audit Service

**Plano:** Event Plane

## Purpose
Trilha de auditoria imutável de toda ação governada na plataforma: login, mudança de configuração, ACK de alarme, escrita de parâmetro, decisão de agente.

## Responsibilities
- Consumir eventos de todos os planos que representem ação auditável e gravá-los de forma append-only.
- Nunca permitir edição ou exclusão de registro de auditoria — apenas leitura e exportação.
- Servir de evidência para cliente e compliance (HACCP, regulatório).

## Messaging (RabbitMQ)
- Não publica mensagens.
- consome de `kryos.control` com routing key `{tenant}.#`
- consome de `kryos.event` com routing key `{tenant}.#`
- consome de `kryos.agent` com routing key `{tenant}.#`
- consome de `kryos.edge` com routing key `{tenant}.command.#`

## Dependencies
- `shared/messaging-common`
- `shared/tenant-context`

## Data Stores
- **postgres** — trilha de auditoria append-only

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
