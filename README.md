# Kryos V-1.0

Plataforma SaaS de monitoramento e automação para refrigeração industrial, construída para o mercado brasileiro e desenhada para competir com players nacionais (IT4IoT, Refrisat, Centrivac, Squair, SmartMonit) e internacionais (Carel, Danfoss, Full Gauge/Sitrad).

**Estágio atual: `structure-only`.** Este repositório contém arquitetura, requisitos, contratos e governança — não contém, ainda, implementação de domínio funcional. Toda documentação aqui reflete o que a plataforma *vai* fazer e *como* será construída; nenhuma linha de código de negócio existe fora dos módulos explicitamente marcados. Ver `docs/adr/` para as decisões já tomadas e `docs/product/goals-and-strategy.md` para o que vem a seguir.

## Como navegar este repositório

| Se você quer... | Vá para |
|---|---|
| Entender o produto e para onde ele vai | `docs/product/goals-and-strategy.md`, `docs/product/product-vision.md` |
| Ver os requisitos completos da plataforma | `docs/product/` (requisitos, metodologia de mercado) |
| Entender a arquitetura de 6 planos | `docs/architecture/platform-overview.md` e os 8 docs de plano na mesma pasta |
| Ver decisões de arquitetura já tomadas | `docs/adr/` |
| Entender pontos fortes e fracos da estrutura atual | `docs/architecture/structural-assessment.md` |
| Trabalhar no frontend | `docs/frontend/frontend-product-requirements.md`, `apps/customer-portal`, `apps/saas-admin-console` |
| Entender o backbone de mensageria (RabbitMQ) | `docs/adr/0005-rabbitmq-unified-messaging-backbone.md`, `.claude/rules/global/rabbitmq.md` |
| Ver os 17 microsserviços | `services/` |
| Ver as bibliotecas compartilhadas | `shared/` |
| Entender a governança de engenharia (como agentes trabalham aqui) | `CLAUDE.md`, `.claude/agents/`, `.claude/rules/`, `.claude/skills/` |
| Ver o histórico de projetos que fundamentam este (motor C++, protótipo v2, WebApp Carel estudado) | `backup/` (memória somente-leitura, nunca editada) |

## Arquitetura em uma frase por plano

- **Control** — tenant, identidade, módulos habilitados por plano, billing, metering, finops.
- **Data** — ingestão, normalização e escrita de telemetria (QuestDB + Redis hot state).
- **Event** — alarmes e auditoria.
- **Agent Orchestration** — recomendações de IA (manutenção preditiva, otimização energética) com decision ledger auditável.
- **Operational** — incidentes, despacho técnico, notificação, relatórios.
- **Edge** — coletor Modbus na borda, soberano quando offline, fila de prioridade REAL_TIME/HISTORY herdada do motor C++ de referência.

Todos os planos se comunicam de forma assíncrona exclusivamente via RabbitMQ, conforme `docs/adr/0005-rabbitmq-unified-messaging-backbone.md`.

## Stack

Java 21 · Spring Boot 3.3.6 · PostgreSQL · RabbitMQ · Redis · QuestDB · ClickHouse (planejado) · Maven multi-módulo. Frontend: PWA responsivo mobile-first, tokens em `docs/frontend/frontend-product-requirements.md`.

## Governança

Todo trabalho neste repositório segue `CLAUDE.md`: plan → simulate → implement → test → security review → critical review → human approval → release. Nenhum módulo é implementado sem `module.yaml`, `README.md` e `quality-gates.yaml` alinhados ao estágio real. A pasta `backup/` é memória histórica somente-leitura — nunca editada, apenas consultada para extrair padrões validados.

## Licenciamento e propriedade de terceiros

Este repositório referencia, em `backup/kryos/WebApp`, material de estudo de um supervisório de terceiros (Carel) usado exclusivamente para engenharia reversa de requisitos de UX — não é código do produto Kryos e não deve ser tratado como tal.
