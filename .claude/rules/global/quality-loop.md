# Purpose
Definir o ciclo de qualidade de quatro estágios com escalonamento por impasse, operado pelos agentes de board/engineering. Complementa (não substitui) o workflow do CLAUDE.md raiz; a aprovação final permanece humana.

# The Loop
1. **PLAN** — `refrigeration-planning-agent` produz o plano da demanda (escopo, critérios de aceite, riscos) fundamentado no corpus de estudos do repo.
2. **EXECUTE** — `java-development-strategy-agent` traduz o plano em estratégia técnica e artefatos (specs, contratos, código quando o estágio permitir).
3. **EVALUATE** — `master-evaluator-agent` caça erros no resultado E no plano: inconsistências com requisitos, violações de regra, afirmações sem evidência, gaps de teste.
4. **GATE** — `approval-gate-agent` verifica se o pacote está completo para aprovação humana (checklist de gates, evidências, changed files) e monta o resumo de decisão. **Só o humano aprova.**

# Rejection and Escalation
- Reprovação em EVALUATE ou GATE devolve a demanda ao estágio PLAN, com o parecer anexado.
- O estado do ciclo vive em `engineering-runs/<run-id>/loop-state.yaml` com: `demand`, `iteration` (contador), `stage`, `verdicts[]`. Todo agente do ciclo lê e atualiza este arquivo; sem ele, o ciclo não conta.
- Ao atingir **iteration: 3 com reprovação**, qualquer agente DEVE invocar o `arbiter-agent` antes de novo ciclo. O árbitro diagnostica a causa do impasse e recomenda: descopar, dividir, criar ADR, ou levar ao humano.
- Se o ciclo pós-árbitro reprovar novamente, a demanda vai obrigatoriamente ao humano com o histórico completo — nunca loop infinito.

# Separation of Duties (invariantes)
- Quem executa não avalia o próprio trabalho; quem avalia não edita artefatos; o árbitro não aprova nada; nenhum agente substitui a aprovação humana.
- Todo veredito é escrito no loop-state com evidência (arquivo/linha/regra violada), nunca opinião sem fonte.

# Required Checks
- Confirmar stage structure-only em qualquer artefato gerado.
- Confirmar existência e atualização do loop-state.yaml a cada transição de estágio.

# Rejection Criteria
- Pular estágio do ciclo, auto-aprovação, veredito sem evidência, loop sem estado registrado, alteração de memória de backup, credenciais/deploy/falsas afirmações de implementação.
