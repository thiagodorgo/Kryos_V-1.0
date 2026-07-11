# Ingestion Gateway

**Plano:** Data Plane

## Purpose
Gateway autenticado que recebe telemetria em lote e em tempo real enviada pelo edge-collector (mTLS/token por coletor) e a publica no Data Plane para o restante do pipeline processar.

## Responsibilities
- Autenticar cada coletor de borda por credencial única (mTLS ou token rotacionável).
- Validar o envelope da mensagem (cabeçalhos obrigatórios do ADR-0005) antes de publicar.
- Publicar telemetria bruta separada por classe REAL_TIME e HISTORY, preservando a decisão de prioridade que o coletor já tomou na borda.

## Messaging (RabbitMQ)
- publica em `kryos.data` com routing key `{tenant}.telemetry.raw.realtime`
- publica em `kryos.data` com routing key `{tenant}.telemetry.raw.history`
- Não consome mensagens.

## Dependencies
- `shared/messaging-common`
- `shared/security-common`
- `shared/tenant-context`

## Data Stores
- Nenhum banco dedicado planejado para este serviço.

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
