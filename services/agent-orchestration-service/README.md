# Agent Orchestration Service

**Plano:** Agent Orchestration Plane

## Purpose
Executa agentes de IA especializados (manutenção preditiva, otimização energética, explicação de alarme) que apenas recomendam — nunca escrevem diretamente no campo.

## Responsibilities
- Calcular health score e sinais de tendência (recuperação de degelo, corrente de compressor) a partir de telemetria histórica.
- Gerar recomendação com explicação (causa provável + ação sugerida), nunca uma ordem direta.
- Registrar toda recomendação no decision ledger antes de encaminhar ao policy-engine.

## Messaging (RabbitMQ)
- publica em `kryos.agent` com routing key `{tenant}.recommendation.created`
- consome de `kryos.data` com routing key `{tenant}.telemetry.normalized.history`
- consome de `kryos.event` com routing key `{tenant}.alarm.raised`

## Dependencies
- `shared/messaging-common`
- `shared/ai-common`
- `shared/tenant-context`

## Data Stores
- **postgres** — decision ledger, histórico de recomendações

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
