# Estratégia de XMLs e Abstração de Hardware

## 1. Visão Geral
O ecossistema Kryos utiliza uma estratégia de dupla camada de XML para garantir a dissociação entre a infraestrutura de comunicação (Modbus) e a semântica de negócio (Variáveis industriais).

## 2. Hierarquia de Autoridade

### Camada 1: Server Modbus XML (A Fonte da Verdade Estrutural)
Este arquivo (ex: `panifresh-server-modbus.xml`) representa a configuração física do servidor Modbus.

**Responsabilidades:**
- Definir endereços de memória (Offsets).
- Definir Function Codes (Read Input, Read Holding, etc.).
- Mapear a existência física dos registradores.

**Regra Absoluta:**
Se uma variável não consta neste XML, ela NÃO existe para o sistema de comunicação. O driver Modbus obedece exclusivamente a este arquivo.

### Camada 2: Device XML (A Camada Semântica)
Estes arquivos (ex: `carel-pco.xml`, `danfoss-skid.xml`) representam o modelo de conhecimento do dispositivo.

**Responsabilidades:**
- Aplicar fatores de escala (ex: dividir por 10 para obter decimais).
- Definir unidades de medida (ºC, Bar, %, Hz).
- Mapear valores numéricos para estados de texto (Enumerações).
- Definir limites operacionais (Ranges de Alarme).
- Fornecer labels amigáveis para a interface humana.

**Regra Absoluta:**
O XML do Device NUNCA redefine um endereço Modbus. Ele apenas interpreta o valor bruto extraído pelo Server XML.

## 3. Fluxo de Processamento (Edge Only)

1. **Leitura:** O Agente Edge lê o registrador `40001` porque o `Server XML` mandou.
2. **Valor Bruto:** Obtém-se o inteiro `245`.
3. **Associação:** O Agente consulta o `Device XML` associado.
4. **Transformação:** O Device XML diz que este campo é "Temperatura de Retorno", escala `0.1`, unidade `ºC`.
5. **Valor Normalizado:** O dado torna-se `{ "value": 24.5, "unit": "ºC", "label": "Temperatura de Retorno" }`.
6. **Transmissão:** Apenas o dado normalizado é enviado ao Backend.

## 4. Manutenção e Evolução
Esta separação permite que troquemos o hardware (alterando o Server XML) sem perder a inteligência do dispositivo (mantendo o Device XML), ou vice-versa.