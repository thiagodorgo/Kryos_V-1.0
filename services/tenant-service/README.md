# Tenant Service

**Plano:** Control Plane

## Purpose
Dono da hierarquia de ativos do cliente: Tenant → Site → Sistema → Dispositivo → Variável, e do provisionamento transacional de novo tenant.

## Responsibilities
- Provisionar tenant + papéis padrão + usuário fundador em uma única transação.
- Manter a hierarquia de sites/plantas/dispositivos usada por todo o restante da plataforma.
- Publicar mudança de tenant para que outros serviços (billing, module-registry) reajam.

## Messaging (RabbitMQ)
- publica em `kryos.control` com routing key `{tenant}.tenant.provisioned`
- publica em `kryos.control` com routing key `{tenant}.hierarchy.updated`
- Não consome mensagens.

## Dependencies
- `shared/messaging-common`
- `shared/domain-kernel`
- `shared/tenant-context`

## Data Stores
- **postgres** — tenants, sites, hierarquia de ativos

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
