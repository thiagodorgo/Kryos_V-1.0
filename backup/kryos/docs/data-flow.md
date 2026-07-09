# Diagrama de Fluxo de Dados (Kryos)

## Escopo
Este documento descreve o fluxo de dados do Kryos, do Edge até a Cloud e consumidores finais,
com responsabilidades claras e alinhadas à arquitetura Edge soberano.

## Fluxo de dados (visão geral)
1. PLCs/Devices expõem dados via Modbus/BACnet/IO.
2. Kryos Edge realiza leitura, parsing XML, normalização e buffer offline.
3. Kryos Edge envia telemetria normalizada via **MQTT (principal)** para o broker na Cloud.
4. Kryos Edge utiliza **HTTPS (fallback)** para autenticação, provisionamento e APIs administrativas.
5. Kryos Cloud persiste telemetria em MySQL.
6. Motor de Alarmes consome telemetria persistida para gerar eventos.
7. Serviço de IA consome telemetria e alarmes para análises e diagnósticos.
8. Frontend Web e Aplicativo Mobile consomem dados via Kryos Cloud.
9. Setpoints/Comandos são publicados pela Cloud no broker MQTT e aplicados no Edge.

## Fronteiras de responsabilidade
- **PLCs/Devices:** origem dos dados brutos (Modbus).
- **Kryos Edge:** aquisição, parsing, normalização, buffer offline e envio seguro.
- **MQTT Broker (Cloud):** canal principal de telemetria e setpoints.
- **API Gateway / Cloud:** autenticação, provisionamento e APIs administrativas.
- **Persistência:** armazenamento, retenção e consulta de telemetria.
- **Motor de Alarmes:** geração e histórico de eventos.
- **IA:** análise de telemetria e alarmes.
- **Web/Mobile:** visualização e operação do usuário final.

## Diagrama (Mermaid)
```mermaid
flowchart LR
    plc[PLCs / Devices\n(Modbus/BACnet/IO)] --> edge[Kryos Edge\nLeitura\nParser XML\nNormalizacao\nBuffer Offline]
    edge --> broker[MQTT Broker]
    edge --> gateway[HTTPS (fallback)\nAuth/Provisionamento/Admin]
    broker --> cloud[Kryos Cloud (FastAPI)]
    cloud --> broker
    cloud --> db[(Persistencia\nMySQL / RDS)]
    db --> alarms[Motor de Alarmes]
    db --> ia[Servico de IA]
    cloud --> web[Frontend Web]
    cloud --> mobile[Aplicativo Mobile]

    subgraph Edge
        edge
    end

    subgraph Cloud
        gateway
        broker
        cloud
        db
        alarms
        ia
        web
        mobile
    end
```

## Instruções de visualização
- Cole o bloco Mermaid acima em https://mermaid.live.
- Use a opção de exportação para SVG no próprio editor.
