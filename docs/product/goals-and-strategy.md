# Kryos — Metas e Estratégia

**Versão:** 1.0 · **Data:** 10/07/2026 · **Estágio do repo:** structure-only
**Base:** cruza `kryos-v1-requisitos.md`, `metodologia-tecnica-10-saas-refrigeracao.md`, `frontend-product-requirements.md`, `docs/adr/0005-rabbitmq-unified-messaging-backbone.md` e o estado real do repositório auditado nesta data.

---

## 1. Onde o Kryos está agora (fato, não aspiração)

17 microsserviços, 6 planos, 10 bibliotecas compartilhadas, 2 apps, edge-collector, infraestrutura declarada (Postgres, RabbitMQ, Redis, QuestDB, ClickHouse planejado) — tudo em **estágio structure-only**. Nenhuma linha de código de domínio existe. O que existe é: governança madura (workflow plan→simulate→implement→test→review→approve), ~95 requisitos funcionais/não funcionais rastreados a evidência de mercado, um sistema de design com tokens medidos, uma decisão de mensageria formalizada (ADR-0005), e uma memória de dois projetos-base (o motor C++ de aquisição, o protótipo FastAPI+React) que já provaram partes do domínio na prática.

Isso não é fraqueza — é a fundação mais cara de construir bem (arquitetura e requisitos) já paga. A fraqueza real é o hiato entre a qualidade dessa fundação e o fato de que, hoje, o Kryos não roda uma única linha de telemetria real.

---

## 2. Metas

### 2.1 Meta de curto prazo (0–3 meses): Provar o fluxo canônico ponta a ponta
Um dispositivo Modbus real → edge-collector → RabbitMQ (`kryos.data`) → telemetry-normalizer → telemetry-writer (QuestDB+Redis) → dashboard com um cartão de valor atual atualizando por WebSocket. Sem alarme, sem billing, sem IA — só o esqueleto funcionando de verdade, um tenant, um site, um dispositivo. **Critério de sucesso:** dado real de um controlador de refrigeração (mesmo que de bancada) visível no navegador em menos de 5 segundos de latência, sobrevivendo a uma queda de rede de 5 minutos sem perda.

### 2.2 Meta de médio prazo (3–9 meses): MVP vendável (paridade P0)
Todo requisito marcado P0 no `kryos-v1-requisitos.md` funcionando: multi-marca (Full Gauge, Carel, mínimo 2 marcas reais testadas), alarmes com prioridade e notificação multicanal, multi-tenant com RBAC e 2FA, relatórios PDF, retenção por plano, billing básico. **Critério de sucesso:** um cliente real (não piloto interno) pagando pelo Kryos e substituindo — ou complementando — um Sitrad/boss existente em pelo menos uma loja.

### 2.3 Meta de longo prazo (9–18 meses): O diferencial de Nível 6
Policy-engine com escrita governada (recomendação→validação→execução→aprovação) e decision ledger auditável, health score preditivo alimentado pelos sinais já mapeados (tempo de recuperação de degelo, corrente de compressor), e MKT para clientes regulados. Esta é a tese competitiva registrada na metodologia: ninguém no mercado estudado fechou o Nível 6 completo — é a posição defensável do Kryos, não apenas mais um SaaS de monitoramento.

### 2.4 Metas de plataforma (contínuas, não sequenciais)
- **Zero risco de IP não tratado**: a pasta `backup/kryos/WebApp` (código Carel) precisa sair da exposição pública antes de qualquer meta comercial avançar — é bloqueador de risco, não item de roadmap.
- **Documentação nunca à frente nem atrás do código**: todo módulo com README/module.yaml refletindo o estágio real, sempre.
- **Nenhum requisito sem rastreabilidade**: todo RF/RNF aponta a uma fonte (mercado, backup, decisão de arquitetura) — já é prática estabelecida, deve continuar.

---

## 3. Estratégia

### 3.1 Estratégia técnica: estrutura antes de músculo, mas com prazo
A governança structure-only é correta e deve continuar — mas tem um risco conhecido: arquitetura perfeita sem código é indistinguível de procrastinação depois de um certo ponto. A estratégia é **sequenciar a saída do structure-only por fatia vertical fina** (a meta 2.1), não por plano horizontal completo. Não se implementa "o Data Plane inteiro" antes de provar o fluxo; implementa-se o caminho mínimo de um dado atravessando os 6 planos, depois se engorda.

### 3.2 Estratégia de mensageria: RabbitMQ como ativo de integração, não só transporte
A decisão do ADR-0005 (RabbitMQ para todo fluxo assíncrono interno) é também uma jogada estratégica de integração: como o edge-collector herda o motor C++ com fila de prioridade REAL_TIME/HISTORY, e essa mesma distinção foi replicada nas filas do RabbitMQ (filas separadas, não priority queue nativa), a plataforma carrega essa lição de domínio da borda até a nuvem de forma consistente — é um diferencial técnico real, não só uma escolha de infraestrutura.

### 3.3 Estratégia de produto: paridade P0 rápida, diferencial P1/P2 defensável
Cruzando com a matriz de funcionalidades do benchmark: dashboard tempo real, multi-site, alarmes, notificação multicanal e multi-tenancy são preço de entrada — todo concorrente tem. Não se ganha mercado nisso, perde-se mercado por não ter. O investimento de diferenciação (policy-engine, decision ledger, health score, MKT, consulta em linguagem natural) só compensa depois que a paridade existe — daí a meta de médio prazo vir antes da de longo prazo.

### 3.4 Estratégia comercial: canal antes de venda direta
O modelo recomendado na metodologia (MaaS híbrido + por-dispositivo com desconto de volume, POC gratuito permanente, marca branca como tier comercial) foi desenhado pensando no mercado brasileiro de integradores (Refrisat, Centrivac, SmartMonit) revendendo o Kryos como plataforma própria — não só venda direta a lojistas. Marca branca não é feature de conveniência, é a estratégia de distribuição.

### 3.5 Estratégia de risco: tratar exposição de IP como P0 de segurança, não de produto
A pasta WebApp pública é o risco mais alto e mais barato de resolver de todo o projeto. Estratégia: resolver em paralelo a qualquer trabalho de produto, não como item competindo por prioridade no roadmap.

### 3.6 Estratégia de execução automatizada
O workflow `plan → simulate → implement → test → security review → critical review → human approval → release` já está desenhado nos `.claude/skills` e nos agentes de board/domain/engineering. A estratégia de execução automatizada é: **todo agente que hoje é um template genérico precisa virar uma especificação real antes de ser confiável para automação** — um agente com "Responsibilities: Future service-specific domain responsibilities" não consegue tomar decisão nenhuma sozinho. Este documento e a rodada de trabalho que o acompanha são o começo dessa virada; ela precisa continuar sistematicamente, agente por agente, antes que "execução automatizada de produção" deixe de ser aspiração.

---

## 4. Sequenciamento recomendado (o que vem depois deste documento)

1. Resolver a exposição da pasta WebApp (ação de Thiago, fora do escopo de código).
2. Completar a virada de templates genéricos para especificações reais em todo o repo (agentes, READMEs de shared/infra/specs, os 9 docs de arquitetura por plano) — parcialmente executada nesta mesma rodada.
3. Formalizar os contratos de `specs/events` a partir da base 1 (telemetria, setpoint/ACK, alarme, autenticação), seguindo a convenção do ADR-0005.
4. Implementar a fatia vertical fina da meta 2.1 — o primeiro código de domínio do projeto.
5. Expandir por fatia até fechar a paridade P0 (meta 2.2).
6. Investir no diferencial de Nível 6 (meta 2.3).
