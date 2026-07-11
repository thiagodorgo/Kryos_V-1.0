# Notification Service

**Plano:** Operational Plane

## Purpose
Cascata de notificação multicanal (push, e-mail, WhatsApp, SMS, voz) com escalonamento por prioridade e cadeia de plantão por horário.

## Responsibilities
- Rotear alarme para o canal e destinatário certos conforme prioridade e escala de plantão.
- Confirmar entrega e escalar automaticamente se não houver ACK dentro do tempo da prioridade.
- Respeitar preferências de canal por usuário, com teste de canal obrigatório antes de ativar.

## Messaging (RabbitMQ)
- publica em `kryos.operational` com routing key `{tenant}.notification.dispatched`
- consome de `kryos.event` com routing key `{tenant}.alarm.raised`
- consome de `kryos.event` com routing key `{tenant}.alarm.escalated`

## Dependencies
- `shared/messaging-common`
- `shared/tenant-context`

## Data Stores
- **postgres** — preferências de canal, escala de plantão, log de entrega

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
