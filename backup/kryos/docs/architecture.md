# Arquitetura do Sistema Kryos

## Visão Macro
O sistema opera em uma arquitetura Hub-and-Spoke distribuída, onde a inteligência de protocolo reside na ponta (Edge) e a inteligência de negócio e armazenamento reside na nuvem (Cloud).

## Componentes

### 1. Kryos Edge (On-Premise)
- **Local:** Fábrica / Planta do Cliente.
- **Função:** Gateway SCADA e Agente de Telemetria.
- **Conectividade:** Modbus/BACnet/IO local; MQTT como canal principal; HTTPS como fallback.
- **Persistência:** Buffer local (SQLite) para operação offline (Store-and-Forward).
- **Acesso remoto:** VPN apenas para manutenção.

### 2. Kryos Backend (Cloud)
- **Local:** AWS / Nuvem Privada (EC2 única na fase 1).
- **Função:** API SaaS, Gestão de Tenants, autenticação e endpoints administrativos.
- **Restrição:** NÃO possui drivers industriais. NÃO acessa IPs locais de fábrica.

### 2.1 Serviços co-localizados na EC2 (Fase 1)
- **MQTT Broker:** canal principal de telemetria e setpoints.
- **MySQL:** persistência principal.
- **Frontend Web:** servido a partir da mesma instância.

### 3. Interfaces (Web & Mobile)
- Consumidores da API do Backend.
- Visualização de dados já processados e normalizados.
