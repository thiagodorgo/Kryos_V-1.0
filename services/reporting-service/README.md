# Reporting Service

**Plano:** Operational Plane

## Purpose
Geração de relatórios sob demanda e agendados — temperatura, HACCP, energia (com MKT para clientes regulados), em PDF/CSV.

## Responsibilities
- Gerar relatório a partir de modelo reutilizável (variáveis + período + layout).
- Calcular MKT (Temperatura Cinética Média) para clientes farma/regulados, além de máx/mín/média simples.
- Tratar dado ausente como `***` explícito, nunca como zero.

## Messaging (RabbitMQ)
- publica em `kryos.operational` com routing key `{tenant}.report.generated`
- consome de `kryos.operational` com routing key `{tenant}.report.requested`

## Dependencies
- `shared/messaging-common`
- `shared/telemetry-common`
- `shared/tenant-context`

## Data Stores
- **questdb** — leitura de série temporal para o período do relatório
- **clickhouse** — leitura de agregações de energia
- **postgres** — modelos de relatório

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
