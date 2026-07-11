# Module Expansion

## Purpose
Documentar o processo formal para adicionar um novo módulo (serviço, biblioteca compartilhada ou app) ao Kryos sem violar a governança structure-first.

## Responsibilities
- Todo novo módulo nasce com `module.yaml`, `README.md` e `quality-gates.yaml` alinhados ao estágio real, nunca implicando implementação inexistente.
- Todo novo módulo declara `dependsOn`, `publishesEvents`/`consumesEvents` (se aplicável) e `requiredHumanApprovalFor` desde o primeiro commit.
- Expansão de escopo (novo plano, novo serviço dentro de um plano existente) exige ADR quando altera topologia de mensageria ou modelo de domínio compartilhado.

## Components in this plane
- (plano transversal; ver módulos referenciados nas responsabilidades acima)

## Risks
- Novo módulo copiando o template genérico sem preencher responsabilidades reais — o padrão que esta rodada de trabalho está corrigindo em todo o repositório.

## Status
structure-only

## Not Implemented
Nenhum comportamento de domínio, API, banco de dados, mensageria real ou agente de produção está implementado nesta pasta. Este documento descreve o desenho arquitetural aprovado, não código existente.
