DIRETRIZ DE REFATORAÇÃO ARQUITETURAL (EDGE TO CLOUD VIA MQTT)

Engenheiro,
Nossa arquitetura de envio de dados será evoluída para um modelo **Zero-Trust**, **assíncrono** e orientado a eventos com **MQTT**, com os objetivos de:
- eliminar acoplamento e sobrecarga de estado no backend síncrono;
- encerrar conexões inbound na rede industrial;
- aumentar resiliência operacional em cenários de perda de rede/energia.

Reescreva o módulo de consumo de fila (`QueueManager`) e o fluxo de envio de dados em C++ (Sprint 1) para atender às diretrizes abaixo.

---

## 1. Integração de Cliente MQTT
- Integrar biblioteca MQTT padrão de mercado em C/C++ (preferência: **libmosquitto**).
- A **thread consumidora** que lê a `std::priority_queue` não deve mais enviar dados por socket/FastAPI.
- Ela deve atuar como **publicadora MQTT** via um módulo dedicado (`MqttPublisher`).

### Critérios de aceite
- `QueueManager` injeta e utiliza `MqttPublisher`.
- O envio ocorre por `publish()` MQTT com QoS definido.

---

## 2. Encapsulamento e Convenção de Tópicos
- Converter `DTO_Telemetry` (lido do Modbus) para payload JSON plano.
- Publicar seguindo hierarquia:
  - `kryos/v1/{plant_id}/{device_code}`
- A chave do JSON deve ser a métrica (exemplo):
  - `{"temperatura": 25.4}`

### Critérios de aceite
- `device_code` deve existir em `DTO_Telemetry` e estar populado.
- Payload deve ser JSON válido com escape correto para chaves/strings.

---

## 3. Segurança Obrigatória (mTLS + TLS 1.2+)
- Conectar no broker cloud via porta **8883** (parametrizável, com default 8883).
- Exigir autenticação mútua TLS com:
  - CA (`ca.crt`),
  - certificado do cliente (`pymodbus.crt`),
  - chave privada (`pymodbus.key`).
- Caminhos de certificados devem ser parametrizados.
- Falha de configuração TLS deve impedir operação (fail-fast).

### Critérios de aceite
- Cliente só inicia publicação se TLS estiver válido.
- Versão mínima TLS 1.2 configurada explicitamente.
- Verificação de certificado/hostname ativa.

---

## 4. Resiliência de Estado (LWT)
- Configurar Last Will and Testament (LWT) no cliente MQTT.
- Em queda abrupta (rede/energia), broker publica automaticamente:
  - tópico sugerido: `kryos/v1/{plant_id}/{device_code}/status`
  - payload: `{"status":"offline"}`
- Ao conectar com sucesso (`on_connect`), publicar `{"status":"online"}` no mesmo tópico.

### Critérios de aceite
- LWT registrado antes da conexão.
- Mensagem `online` somente após confirmação de conexão.

---

## 5. Entregáveis
1. `include/MqttPublisher.hpp` (novo)
2. `src/MqttPublisher.cpp` (novo)
3. `include/QueueManager.hpp` (atualizado)
4. `src/QueueManager.cpp` (atualizado)
5. `CMakeLists.txt` (atualizado para dependência MQTT)

---

## 6. Sugestão de Implementação (padrão de engenharia)

### 6.1 CMakeLists.txt
- Usar `PkgConfig` para `libmosquitto`.
- Preferir `target_include_directories`/`target_link_libraries` por alvo, evitando `include_directories` global.

### 6.2 MqttPublisher
Responsabilidades mínimas:
- inicialização/finalização segura da biblioteca MQTT;
- configuração TLS/mTLS;
- configuração LWT;
- conexão assíncrona e loop de rede;
- publicação de telemetria;
- logs estruturados.

### 6.3 QueueManager
- manter produtor Modbus como está;
- consumidor apenas retira da fila e publica via `MqttPublisher`;
- preservar drenagem de fila no shutdown;
- tratar indisponibilidade do broker com política de retry/backoff.

---

## 7. Riscos Técnicos e Recomendações
1. **Não publicar `online` logo após `connect_async`**
   - publicar somente em callback de conexão bem-sucedida.
2. **Evitar JSON por concatenação manual**
   - usar serializador para garantir escape correto.
3. **Definir política de reconexão**
   - retry exponencial com jitter para evitar tempestade de reconexão.
4. **Definir comportamento offline**
   - fila local com limite, descarte controlado ou persistência em disco.
5. **Padronizar status topic**
   - evitar ambiguidade “tabela vs tópico”; persistência em banco deve ocorrer no backend cloud.

---

## 8. Justificativa Arquitetural
A transição para MQTT com mTLS e LWT atende diretamente aos princípios de isolamento Zero-Trust no edge:
- reduz exposição da rede industrial (somente tráfego outbound);
- desacopla aquisição local do backend cloud;
- melhora tolerância a falhas transitórias e quedas abruptas;
- habilita escalabilidade horizontal do backend consumidor.

