# Event Plane

## Purpose
Avaliar telemetria normalizada contra regras de alarme e manter a trilha de auditoria imutável de toda ação governada na plataforma.

## Responsibilities
- Motor de regras de alarme: limites, histerese, tempo de permanência, prioridade, escalonamento tipo Guardian (alert-engine).
- Registrar de forma imutável login, mudança de configuração, ACK/inibição de alarme, escrita de parâmetro e decisão de agente (audit-service).

## Components in this plane
- alert-engine
- audit-service

## Mensageria (RabbitMQ)
Este plano publica/consome mensagens no exchange `kryos.event`, conforme `docs/adr/0005-rabbitmq-unified-messaging-backbone.md`.

## Risks
- Fadiga de alarme se regras não suprimirem falso-positivo conhecido (degelo, abertura de porta) na origem do Device Profile.
- Trilha de auditoria mutável ou incompleta comprometendo evidência para cliente/auditor regulatório.

## Status
structure-only

## Not Implemented
Nenhum comportamento de domínio, API, banco de dados, mensageria real ou agente de produção está implementado nesta pasta. Este documento descreve o desenho arquitetural aprovado, não código existente.
