# messaging-common

Biblioteca compartilhada que implementa, uma única vez, tudo que o `docs/adr/0005-rabbitmq-unified-messaging-backbone.md` exige de todo serviço que publica ou consome mensagens. Nenhum dos 17 serviços implementa conexão, exchange, fila ou idempotência por conta própria — todos dependem deste módulo.

## Responsabilidades (quando implementado)
- **Envelope de mensagem**: wrapper padrão carregando os cabeçalhos obrigatórios (`tenantId`, `correlationId`, `causationId`, `messageId`, `schemaVersion`, `producedAt`) sobre o payload de domínio.
- **Helpers de publicação**: declaração idempotente de exchange/fila/DLX seguindo a convenção de nomes do ADR-0005 (`kryos.{plano}`, `{service}.{propósito}.q`, `{service}.{propósito}.dlq`), publish com confirmação (publisher confirms) e retry com backoff.
- **Helpers de consumo**: desserialização do envelope, verificação de `schemaVersion`, e um utilitário de deduplicação por `messageId` (para que cada serviço só precise decidir a *ação* idempotente, não reimplementar a checagem).
- **Roteamento REAL_TIME × HISTORY**: utilitário para publicar telemetria na fila correta por classe, nunca via priority queue nativa.
- **Propagação de correlação**: garante que `correlationId`/`causationId` fluam de uma mensagem consumida para as mensagens publicadas em resposta, mantendo a cadeia auditável exigida pelo decision ledger.

## Quem depende deste módulo
Todo serviço em `services/*` que declara `rabbitmq.planned: true` no seu `module.yaml`, e o `edge-collector` no lado da borda (canal `kryos.edge`).

## Estágio
`structure-only`. Nenhuma conexão real, dependência de cliente AMQP instalada, ou lógica de serialização existe nesta etapa. Ver `.claude/rules/global/rabbitmq.md` e o `rabbitmq-domain-agent` para revisão de qualquer proposta de topologia antes da implementação.
