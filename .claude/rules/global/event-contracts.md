# Purpose
Governar o ciclo de vida dos contratos de mensagem em `specs/events`: todo evento/comando publicado no RabbitMQ (ver `rabbitmq.md` e ADR-0005) precisa de um contrato formal em `specs/events` antes de qualquer publisher ou consumer ser implementado.

# Rules
- `specs/events` é a fonte de verdade do formato de cada mensagem — payload, cabeçalhos obrigatórios, exchange e routing key de destino. Nenhum publisher é implementado antes do contrato existir aqui.
- Todo contrato exige, no mínimo: `tenantId`, `correlationId`, `causationId`, `messageId`, `schemaVersion`, `producedAt` (cabeçalhos definidos em `rabbitmq.md`), e o payload versionado em SemVer.
- Os quatro contratos v1.0 já validados na memória de backup (`backup/kryos/docs/telemetry-contract-v1.md` e equivalentes de setpoint/ACK, alarme e autenticação) são a base de adoção — adaptar para a topologia desta plataforma, não redesenhar do zero.
- Mudança breaking em um contrato exige um novo ADR, não edição silenciosa da versão existente; mudança compatível (aditiva) é permitida com bump de versão menor.
- Nenhum contrato final é criado nesta etapa — apenas estrutura e documentação de intenção; a formalização completa segue o workflow plan → simulate → implement.

# Required Checks
- Confirmar stage structure-only.
- Confirmar que o contrato referencia exchange/routing key válidos conforme ADR-0005.
- Confirmar presença dos cinco cabeçalhos obrigatórios em todo contrato novo.
- Confirmar alinhamento com os contratos v1.0 da base de backup quando o domínio já foi coberto lá (telemetria, setpoint/ACK, alarme, autenticação).

# Rejection Criteria
- Publisher ou consumer implementado sem contrato correspondente em `specs/events`.
- Contrato sem os cabeçalhos obrigatórios.
- Mudança breaking sem ADR.
- Alteração de memória de backup.
- Credenciais, deploy ou falsas afirmações de implementação.
