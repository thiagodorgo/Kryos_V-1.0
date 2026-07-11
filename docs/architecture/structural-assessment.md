# Kryos — Avaliação Estrutural (Pontos Fortes e Pontos Fracos)

**Versão:** 1.0 · **Data:** 10/07/2026 · **Método:** auditoria direta do repositório (árvore completa, todo README, todo ADR, toda regra, todo agente inspecionados nesta data), não opinião abstrata.

---

## 1. Pontos fortes

**Governança que antecede o código, de forma real.** O workflow plan→simulate→implement→test→security review→critical review→human approval→release, os `.claude/rules`, e o conceito de `module.yaml` declarando `stage`, `riskLevel` e `requiredHumanApprovalFor` por módulo é mais maduro do que a maioria dos projetos SaaS em produção, quanto mais em estágio pré-código. O `no-business-code` como quality gate obrigatório impede a armadilha mais comum de projeto novo: código apressado sem contrato.

**Separação de planos que reflete o domínio real, não uma camada técnica arbitrária.** Control/Data/Event/Agent Orchestration/Operational/Edge mapeia 1:1 para como os 10 SaaS de refrigeração estudados de fato operam (confirmado no estudo de metodologia) — não é uma decomposição inventada, é a forma que o mercado já validou.

**Memória de backup como ativo, não lixo.** O motor C++ com fila de prioridade REAL_TIME/HISTORY, o protótipo kryos-v2 (scan com aceite humano, WebSocket, IA explicativa) e os contratos v1.0 da base 1 (telemetria, setpoint/ACK, alarme, autenticação) são trabalho real já validado, preservado como memória somente-leitura em vez de descartado. Poucos projetos chegam ao estágio de arquitetura nova com esse volume de aprendizado de domínio já extraído.

**Requisitos rastreados a evidência, não a opinião.** Cada RF/RNF no `kryos-v1-requisitos.md` aponta a uma fonte — mercado, backup, ou decisão explícita. Isso significa que discordar de um requisito é uma conversa sobre a evidência, não sobre gosto.

**A decisão de mensageria (ADR-0005) carrega uma lição de domínio da borda até a nuvem.** Filas separadas REAL_TIME/HISTORY em vez de priority queue nativa não é só uma escolha técnica defensável — é a mesma distinção que o motor C++ já resolveu na borda, agora replicada de forma consistente na nuvem. Poucas arquiteturas mantêm esse tipo de coerência entre camadas tão distantes.

**Multi-tenancy pensada desde a régua de RLS até a tela.** A skill `saas-multi-tenant` e as regras de `tenant_id` obrigatório aparecem tanto na camada de dados quanto no requisito de frontend (RFF-SHELL-05, RF-TEN-08) — não é um requisito que existe só no banco e é esquecido na UI, como acontece com frequência.

## 2. Pontos fracos

**A casca é excelente; o conteúdo, até esta rodada, era quase inteiramente genérico.** A auditoria confirmou: os 4 ADRs originais, os 9 documentos de arquitetura por plano, e ~24 dos ~26 agentes (board+domain+engineering) eram templates idênticos com o nome da entidade trocado — "Future service-specific domain responsibilities" repetido dezenas de vezes. Isso não é falha de processo, é o resultado esperado de um bootstrap automatizado de estrutura — mas significa que a "inteligência" real do projeto ainda mora quase toda nos documentos que produzimos nas últimas sessões, não distribuída pelo repositório. Está sendo corrigido incrementalmente, começando por esta rodada (RabbitMQ) — mas o volume restante é grande.

**Nenhuma linha de código de domínio existe.** Estrutura sem execução tem prazo de validade — em algum ponto, arquitetura sem prova em produção começa a acumular risco de estar errada de formas que só o uso real revela (a fila de prioridade REAL_TIME/HISTORY parece certa no papel; só telemetria real sob carga prova).

**Risco de IP não tratado, ainda aberto.** A pasta `backup/kryos/WebApp` (191 MB de código proprietário Carel) continua pública no GitHub, sinalizada e não resolvida há múltiplas interações. É o ponto fraco de maior custo-benefício de correção — resolver é barato, não resolver é caro.

**Sem README raiz.** Quem chega ao repositório pela primeira vez (investidor, novo desenvolvedor, o próprio Thiago em seis meses) não tem ponto de entrada. Toda a riqueza dos documentos de produto, arquitetura e frontend está descobrível só por quem já sabe que ela existe.

**Nenhum CI real além de um `ci.yml` mínimo.** "Execução automatizada de produção" ainda não tem esteira — não há pipeline validando quality gates automaticamente, não há ambiente de staging, não há deploy automatizado nem para o próprio structure-only (ex.: lint de que todo `module.yaml` tem os campos obrigatórios).

**Escolha de linguagem do edge-collector ainda pendente.** O `backup` tem um motor C++ de alto desempenho já funcional; o `edge-collector` novo está estruturado em Java (coerente com o monorepo Maven), mas a decisão entre reaproveitar o núcleo C++ com casca de publicação ou reescrever em Java nunca virou ADR — é uma decisão de arquitetura real ainda não tomada formalmente, só mencionada como pendência em conversa.

**Densidade de serviços vs. tamanho de equipe.** 17 microsserviços é uma decomposição correta para o domínio, mas é uma quantidade grande para uma equipe pequena operar bem desde o primeiro dia — risco real de complexidade operacional (17 pipelines, 17 bancos/schemas, 17 READMEs a manter) superar a capacidade de manutenção antes que o produto tenha um usuário pagante. Vale considerar, na meta de curto prazo, se todos os 17 nascem como processo separado ou se alguns começam colocalizados (mesmo binário, módulos internos) e só se separam quando a carga justificar — sem abandonar a decomposição lógica já definida.

**Nenhum plano de dados de teste/seed multi-tenant.** A regra de isolamento de tenant exige teste com no mínimo 3 tenants (RNF-MAN-03 do doc de requisitos), mas não existe hoje nenhum dado de exemplo, fixture ou seed — quando a implementação começar, esse é um pré-requisito que ainda não tem dono.

## 3. Leitura combinada

O padrão dominante é: **a camada de decisão (requisitos, arquitetura, governança) está muito à frente da camada de execução (código, CI, dados de teste)** — o que é o oposto do risco mais comum em projetos novos (código correndo à frente do pensamento). É um problema mais barato de ter, mas ainda é um problema: em algum momento a lacuna precisa fechar, ou o custo de manter dezenas de documentos sincronizados com uma implementação que não existe começa a superar o benefício. A meta de curto prazo do documento de estratégia (fatia vertical fina, fim-a-fim) é desenhada precisamente para começar a fechar essa lacuna sem jogar fora o trabalho de fundação já feito.
