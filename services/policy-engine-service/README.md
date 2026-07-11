# Policy Engine Service

**Plano:** Control Plane

## Purpose
Único portão de escrita da plataforma: valida toda recomendação de agente ou comando de usuário contra faixa segura, permissão e janela antes de liberar execução no campo.

## Responsibilities
- Validar setpoint/comando contra a faixa segura do Device Profile e a permissão do solicitante.
- Exigir aprovação humana quando a política do tenant demandar.
- Ser o único serviço autorizado a publicar no canal de comando governado do Edge Plane.

## Messaging (RabbitMQ)
- publica em `kryos.edge` com routing key `{tenant}.command.requested`
- consome de `kryos.agent` com routing key `{tenant}.recommendation.created`

## Dependencies
- `shared/messaging-common`
- `shared/ai-common`
- `shared/tenant-context`
- `shared/security-common`

## Data Stores
- **postgres** — políticas, faixas seguras, histórico de decisão

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
