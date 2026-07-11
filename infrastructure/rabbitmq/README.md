# RabbitMQ Infrastructure

Backbone de mensageria assíncrona de toda a plataforma Kryos, conforme `docs/adr/0005-rabbitmq-unified-messaging-backbone.md` e `.claude/rules/global/rabbitmq.md`.

## O que esta pasta vai conter (quando implementada)
- Definição declarativa de exchanges, filas, DLX/DLQ e bindings (via `rabbitmq.conf`/`definitions.json` ou equivalente Terraform/Helm), refletindo os 6 exchanges topic (`kryos.control`, `kryos.data`, `kryos.event`, `kryos.agent`, `kryos.operational`, `kryos.edge`).
- Políticas de HA (mirrored queues/quorum queues), limites de recurso por fila, e política de retenção de DLQ.
- Configuração de usuários/vhosts por ambiente (dev/staging/produção), nunca credenciais em texto no repositório.

## Topologia planejada (referência rápida)
| Exchange | Plano | Exemplos de routing key |
|---|---|---|
| `kryos.control` | Control | `{tenant}.tenant.provisioned`, `{tenant}.plan.changed` |
| `kryos.data` | Data | `{tenant}.telemetry.raw.realtime`, `{tenant}.telemetry.raw.history` |
| `kryos.event` | Event | `{tenant}.alarm.raised`, `{tenant}.audit.recorded` |
| `kryos.agent` | Agent Orchestration | `{tenant}.recommendation.created` |
| `kryos.operational` | Operational | `{tenant}.incident.opened`, `{tenant}.notification.dispatched` |
| `kryos.edge` | Edge | `{tenant}.command.requested`, `{tenant}.command.applied` |

Toda fila declarada com `x-dead-letter-exchange` para `kryos.{plano}.dlx`. Telemetria REAL_TIME e HISTORY em filas separadas, nunca priority queue nativa (ver justificativa no ADR-0005).

## Estágio
`structure-only`. Nenhum manifesto Kubernetes, Terraform, configuração de produção ou ação de deploy existe nesta etapa. A implementação real segue o workflow plan → simulate → implement → test → review → approve, com `rabbitmq-domain-agent` como revisor de topologia.
