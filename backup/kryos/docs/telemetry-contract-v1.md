# Contrato de Telemetria v1.0 (Kryos)

## Escopo
Este documento define o payload de telemetria normalizada do Kryos (v1.0).
Aplica-se ao Kryos Edge, Backend, Web, Mobile e serviços de IA.

## Objetivo
Padronizar a troca de telemetria normalizada, sem detalhes de protocolo industrial,
com identificação clara de empresa, planta, dispositivo e agente, suportando múltiplas
variáveis por envio e mantendo legibilidade para auditoria.

## Transporte (Contexto Atual)
- **MQTT** é o canal primário entre Edge e Cloud.
- **HTTPS** é utilizado como fallback e para autenticação/provisionamento.
- O contrato permanece **agnóstico ao transporte**; o payload não muda.

## Requisitos atendidos
- Telemetria normalizada (sem detalhes Modbus).
- Associação clara a empresa, planta, dispositivo e agente.
- Suporte a múltiplas variáveis por envio.
- Eficiência para envio contínuo.
- Legibilidade para auditoria e debugging.

## Estrutura do payload

### Campos obrigatórios (top-level)
| Campo | Tipo | Descrição |
| --- | --- | --- |
| version | string | Versão do contrato no formato `v<MAJOR>.<MINOR>` (ex.: `v1.0`). |
| timestamp | string (ISO 8601 UTC) | Data/hora da coleta no Edge. |
| company_id | string | Identificador único da empresa. |
| plant_id | string | Identificador único da planta. |
| device_id | string | Identificador único do dispositivo. |
| agent_id | string | Identificador único do agente Kryos Edge. |
| metrics | array | Lista de medições normalizadas. Mínimo 1 item. |

### Campos obrigatórios (metrics[])
| Campo | Tipo | Descrição |
| --- | --- | --- |
| variable_id | string | Identificador único da variável. |
| name | string | Nome normalizado da variável. |
| value | number | Valor numérico já convertido/normalizado. |
| unit | string | Unidade de medida padronizada. |
| quality | string | Qualidade da leitura (ex.: `good`, `suspect`, `bad`). |
| status | string | Estado operacional da variável (ex.: `ok`, `warning`, `alarm`). |

## Regras de unidades, escala e decimais
- **Origem:** Server XML define a estrutura (endereços, offsets). Device XML define semântica.
- **Escala/decimais:** aplicados no Edge conforme Device XML antes do envio.
- **Unidade:** derivada do Device XML, enviada já normalizada no campo `unit`.
- **Resultado:** o valor em `metrics[].value` é sempre de engenharia, pronto para uso.

## Regras de validação (v1)
- Todos os campos obrigatórios devem existir e ter tipo correto.
- `timestamp` deve ser ISO 8601 UTC (ex.: `2024-03-25T14:32:18Z`).
- `metrics` deve conter ao menos 1 item.
- `value` deve ser numérico finito (sem `NaN`/`Infinity`).

## Regras de rejeição (v1)
- Payload sem `version` ou com versão desconhecida.
- Ausência de `company_id`, `plant_id`, `device_id` ou `agent_id`.
- `metrics` vazio ou ausente.
- Item de `metrics` sem `variable_id` ou `name`.

## Exemplo de payload
```json
{
  "version": "v1.0",
  "timestamp": "2024-03-25T14:32:18Z",
  "company_id": "cmp_001",
  "plant_id": "plt_001",
  "device_id": "PLT01-UTIL-CHILLER-02",
  "agent_id": "edge_001",
  "metrics": [
    {
      "variable_id": "var_001",
      "name": "COND.TEMP",
      "value": 7.2,
      "unit": "C",
      "quality": "good",
      "status": "ok"
    },
    {
      "variable_id": "var_002",
      "name": "EVAP.PRESS",
      "value": 2.1,
      "unit": "bar",
      "quality": "good",
      "status": "ok"
    }
  ]
}
```

## Explicação campo a campo

### version
- Identifica a versão do contrato.
- Deve ser incrementado quando houver mudança compatível ou incompatível no schema.

### timestamp
- Momento da coleta no Edge, em UTC.
- Formato ISO 8601, ex.: `2024-03-25T14:32:18Z`.

### company_id
- Identificador único da empresa proprietária dos dados.

### plant_id
- Identificador único da planta onde o dispositivo está instalado.

### device_id
- Identificador único do dispositivo (padrão de nomes do Kryos).

### agent_id
- Identificador do agente Edge responsável pela normalização e envio.

### metrics[]
- Lista de medições normalizadas do dispositivo no mesmo timestamp.
- Deve conter ao menos um item.

#### metrics[].variable_id
- Identificador único da variável no contexto do sistema.

#### metrics[].name
- Nome normalizado da variável, consistente com a convenção de tags.

#### metrics[].value
- Valor numérico já convertido para unidade de engenharia.

#### metrics[].unit
- Unidade de medida padronizada e explícita.

#### metrics[].quality
- Indicador de qualidade da leitura.
- Valores recomendados: `good`, `suspect`, `bad`.

#### metrics[].status
- Estado operacional derivado ou atribuído pelo Edge.
- Valores recomendados: `ok`, `warning`, `alarm`.

## Regras de compatibilidade futura (v1 -> v2)
- Campos obrigatórios do v1 não podem ser removidos no v2.
- Mudanças incompatíveis exigem incremento de MAJOR (ex.: `v2.0`).
- Novos campos devem ser opcionais por padrão para manter compatibilidade.
- Alterações de significado de um campo existente são consideradas incompatíveis.
- Valores permitidos podem ser estendidos, mas não restringidos sem nova versão MAJOR.

---

# Contrato de Setpoint/Comando v1.0 (Kryos)

