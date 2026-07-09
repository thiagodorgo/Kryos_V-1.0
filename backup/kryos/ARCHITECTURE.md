# Arquitetura Geral — Kryos

## Visão Macro
Kryos é composto por três produtos integrados:

1. Kryos Edge (SCADA + Gateway)
2. Kryos Cloud (SaaS)
3. Kryos Mobile (Android)

Na fase 1, o Kryos Cloud roda em uma **EC2 única**, hospedando Backend, Frontend Web, MQTT Broker e MySQL.

## Fluxo de Dados
PLCs → Kryos Edge → MQTT (principal) / HTTPS (fallback) → Kryos Cloud → Web / Mobile / IA

## Princípios Arquiteturais
- Edge é soberano
- Cloud é observador
- IA é assistiva
- Comunicação segura e stateless (MQTT/HTTPS)

## Restrições
- AWS Free Tier
- MySQL
- VPN apenas para manutenção (não para dados)
