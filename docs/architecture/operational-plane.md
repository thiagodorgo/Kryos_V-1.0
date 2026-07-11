# Operational Plane

## Purpose
Transformar alarme em ação humana coordenada: incidente, despacho técnico, notificação multicanal e relatório de evidência.

## Responsibilities
- Converter alarmes (isolados ou correlacionados) em incidentes com SLA e linha do tempo (incident-service).
- Atribuir incidente a técnico/parceiro com checklist e evidência de encerramento (dispatch-service).
- Cascata de notificação multicanal com escalonamento por prioridade (notification-service).
- Gerar relatórios sob demanda e agendados — HACCP, energia, MKT — em PDF/CSV (reporting-service).

## Components in this plane
- incident-service
- dispatch-service
- notification-service
- reporting-service

## Mensageria (RabbitMQ)
Este plano publica/consome mensagens no exchange `kryos.operational`, conforme `docs/adr/0005-rabbitmq-unified-messaging-backbone.md`.

## Risks
- Notificação sem cadeia de plantão por horário, perdendo alarme crítico fora do expediente.
- Relatório HACCP editável, quebrando o requisito de imutabilidade regulatória.

## Status
structure-only

## Not Implemented
Nenhum comportamento de domínio, API, banco de dados, mensageria real ou agente de produção está implementado nesta pasta. Este documento descreve o desenho arquitetural aprovado, não código existente.
