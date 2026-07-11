# Frontend Documentation

Especificações de frontend do Kryos, mantidas por dois agentes complementares:
- `.claude/agents/engineering/frontend-construction-agent.md` — constrói a UI a partir de um plano aprovado.
- `.claude/agents/engineering/frontend-screens-research-agent.md` — decide e justifica quais telas devem existir, com base em pesquisa contínua da web (tendências, boas práticas, novidades) validada contra o conjunto competitivo real (SaaS de refrigeração).

## Conteúdo
- `frontend-product-requirements.md` — requisitos de produto do frontend (customer-portal + saas-admin-console): princípios, sistema de tokens, taxonomia de componentes, requisitos funcionais (RFF) e não funcionais (RNFF), simulações de tela e inventário de telas (15 telas). Produzido cruzando o estudo do WebApp Carel boss, os requisitos da plataforma e a pesquisa de metodologia dos 10 SaaS de refrigeração.
- Ver também `../product/metodologia-tecnica-10-saas-refrigeracao.md` — pesquisa de métodos de aquisição, estilos de visualização, objetos/classes/esquema, metodologia de exibição, inteligência cognitiva e planos/cobrança, validada em 10 SaaS de refrigeração do mundo (Danfoss Alsense, Copeland/Emerson, Carel, Eliwell, AKO, Sensitech/Carrier, ORBCOMM, SmartSense, Bitzer, Monnit).

## Estágio
`structure-only`. Estes documentos são especificação, não implementação. Nenhuma UI funcional ligada a dados reais deve existir neste estágio. Ver os limites de estágio na seção 9 do documento de requisitos e a Documentation Policy no `CLAUDE.md` raiz.

## Escopo governado
Todo requisito de frontend respeita: motor único dirigido por Device Profile, escrita apenas via policy-engine (human-in-the-loop), escopo multi-tenant/grupo em toda tela, e o piso de qualidade (responsivo, acessível, kiosk-safe, i18n pt-BR com fallback en). Decisões de tela feitas pelo `frontend-screens-research-agent` que alterem escopo de produto exigem aprovação humana antes de se tornarem vinculantes.

