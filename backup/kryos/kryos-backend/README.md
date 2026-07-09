# Kryos Backend

## Visão Geral
API SaaS responsável pela gestão centralizada dos dados, usuários e regras de negócio de alto nível do ecossistema Kryos. Desenvolvido em Python (FastAPI), hospedado na EC2 junto ao MQTT Broker e MySQL na fase 1.

## Arquitetura e Restrições
Este sistema é **agnóstico ao protocolo industrial**.

- **PROIBIDO:** Implementar bibliotecas Modbus (pymodbus, etc) neste repositório.
- **PROIBIDO:** Tentar interpretar arquivos XML de dispositivos (Carel, pCO, etc). Essa lógica pertence ao Edge.
- **PERMITIDO:** Receber payload JSON padronizado, validar schema e persistir.

## Funcionalidades Principais
1. **APIs SaaS:** Autenticação, provisionamento e rotas administrativas para Web/Mobile.
2. **Multi-tenancy:** Segregação de dados por Cliente/Planta.
3. **Retenção de Dados:** Gestão do ciclo de vida dos dados (Hot/Warm/Cold storage).
4. **API Gateway:** Servir dados para Kryos Web e Kryos Mobile.

> **Nota:** A ingestão primária de telemetria ocorre via MQTT Broker na Cloud. O caminho exato de ingestão para persistência é **[DECISÃO ADIADA – DEPENDE DE IMPLEMENTAÇÃO]**.
