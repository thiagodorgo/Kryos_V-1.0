# Billing Service

**Plano:** Control Plane

## Purpose
Planos comerciais, assinatura e ativação/suspensão automática por contrato — dono do modelo híbrido MaaS + por-dispositivo definido em `docs/product/metodologia-tecnica-10-saas-refrigeracao.md`.

## Responsibilities
- Gerenciar plano contratado (dispositivos, retenção, canais, módulos, usuários, tier de marca branca).
- Ativar/suspender tenant por status de contrato, sempre com degradação graciosa (nunca apagar dado dentro da retenção).

## Messaging (RabbitMQ)
- publica em `kryos.control` com routing key `{tenant}.plan.changed`
- publica em `kryos.control` com routing key `{tenant}.subscription.suspended`
- consome de `kryos.control` com routing key `{tenant}.usage.aggregated`

## Dependencies
- `shared/messaging-common`
- `shared/billing-common`
- `shared/tenant-context`

## Data Stores
- **postgres** — planos, assinaturas, status de contrato

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
