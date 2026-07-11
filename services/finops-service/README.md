# Finops Service

**Plano:** Control Plane

## Purpose
Observabilidade de custo de infraestrutura por tenant/módulo, informando margem por plano — visão interna da Kryos, não do cliente.

## Responsibilities
- Cruzar uso medido com custo de infraestrutura real por tenant/módulo.
- Expor margem por plano para decisão comercial (não exposto ao cliente final).

## Messaging (RabbitMQ)
- Não publica mensagens.
- consome de `kryos.control` com routing key `{tenant}.usage.aggregated`

## Dependencies
- `shared/messaging-common`
- `shared/billing-common`
- `shared/tenant-context`

## Data Stores
- **clickhouse** — custo agregado por tenant/módulo

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
