# Projeto KRYOS - Industrial IoT SaaS

Este é o repositório monorepo (ou workspace) que organiza os componentes do produto Kryos.

## Estrutura do Ecossistema

| Componente | Função | Tecnologia |
|------------|--------|------------|
| **kryos-edge** | Coleta, Normalização e Buffer (Chão de Fábrica) | Python / C++ |
| **kryos-backend** | API, Banco de Dados e Regras de Negócio (SaaS) | Python (FastAPI) |
| **kryos-web** | Dashboard Operacional | React |
| **kryos-mobile** | App de Manutenção | Android (Kotlin/Flutter) |

## Direcionamento Arquitetural Atual
- **Edge (Cliente):** Raspberry Pi 3B com leitura industrial local, normalização e buffer offline.
- **Cloud (AWS EC2):** Hospeda Backend, Frontend Web, MQTT Broker e MySQL.
- **Comunicação:** MQTT como canal principal Edge ↔ Cloud, com HTTPS de fallback para autenticação e APIs administrativas.
- **VPN:** Apenas para manutenção remota do Edge.

## Documentação Oficial
Consulte a pasta `/docs` para detalhes de arquitetura.
- Leitura obrigatória: `/docs/xml-strategy.md` (Entendimento do modelo de dados industrial).
