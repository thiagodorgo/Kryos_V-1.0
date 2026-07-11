# Agent Orchestration Plane

## Purpose
Executar agentes de IA especializados (manutenção preditiva, otimização energética, explicação de alarme) que recomendam — nunca executam diretamente — ações sobre a operação do cliente.

## Responsibilities
- Calcular sinais de saúde do ativo (health score, tendência de tempo de recuperação de degelo, corrente de compressor) e gerar recomendações com explicação.
- Registrar toda recomendação, validação de política e aprovação humana no decision ledger, de forma auditável.
- Nunca executar comando diretamente no campo — toda ação passa pelo policy-engine-service (Control) antes de chegar ao edge.

## Components in this plane
- agent-orchestration-service

## Mensageria (RabbitMQ)
Este plano publica/consome mensagens no exchange `kryos.agent`, conforme `docs/adr/0005-rabbitmq-unified-messaging-backbone.md`.

## Risks
- Violação do princípio human-in-the-loop se um agente ganhar caminho de escrita direto ao invés de recomendar.
- Recomendação sem explicação rastreável, quebrando a confiança do operador e o valor do decision ledger.

## Status
structure-only

## Not Implemented
Nenhum comportamento de domínio, API, banco de dados, mensageria real ou agente de produção está implementado nesta pasta. Este documento descreve o desenho arquitetural aprovado, não código existente.
