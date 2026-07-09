# Kryos Edge

## Visão Geral
O componente **Kryos Edge** é o responsável pela interação física com o chão de fábrica. Ele atua como um gateway SCADA leve, executado em **Raspberry Pi 3B**, realizando a leitura de protocolos industriais e a normalização de dados antes do envio para a nuvem.

## Responsabilidades
1. **Leitura Industrial:** Executar pollings cíclicos (Modbus/BACnet/IO) baseados estritamente no `Server XML`.
2. **Interpretação Semântica:** Aplicar as regras de negócio definidas nos `Device XMLs`.
3. **Buffering:** Garantir zero perda de dados. Se a internet cair, os dados são armazenados localmente e enviados quando a conexão retornar.
4. **Envio de Telemetria:** MQTT como canal principal; HTTPS apenas como fallback.
5. **Setpoints/Comandos:** Receber comandos via MQTT e aplicar localmente.
6. **Segurança:** Iniciar conexões outbound para a nuvem (evitando portas abertas na fábrica). VPN apenas para manutenção.

## Estrutura de Pastas
- `/src/drivers`: Implementações de Modbus TCP/RTU.
- `/src/parsers`: Lógica de leitura e merge dos XMLs (Server + Device).
- `/src/buffer`: Gerenciamento de fila offline.
- `/config`: Arquivos XML de mapeamento.

## Regras Técnicas
- **NÃO** hardcodar endereços Modbus no código.
- **NÃO** enviar dados brutos para o backend. O Edge envia JSON normalizado.
- **NÃO** bloquear a thread principal durante leituras de I/O.

## O que o Edge FAZ (v1)
- Leitura industrial local (Modbus/BACnet/IO) baseada em Server XML.
- Normalização semântica via Device XML.
- Buffer offline e envio de telemetria (MQTT primário, HTTPS fallback).
- Aplicação de setpoints recebidos via MQTT.

## O que o Edge NÃO FAZ (v1)
- Não depende da Cloud para controle básico.
- Não expõe portas para a internet.
- Não executa lógica de negócio do backend.

## MVP Técnico (Fase 2)
Este MVP publica telemetria sintética e recebe comandos via MQTT.

### Executar localmente
1. Configure as variáveis de ambiente (MQTT e IDs).
2. Instale dependências: `pip install -r requirements.txt`
3. Inicie o agente: `python -m src.edge_agent`
