# Data Plane

## Purpose
Receber telemetria bruta do edge-collector, normalizá-la para grandeza de engenharia via Device Profile, e persistir em série temporal (QuestDB) e hot state (Redis) para leitura em tempo real.

## Responsibilities
- Autenticar e receber lotes de telemetria do coletor de borda (ingestion-gateway).
- Normalizar registrador cru em valor de engenharia preservando o valor cru para auditoria (telemetry-normalizer).
- Escrever série temporal particionada por tenant+tempo e atualizar o hot state consultado pelo dashboard (telemetry-writer).
- Manter a distinção REAL_TIME × HISTORY herdada do motor C++ de referência, inclusive na topologia de filas RabbitMQ (ver ADR-0005).

## Components in this plane
- ingestion-gateway
- telemetry-normalizer
- telemetry-writer

## Mensageria (RabbitMQ)
Este plano publica/consome mensagens no exchange `kryos.data`, conforme `docs/adr/0005-rabbitmq-unified-messaging-backbone.md`.

## Risks
- Hot path (últimos valores) sendo servido da série temporal em vez do Redis, quebrando a meta de latência p95 ≤ 300ms.
- Perda de qualidade de dado se o valor cru não for preservado ao lado do valor normalizado.

## Status
structure-only

## Not Implemented
Nenhum comportamento de domínio, API, banco de dados, mensageria real ou agente de produção está implementado nesta pasta. Este documento descreve o desenho arquitetural aprovado, não código existente.
