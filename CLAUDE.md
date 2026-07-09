# Industrial Platform - Claude Code Instructions

## Project Identity
This repository is the foundation for an enterprise industrial SaaS platform for operational monitoring, operational telemetry, event-driven automation, billing, metering, FinOps, and specialized agents. It targets industrial assets, critical assets, automation systems, controlled environments, industrial observability, operational intelligence, edge acquisition, and an event-driven platform.

## Current Stage
The current stage is structure-only.

- do not implement business domain in this stage;
- do not create domain tests in this stage;
- do not create integrations in this stage;
- do not analyze backup memory in this stage;
- do not generate production deployment artifacts in this stage.

## Architecture Planes
- Control Plane: future tenants, users, permissions, plans, modules, subscriptions, feature flags, internal console, usage controls, and commercial policies.
- Data Plane: future ingestion, normalization, telemetry, time-series data, latest values, hot state, retention, and data quality.
- Event Plane: future RabbitMQ events, queues, streams, retries, DLQ, idempotency, correlationId, and causationId.
- Agent Orchestration Plane: future agent registry, task routing, context building, tool permissions, policy engine, human-in-the-loop, decision ledger, auditability, and specialized module agents.
- Operational Plane: future alerts, incidents, technical dispatch, notifications, reports, SLA, evidence, and operational history.
- Edge Plane: future Edge Collector, local acquisition, industrial protocols, offline buffer, edge-to-cloud publication, and edge security.

## Mandatory Engineering Workflow
1. plan;
2. simulate;
3. replan if needed;
4. implement;
5. test;
6. security review;
7. critical review;
8. human approval;
9. release.

No relevant change should skip planning.

## Backup Memory Policy
- a pasta backup é preservada como memória de backup;
- backup é read-only por padrão;
- não modificar backup sem aprovação humana explícita;
- não copiar conteúdo técnico da memória de backup para arquivos novos sem tarefa futura específica;
- não usar memória de backup como fonte ativa de implementação nesta etapa.

## Agent Execution Principle
- agente recomenda;
- policy engine valida;
- serviço de domínio executa;
- humano aprova quando necessário;
- toda decisão crítica deve ser auditável.

## Safety Rules
- não ler secrets;
- não commitar credenciais;
- não fazer deploy direto;
- não aprovar a própria implementação;
- não alterar billing sem quality gates;
- não alterar multi-tenancy sem revisão;
- não executar ações críticas sem policy/human approval.

## Documentation Rules
- toda mudança estrutural deve atualizar README, module.yaml ou ADR;
- toda pasta importante deve ter README;
- todo módulo deve ter module.yaml e quality-gates.yaml;
- documentação não deve afirmar que algo está implementado quando está apenas planejado.