## Escopo
Define o payload de comandos de escrita (setpoints) aplicados pelo Edge.
O contrato é agnóstico ao transporte (MQTT/HTTPS), mas o canal primário é MQTT.

## Versão e baseline
- **Versão do contrato:** `v1.0` (baseline congelada para início de implementação).

## Estrutura do payload (top-level)
| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| version | string | sim | Versão do contrato, ex.: `v1.0`. |
| timestamp | string (ISO 8601 UTC) | sim | Momento da emissão do comando. |
| company_id | string | sim | Identificador da empresa. |
| plant_id | string | sim | Identificador da planta. |
| device_id | string | sim | Identificador do dispositivo. |
| agent_id | string | sim | Identificador do Edge destino. |
| command_id | string | sim | Identificador único do comando. |
| variable_id | string | sim | Identificador da variável alvo. |
| name | string | sim | Nome normalizado da variável alvo. |
| value | number | sim | Valor de engenharia a aplicar. |
| unit | string | sim | Unidade de medida esperada. |
| requested_by | string | sim | Identificador do usuário/serviço solicitante. |
| reason | string | não | Motivo/justificativa do comando. |

## Tipos de valor permitidos
- `value` deve ser numérico finito.
- O Edge valida faixa/limites usando o Device XML antes de aplicar.

## Confirmação de aplicação (ACK)
O Edge deve publicar um ACK com o mesmo `command_id`, contendo:
- `status`: `applied` | `rejected` | `failed`
- `timestamp`
- `message` (opcional) com motivo em caso de rejeição/falha.

## Regras de segurança
- Apenas usuários/serviços autenticados e autorizados podem emitir comandos.
- Comandos devem ser rastreáveis por `requested_by`.

## Regras de rejeição
- Versão inválida.
- Campo obrigatório ausente.
- `value` inválido.
- `variable_id` não reconhecido.

## Exemplo de comando válido
```json
{
  "version": "v1.0",
  "timestamp": "2024-03-25T14:40:00Z",
  "company_id": "cmp_001",
  "plant_id": "plt_001",
  "device_id": "PLT01-UTIL-CHILLER-02",
  "agent_id": "edge_001",
  "command_id": "cmd_20240325_001",
  "variable_id": "var_010",
  "name": "SETPOINT.TEMP",
  "value": 6.5,
  "unit": "C",
  "requested_by": "user_123",
  "reason": "Ajuste de operação"
}
```

## Compatibilidade futura (v2+)
- Campos obrigatórios do v1 não podem ser removidos no v2.
- Mudanças incompatíveis exigem incremento de MAJOR.

---

# Contrato de Alarmes v1.0 (Kryos)

## Escopo
Define o payload de eventos de alarme gerados a partir de telemetria persistida.
O contrato é agnóstico ao transporte e orienta integração entre Backend, Web e Mobile.

## Versão e baseline
- **Versão do contrato:** `v1.0` (baseline congelada para início de implementação).

## Estrutura do payload
| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| version | string | sim | Versão do contrato. |
| alarm_id | string | sim | Identificador único do alarme. |
| company_id | string | sim | Identificador da empresa. |
| plant_id | string | sim | Identificador da planta. |
| device_id | string | sim | Identificador do dispositivo. |
| variable_id | string | não | Variável associada, quando aplicável. |
| name | string | sim | Nome do alarme. |
| severity | string | sim | Severidade (`LOW`, `MED`, `HIGH`, `CRIT`). |
| status | string | sim | Estado (`opened`, `acknowledged`, `closed`). |
| raised_at | string (ISO 8601 UTC) | sim | Momento de abertura. |
| acknowledged_at | string (ISO 8601 UTC) | não | Momento de reconhecimento. |
| closed_at | string (ISO 8601 UTC) | não | Momento de fechamento. |
| message | string | não | Descrição curta do evento. |

## Regras de validação e rejeição
- Campos obrigatórios presentes e tipos corretos.
- `severity` deve seguir o conjunto permitido.
- `status` deve seguir o ciclo de vida (`opened` → `acknowledged` → `closed`).
- Rejeitar payloads com timestamps inválidos ou ausentes.

## Exemplo de payload válido
```json
{
  "version": "v1.0",
  "alarm_id": "alm_20240325_001",
  "company_id": "cmp_001",
  "plant_id": "plt_001",
  "device_id": "PLT01-UTIL-CHILLER-02",
  "variable_id": "var_001",
  "name": "COND.TEMP.HIGH",
  "severity": "HIGH",
  "status": "opened",
  "raised_at": "2024-03-25T14:45:00Z",
  "message": "Temperatura acima do limite operacional"
}
```

---

# Contrato de Autenticação v1.0 (Kryos)

## Escopo
Define o payload mínimo para autenticação e sessão de usuário.
O contrato é usado pela API SaaS e pelos clientes Web/Mobile.

## Versão e baseline
- **Versão do contrato:** `v1.0` (baseline congelada para início de implementação).

## Payload de autenticação (request)
| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| email | string | sim | Identificador do usuário. |
| password | string | sim | Credencial do usuário. |

## Payload de autenticação (response)
| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| access_token | string | sim | Token de acesso. |
| token_type | string | sim | Tipo do token (ex.: `Bearer`). |
| expires_in | number | sim | Tempo de expiração em segundos. |
| user_id | string | sim | Identificador do usuário. |
| role | string | sim | Perfil (`cliente`, `supervisor`, `administrador`). |

## Regras de segurança
- Resposta nunca deve expor senha ou hash.
- Token deve ser emitido apenas após autenticação bem-sucedida.

## Exemplo de resposta válida
```json
{
  "access_token": "eyJhbGciOi...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "user_id": "user_123",
  "role": "supervisor"
}
```
