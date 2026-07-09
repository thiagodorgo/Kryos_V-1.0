# 📜 GOVERNANÇA KRYOS

Este documento formaliza decisões-chave da **FASE 0**.
Ele é **normativo** e aplica-se a todos os repositórios do ecossistema Kryos.

---

## 1) Padrão de versionamento

**Modelo:** Semantic Versioning (**SemVer 2.0.0**).

**Formato:** `MAJOR.MINOR.PATCH`

**Regras normativas:**
- **MAJOR**: mudanças incompatíveis de contrato (API, payload, schemas, comportamento).
- **MINOR**: novas funcionalidades compatíveis.
- **PATCH**: correções compatíveis (bugfixes, ajustes internos).

**Racional:**
- Claridade para integrações industriais e contratos estáveis.
- Facilita compatibilidade entre Edge, Backend, Web e Mobile.
- Reduz risco operacional ao explicitar impacto de mudanças.

---

## 2) Convenção de commits

**Padrão:** **Conventional Commits**.

**Formato:**
```
<type>(<scope>): <subject>
```

**Tipos permitidos (mínimo):**
- `feat` (novo recurso)
- `fix` (correção)
- `docs` (documentação)
- `refactor` (refatoração sem mudança de comportamento)
- `test` (testes)
- `chore` (tarefas auxiliares)

**Exemplos válidos:**
- `docs(governance): formaliza decisoes da fase 0`
- `feat(edge): adiciona parser de xml modbus`
- `fix(backend): corrige validacao de payload`
- `chore(repo): ajusta configuracao de lint`

**Regras normativas:**
- Assunto objetivo e imperativo, sem ponto final.
- `scope` deve refletir o repositório ou módulo afetado.

---

## 3) Convenção de nomes

### 3.1 Devices
**Formato:** `<PLANT_CODE>-<AREA_CODE>-<DEVICE_TYPE>-<SEQ>`

**Regras:**
- Tudo em **MAIÚSCULAS**, sem espaços.
- Separador padrão: **hífen (`-`)**.
- `SEQ` numérico com zero à esquerda (ex.: `01`, `02`).

**Exemplo:** `PLT01-UTIL-CHILLER-02`

### 3.2 Tags / Variáveis
**Formato:** `<DEVICE_ID>.<SUBSYSTEM>.<MEASUREMENT>`

**Regras:**
- Tudo em **MAIÚSCULAS**.
- Separador padrão: **ponto (`.`)**.
- `MEASUREMENT` usa nomes do Glossário (ex.: `TEMP`, `PRESS`, `FLOW`).

**Exemplo:** `PLT01-UTIL-CHILLER-02.COND.TEMP`

### 3.3 Alarmes
**Formato:** `<DEVICE_ID>.<ALARM_TYPE>.<SEVERITY>`

**Severidade permitida:** `LOW | MED | HIGH | CRIT`

**Regras:**
- Tudo em **MAIÚSCULAS**.
- Separador padrão: **ponto (`.`)**.
- `ALARM_TYPE` deve ser descritivo e curto.

**Exemplo:** `PLT01-UTIL-CHILLER-02.OVERTEMP.HIGH`

### 3.4 Regra de consistência
- **Um nome = um significado** (sem sinônimos concorrentes).
- **Glossário é autoridade** para termos industriais.
- Proibido introduzir novas siglas sem definição explícita.
- Nomes devem ser estáveis e reutilizáveis entre Edge, Backend, Web e Mobile.

---

## 4) Estrutura de pastas padrão

### 4.1 kryos-edge
```
/ (repo root)
├─ docs/
├─ src/
│  ├─ core/
│  ├─ drivers/
│  ├─ parsers/
│  ├─ services/
│  └─ utils/
├─ tests/
├─ config/
└─ scripts/
```

### 4.2 kryos-backend
```
/ (repo root)
├─ docs/
├─ src/
│  ├─ api/
│  ├─ models/
│  ├─ services/
│  ├─ repos/
│  └─ utils/
├─ tests/
├─ migrations/
└─ scripts/
```

### 4.3 kryos-web
```
/ (repo root)
├─ docs/
├─ src/
│  ├─ app/
│  ├─ components/
│  ├─ pages/
│  ├─ styles/
│  └─ utils/
├─ public/
└─ tests/
```

### 4.4 kryos-mobile
```
/ (repo root)
├─ docs/
├─ src/
│  ├─ app/
│  ├─ components/
│  ├─ screens/
│  ├─ services/
│  └─ utils/
├─ assets/
└─ tests/
```

**Regra:** diretórios adicionais só são permitidos quando justificados e documentados.
