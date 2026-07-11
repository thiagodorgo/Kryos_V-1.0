# Control Plane

## Purpose
Governar quem é o cliente (tenant), quem pode acessar o quê (identidade/RBAC), o que está habilitado para cada um (módulos por plano) e como isso é cobrado (billing/metering/finops).

## Responsibilities
- Provisionamento transacional de tenant (tenant + papéis padrão + usuário fundador + configuração em uma única transação).
- Autenticação (2FA, SSO/LDAP futuro) e RBAC com escopo por site/grupo de usuário.
- Feature flags e módulos habilitados por plano contratado (module-registry-service).
- Planos comerciais, medição de uso e observabilidade de custo interno (billing/metering/finops-service).

## Components in this plane
- tenant-service
- identity-service
- module-registry-service
- billing-service
- metering-service
- finops-service

## Mensageria (RabbitMQ)
Este plano publica/consome mensagens no exchange `kryos.control`, conforme `docs/adr/0005-rabbitmq-unified-messaging-backbone.md`.

## Risks
- Isolamento de tenant insuficiente se RLS e escopo de query não forem aplicados consistentemente (ver skill saas-multi-tenant).
- Acoplamento entre billing e domínio operacional se metering não for desenhado como consumidor de eventos, e sim como leitura direta de outros bancos.

## Status
structure-only

## Not Implemented
Nenhum comportamento de domínio, API, banco de dados, mensageria real ou agente de produção está implementado nesta pasta. Este documento descreve o desenho arquitetural aprovado, não código existente.
