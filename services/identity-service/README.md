# Identity Service

**Plano:** Control Plane

## Purpose
Autenticação, RBAC por grupo/site, 2FA e (futuro) SSO/LDAP corporativo.

## Responsibilities
- Autenticar usuários com política de senha, expiração e bloqueio por tentativa falha.
- Aplicar 2FA obrigatório para papéis administrativos.
- Resolver escopo de visibilidade de dispositivos por grupo do usuário, consumido por todo serviço com dado sensível a tenant.

## Messaging (RabbitMQ)
- publica em `kryos.control` com routing key `{tenant}.user.authenticated`
- publica em `kryos.control` com routing key `{tenant}.role.changed`
- Não consome mensagens.

## Dependencies
- `shared/messaging-common`
- `shared/security-common`
- `shared/tenant-context`

## Data Stores
- **postgres** — usuários, papéis, grupos
- **redis** — sessão

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
