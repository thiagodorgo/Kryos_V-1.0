# Diagrama ER do Banco de Dados Kryos

## Escopo
Este documento define o modelo relacional do banco Kryos, alinhado ao Contrato de Telemetria v1.0
(normalizado, sem semântica Modbus) e à arquitetura Edge + Cloud.

## Versão e baseline
- **Versão do modelo:** `v1.0` (baseline congelada para início de implementação).
- O modelo é **multi-tenant lógico** via `companies` e suas relações.

## Objetivo
Fornecer um diagrama ER e a descrição das entidades mínimas necessárias para suportar multi-tenant,
telemetria contínua, alarmes, usuários e retenção por plano.

## Separação por natureza de dados
- **Configuração:** companies, plants, devices, agents, variables, plans, users.
- **Estado operacional:** alarms.
- **Histórico:** telemetry.

## Retenção (diretrizes v1)
- **telemetry:** sujeito a políticas de retenção por plano (`plans.retention_days`).
- **alarms:** retenção operacional definida por política de negócio (fora do escopo físico do modelo).
- **configuração:** retenção permanente (dados de referência).

## O que NÃO entra no banco (limites v1)
- Dados brutos de protocolo (registradores Modbus, frames BACnet).
- Estados transitórios de buffer offline do Edge.
- Logs internos de drivers industriais.

## Diagrama ER (ASCII)
```
companies (1) ────< plants (N)
companies (1) ────< users (N)
companies (1) ────< plans (1)

plants (1) ────< devices (N)
plants (1) ────< agents (N)

devices (1) ────< variables (N)
variables (1) ────< telemetry (N)

devices (1) ────< alarms (N)
```

## Entidades e campos

## Campos obrigatórios vs derivados (v1)
- **Obrigatórios:** chaves primárias, chaves estrangeiras e campos de identificação (ids, nomes, status, timestamps).
- **Derivados:** nenhum campo derivado é persistido no modelo v1; derivados devem ser calculados por serviços de aplicação.

### companies
- **PK:** `company_id`
- **Campos:**
  - `company_id` (string)
  - `name` (string)
  - `status` (string)
  - `created_at` (datetime)

### plants
- **PK:** `plant_id`
- **FKs:** `company_id` -> companies.company_id
- **Campos:**
  - `plant_id` (string)
  - `company_id` (string)
  - `name` (string)
  - `timezone` (string)
  - `status` (string)
  - `created_at` (datetime)

### devices
- **PK:** `device_id`
- **FKs:** `plant_id` -> plants.plant_id
- **Campos:**
  - `device_id` (string)
  - `plant_id` (string)
  - `name` (string)
  - `type` (string)
  - `status` (string)
  - `created_at` (datetime)

### agents
- **PK:** `agent_id`
- **FKs:** `plant_id` -> plants.plant_id
- **Campos:**
  - `agent_id` (string)
  - `plant_id` (string)
  - `name` (string)
  - `version` (string)
  - `status` (string)
  - `created_at` (datetime)

### variables
- **PK:** `variable_id`
- **FKs:** `device_id` -> devices.device_id
- **Campos:**
  - `variable_id` (string)
  - `device_id` (string)
  - `name` (string)
  - `unit` (string)
  - `data_type` (string)
  - `status` (string)
  - `created_at` (datetime)

### telemetry
- **PK:** `telemetry_id`
- **FKs:** `variable_id` -> variables.variable_id
- **Campos:**
  - `telemetry_id` (string)
  - `variable_id` (string)
  - `timestamp` (datetime)
  - `value` (number)
  - `quality` (string)
  - `status` (string)
  - `created_at` (datetime)

### alarms
- **PK:** `alarm_id`
- **FKs:** `device_id` -> devices.device_id
- **Campos:**
  - `alarm_id` (string)
  - `device_id` (string)
  - `name` (string)
  - `severity` (string)
  - `status` (string)
  - `raised_at` (datetime)
  - `acknowledged_at` (datetime, nullable)

### users
- **PK:** `user_id`
- **FKs:** `company_id` -> companies.company_id
- **Campos:**
  - `user_id` (string)
  - `company_id` (string)
  - `name` (string)
  - `email` (string)
  - `role` (string)
  - `status` (string)
  - `created_at` (datetime)

### plans
- **PK:** `plan_id`
- **FKs:** `company_id` -> companies.company_id
- **Campos:**
  - `plan_id` (string)
  - `company_id` (string)
  - `retention_days` (number)
  - `telemetry_quota` (number)
  - `status` (string)
  - `created_at` (datetime)

## Justificativas de modelagem
- **Multi-tenant:** todas as entidades operacionais se ligam a `companies` direta ou indiretamente,
  garantindo isolamento por empresa.
- **Telemetria alinhada ao contrato:** `telemetry` armazena valores normalizados por `variable_id`,
  preservando `timestamp`, `quality` e `status` conforme o payload v1.0.
- **Desacoplamento de protocolo:** nenhuma entidade contém campos de Modbus ou protocolo industrial.
- **Retenção por plano:** a entidade `plans` permite aplicar políticas de retenção e quotas por empresa.
- **Preparado para particionamento:** `telemetry` concentra alto volume e inclui `timestamp`,
  viabilizando particionamento por tempo e retenção eficiente.
- **Alarmes por dispositivo:** `alarms` se relaciona a `devices` para refletir eventos e severidade
  no contexto operacional.
