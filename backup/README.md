# Kryos_V-1.0

Desenvolvimento da plataforma Kryos.

## Execução do motor C++

O motor não possui XML legado padrão embutido.

- Sem legado (default):
  - execute `KryosEngine` sem argumentos.
- Com legado (opcional):
  - execute `KryosEngine /caminho/para/arquivo.xml`.


---

# Industrial Platform

## Vision
This repository is the foundation for an enterprise industrial SaaS platform for operational observability, operational telemetry, events, automation, billing, metering, FinOps, and specialized agents across industrial assets and critical processes.

## Repository Status
- stage: foundation skeleton;
- estrutura criada para desenvolvimento futuro;
- ainda não há implementação de domínio nesta fundação.

## Architecture Planes
### Control Plane
Future tenant, user, permission, plan, module, subscription, feature flag, usage-control, and internal SaaS administration capabilities.

### Data Plane
Future ingestion, normalization, operational telemetry, time-series persistence, hot state, latest values, retention, and data quality capabilities.

### Event Plane
Future RabbitMQ-centered event-driven platform responsibilities, including queues, streams, retries, DLQ, idempotency, correlationId, and causationId.

### Agent Orchestration Plane
Future agent registry, task routing, context construction, policy validation, human-in-the-loop controls, decision ledger, and auditability.

### Operational Plane
Future alerts, incidents, technical dispatch, notifications, reporting, SLA evidence, and operational history.

### Edge Plane
Future Edge Collector, edge acquisition, controlled local collection, offline buffer, edge-to-cloud publication, and edge security.

## Repository Layout
- `.claude`: Claude Code settings, agents, rules, skills, and hooks.
- `docs`: ADRs, architecture, product notes, history, and runbooks.
- `specs`: future module, event, API, agent, billing, telemetry, security, and simulation specifications.
- `apps`: future SaaS admin console and customer portal skeletons.
- `services`: future backend service modules.
- `shared`: future shared Maven library modules.
- `edge`: future edge acquisition modules.
- `infrastructure`: future infrastructure documentation placeholders.
- `simulations`: future simulation workspaces.
- `quality`: global quality gates.
- `security`: security principles and future controls.
- `engineering-runs`: auditable engineering run reports.
- `backup`: A pasta backup é preservada como memória de backup e não deve ser modificada sem aprovação humana explícita.

## Local Validation
```bash
mvn -B validate
git status --short
```

## Development Workflow
plan -> simulate -> replan -> implement -> test -> security review -> critical review -> human approval -> release

## What Is Not Implemented Yet
- domínio;
- APIs;
- banco;
- mensageria;
- UI;
- integrações;
- Edge Collector;
- agentes de produção;
- testes de domínio;
- deploy.

## Next Steps
- Review and approve the foundation structure.
- Select the first bounded module for implementation.
- Write specs before implementation.
- Add domain code only after planning, simulation, review, and approval.
- Add tests when domain behavior exists.
