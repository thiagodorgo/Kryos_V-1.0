# 🧭 ROADMAP OFICIAL – PROJETO KRYOS

**Princípio-mestre:**  
❝ Organização vem antes de velocidade.  
Um SCADA mal organizado vira dívida técnica permanente. ❞

---

## 📍 Status Atual (para alinhamento)
- **Fase 0 (Governança & Organização):** concluída conforme checklists abaixo.
- **Fase 1 (Modelo de Dados & Contratos):** documentos base já definidos neste repositório; itens ainda marcados como pendentes neste roadmap devem ser tratados como **em evolução**.
- **Fases 2+ (Edge/Backend/Web/Mobile/IA/SaaS):** permanecem planejadas, sem implementação confirmada neste repositório.

---

## 🔰 FASE 0 — GOVERNANÇA & ORGANIZAÇÃO (OBRIGATÓRIA)

🎯 **Objetivo:**  
Criar base sólida antes de escrever mais código.

### Entregáveis
- [x] 📁 Repositórios separados:
  - [x] kryos-edge
  - [x] kryos-backend
  - [x] kryos-web
  - [x] kryos-mobile
- [x] 📄 Documento Visão do Produto
- [x] 📄 Documento Arquitetura Geral
- [x] 📄 Glossário industrial (planta, device, variável, alarme, ciclo)

### Decisões-chave
- [x] Padrão de versionamento
- [x] Convenção de commits
- [x] Convenção de nomes (devices, tags, alarmes)
- [x] Estrutura de pastas padrão

📌 **Regra:**  
✅ Não escrever código funcional antes desta fase estar clara.

---

## 🧱 FASE 1 — MODELO DE DADOS & CONTRATOS (FUNDAÇÃO)

🎯 **Objetivo:**  
Definir o “idioma” do sistema.

### Entregáveis
- [x] 📐 Diagrama ER (banco)
- [x] 📐 Diagrama de fluxo de dados
- [x] 📄 Contrato de Telemetria (JSON)
- [x] 📄 Contrato de Setpoint/Comando (JSON)
- [x] 📄 Contrato de Alarmes
- [x] 📄 Contrato de Autenticação

### Exemplo de pergunta que esta fase resolve
“O que exatamente é um device no Kryos?”

📌 **Regra:**  
Banco e payload não mudam depois, só evoluem versionados.

---

## ⚙️ FASE 2 — KRYOS EDGE (AGENTE + SCADA LOCAL)

🎯 **Objetivo:**  
Tornar o Edge o núcleo industrial confiável.

### Subfases

#### 2.1 — Agente Kryos (Core)
- [ ] Leitura Modbus TCP/RTU
- [ ] Parser de XML Modbus (Carel / SKID)
- [ ] Normalização de dados
- [ ] Buffer offline
- [ ] Envio MQTT (primário) com fallback HTTPS autenticado

#### 2.2 — SCADA Local
- [ ] Dashboard local
- [ ] Status de dispositivos
- [ ] Visualização em tempo real
- [ ] Operação offline

### Entregáveis
- [ ] Código documentado
- [x] README técnico do Edge
- [ ] Diagrama Edge ↔ PLCs
- [ ] Logs estruturados

📌 **Regra:**  
Se o Edge falhar, o produto falha.

---

## ☁️ FASE 3 — BACKEND CLOUD (FASTAPI)

🎯 **Objetivo:**  
Tornar a nuvem estável, previsível e barata.

### Subfases

#### 3.1 — API Core
- [ ] /auth
- [ ] /telemetry
- [ ] /devices
- [ ] /plants

#### 3.2 — Persistência
- [ ] Ingestão de telemetria
- [ ] Particionamento
- [ ] Retenção por plano

#### 3.3 — Alarmes
- [ ] Motor de regras
- [ ] Severidade
- [ ] Histórico

### Entregáveis
- [ ] OpenAPI bem documentado
- [ ] Models Pydantic
- [ ] Services separados
- [ ] Diagrama Backend

📌 **Regra:**  
Backend não lê Modbus. Nunca.

---

## 🌐 FASE 4 — FRONTEND WEB (DASHBOARD PROFISSIONAL)

🎯 **Objetivo:**  
Transformar dados em informação clara.

### Subfases / Funcionalidades
- [ ] Grid de telemetria (CSS Grid)
- [ ] Cards padronizados
- [ ] Alarmes visuais
- [ ] Histórico navegável
- [ ] Mobile-first

### Entregáveis
- [ ] Design system simples
- [ ] Componentes reutilizáveis
- [ ] Dashboard limpo e legível
- [ ] Documentação de UI

📌 **Regra:**  
SCADA bom é claro, não “bonito demais”.

---

## 🤖 FASE 5 — IA INDUSTRIAL (OPENAI)

🎯 **Objetivo:**  
Agregar valor real, não hype.

### Funcionalidades
- [ ] Análise de alarmes
- [ ] Diagnóstico de causa raiz
- [ ] Texto técnico objetivo
- [ ] Histórico de análises

### Entregáveis
- [ ] Prompt versionado
- [ ] Serviço isolado de IA
- [ ] Logs e auditoria

📌 **Regra:**  
IA explica, não decide.

---

## 📱 FASE 6 — KRYOS MOBILE (ANDROID)

🎯 **Objetivo:**  
Suporte ao técnico de campo.

### Funcionalidades
- [ ] Visualização rápida
- [ ] Alarmes
- [ ] Diagnóstico
- [ ] Modo leitura

### Entregáveis
- [ ] App leve
- [ ] UI objetiva
- [ ] Integração segura

📌 **Regra:**  
Mobile não substitui SCADA, complementa.

---

## 💼 FASE 7 — SAAS, PLANOS & CONTROLE

🎯 **Objetivo:**  
Monetizar sem bagunça.

### Funcionalidades
- [ ] Feature flags
- [ ] Limites por plano
- [ ] Auditoria de uso
- [ ] Billing-ready

📌 **Regra:**  
Plano é regra de sistema, não if solto.

---

## 🧪 FASE 8 — QUALIDADE & ESTABILIDADE

🎯 **Objetivo:**  
Produto confiável.

### Ações
- [ ] Testes automatizados
- [ ] Testes de carga
- [ ] Simulação de falhas
- [ ] Documentação final

---

## 📚 FASE 9 — DOCUMENTAÇÃO FINAL

🎯 **Objetivo:**  
Produto entregável e escalável.

### Entregáveis
- [ ] Manual técnico
- [ ] Manual do integrador
- [ ] Manual do cliente
- [ ] Diagramas finais

---

## 🧠 PRINCÍPIOS DE ORGANIZAÇÃO (NÃO NEGOCIÁVEIS)

- Um repositório = uma responsabilidade  
- Documento antes de código  
- Diagrama antes de refatorar  
- Nada “rápido só pra testar” sem virar técnico  
- Tudo que não está documentado não existe  

---

📝 **Nota de Governança**  
Este é um documento vivo.  
Itens só podem ser marcados como concluídos quando houver evidência clara no repositório GitHub.
