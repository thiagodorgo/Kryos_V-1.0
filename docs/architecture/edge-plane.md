# Edge Plane

## Purpose
Adquirir dados de controladores de refrigeração via Modbus na borda, de forma soberana (funciona offline), com fila de prioridade REAL_TIME/HISTORY e buffer local resiliente.

## Responsibilities
- Adquirir telemetria multi-marca (Full Gauge, Carel, Danfoss, Coel, Novus, Evco) via Modbus RTU/TCP.
- Classificar cada variável em REAL_TIME ou HISTORY e processar por fila de prioridade (herança direta do motor C++ de referência em `backup/`).
- Manter buffer local persistente (store-and-forward) durante perda de conectividade, sem perda e sem duplicação.
- Executar comando de escrita apenas quando recebido pelo canal governado `kryos.edge`, nunca por iniciativa própria.

## Components in this plane
- edge-collector

## Mensageria (RabbitMQ)
Este plano publica/consome mensagens no exchange `kryos.edge`, conforme `docs/adr/0005-rabbitmq-unified-messaging-backbone.md`.

## Risks
- Decisão de linguagem (preservar núcleo C++ vs. reescrever em Java) ainda pendente de ADR formal — ver `docs/architecture/structural-assessment.md`.
- Buffer local subdimensionado para o cenário real de queda de conectividade em campo (meta atual: 72h).

## Status
structure-only

## Not Implemented
Nenhum comportamento de domínio, API, banco de dados, mensageria real ou agente de produção está implementado nesta pasta. Este documento descreve o desenho arquitetural aprovado, não código existente.
