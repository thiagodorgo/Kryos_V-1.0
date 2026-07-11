# Billing, Metering and FinOps

## Purpose
Fechar o ciclo comercial: o que o cliente contratou, quanto ele efetivamente usa, e quanto isso custa para a Kryos operar — três perguntas distintas, três serviços distintos.

## Responsibilities
- Planos comerciais com dimensões de dispositivos, retenção, canais, módulos e usuários (billing-service).
- Medição de uso real por tenant (pontos ingeridos, notificações, chamadas de API, armazenamento) alimentando cobrança e quotas (metering-service).
- Observabilidade de custo de infraestrutura por tenant/módulo, informando margem por plano (finops-service).
- Modelo comercial recomendado: híbrido MaaS + por-dispositivo com desconto de volume, POC gratuito permanente, marca branca como tier — ver `docs/product/metodologia-tecnica-10-saas-refrigeracao.md` §7.

## Components in this plane
- billing-service
- metering-service
- finops-service

## Mensageria (RabbitMQ)
Este plano publica/consome mensagens no exchange `kryos.control`, conforme `docs/adr/0005-rabbitmq-unified-messaging-backbone.md`.

## Risks
- Metering lendo direto de bancos de outros planos em vez de consumir eventos — acoplamento que o ADR-0005 existe para evitar.
- Degradação por inadimplência apagando dado dentro da retenção contratada, violando RF-BILL-03.

## Status
structure-only

## Not Implemented
Nenhum comportamento de domínio, API, banco de dados, mensageria real ou agente de produção está implementado nesta pasta. Este documento descreve o desenho arquitetural aprovado, não código existente.
