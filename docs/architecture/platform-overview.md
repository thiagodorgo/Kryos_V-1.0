# Platform Overview

## Purpose
Descrever a arquitetura de 6 planos do Kryos e como eles se conectam via RabbitMQ, servindo como o mapa de entrada antes de mergulhar em cada plano individualmente.

## Responsibilities
- Documentar a fronteira de responsabilidade de cada um dos 6 planos (Control, Data, Event, Agent Orchestration, Operational, Edge).
- Documentar como os planos se comunicam (RabbitMQ, ver ADR-0005) e como não se comunicam (nunca acesso direto a banco de outro plano).
- Servir de índice para os 8 documentos de plano específicos nesta mesma pasta.

## Components in this plane
- Control Plane — tenant, identidade, módulos, billing, metering, finops.
- Data Plane — ingestão, normalização, escrita de telemetria.
- Event Plane — alarmes e auditoria.
- Agent Orchestration Plane — recomendações de IA com decision ledger.
- Operational Plane — incidentes, despacho, notificação, relatórios.
- Edge Plane — coletor de borda soberano.

## Risks
- Acoplamento indevido entre planos por acesso direto a banco em vez de mensagem (violaria o ADR-0005).
- Documentação de plano desalinhada com a implementação real conforme o código nascer.
- Decomposição em 17 serviços superando a capacidade operacional de uma equipe pequena antes do primeiro cliente pagante (ver `docs/architecture/structural-assessment.md`).

## Status
structure-only

## Not Implemented
Nenhum comportamento de domínio, API, banco de dados, mensageria real ou agente de produção está implementado nesta pasta. Este documento descreve o desenho arquitetural aprovado, não código existente.
