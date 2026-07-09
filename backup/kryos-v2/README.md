# ❄️ Kryos | Sistema de Supervisão de Refrigeração

Plataforma de supervisão para gateways Carel BOSS com polling Modbus, dashboards responsivos, RBAC e assistente de alarmes via IA.

## Visão geral
- Scanner usa o XML do servidor (server map) para importar devices/variáveis.
- O XML do device (modelo) complementa labels, unidades, decimais e tamanho de leitura.
- Cada planta mantém seu próprio `server_map_file` (sem dependência global fixa).
- Dashboard mostra miniaturas 16:9 com as principais variáveis e unidades.
- Backend FastAPI + MySQL (fallback em memória quando DB não está disponível).

## Estrutura de pastas
- `frontend/`: SPA React (login, dashboard, multi-plantas, setup, admin e IA).
- `backend/`: API FastAPI em Python.
- `backend/db/schema.sql`: esquema MySQL (users, plants, devices, telemetry, alarms, audit_log).
- `backend/db/telemetry_partitions.sql`: particionamento opcional de telemetria (MySQL 8+).
- `backend/Models/`: XMLs de modelos e server maps.

## Requisitos
- Python 3.11+ (testado com 3.13).
- Node.js 18+.
- MySQL 8+ (ou Docker).

## Atalho (script único)
Na raiz, execute:
```bash
run-dev.bat
```
- Sobe backend e frontend em janelas separadas.
- Usa `backend\.venv` se existir, senão usa o Python do sistema.
- Faz `npm install` automaticamente se `frontend/node_modules` não existir.
- Se a porta `4000` estiver ocupada, tenta `4001`, `4002` e `4003`.

Opcional: definir host/porta do backend:
```bash
set KRYOS_HOST=127.0.0.1
set KRYOS_PORT=4000
run-dev.bat
```
O frontend usa essas variáveis para configurar o proxy `/api` automaticamente.

## Passo a passo para rodar (Windows)

1) Configure o MySQL:
```bash
docker run --name kryos-mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=kryos -p 3305:3306 -d mysql:8.0
docker exec -i kryos-mysql mysql -uroot -proot kryos < backend/db/schema.sql
```

2) Ajuste o `.env` da raiz (exemplo):
```bash
DATABASE_URL=mysql+mysqlconnector://root:root@localhost:3305/kryos
OPENAI_API_KEY=<sua-chave>
AI_MODEL=gpt-4o-mini
ALLOWED_ORIGINS=["*"]
POLL_INTERVAL_SECONDS=5
TELEMETRY_RETENTION_DAYS=30
READINGS_RETENTION_DAYS=7
RETENTION_CLEANUP_INTERVAL_SECONDS=3600
DB_POOL_SIZE=32
```

3) Backend:
```bash
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
# ou, no CMD: .\.venv\Scripts\activate.bat
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 4000
```

4) Frontend:
```bash
cd frontend
npm install
npm run start
```

5) URLs:
- API: `http://localhost:4000/health` ou `http://localhost:4000/docs`
- App: `http://localhost:5173`

## Scanner Modbus (server map)

### Como funciona
- O server map (`mbs_configuration`) traz a lista de devices, nomes reais e endereços.
- O XML do device (modelo) complementa labels, unidades, decimais e tamanho de leitura.
- Endereços do modelo podem estar inválidos; o server map sempre prevalece.
- A importação do server map faz upsert por planta/dispositivo (`plant_id` + `modbus_id`) e não apaga dados de outras plantas.
- No upload via scanner, o XML é salvo automaticamente em `backend/Models/` com nome único e associado à planta.
- Se o server map informar o arquivo de modelo do device, o sistema cruza labels/unidades/decimais desse XML.

### Scan rápido Panifresh (server localhost:502)
1) Garanta que o arquivo `backend/Models/panifresh_modbus_server_20260106224146.xml` existe.
2) Abra o app e vá em `Setup > Scanner`.
3) Preencha:
   - IP: `localhost`
   - Porta: `502`
   - XML do servidor: `panifresh_modbus_server_20260106224146.xml`
4) Clique em **Importar XML**.

Se preferir via API:
```bash
curl -X POST http://localhost:4000/api/scans/server-import ^
  -H "Content-Type: application/json" ^
  -d "{\"host\":\"localhost\",\"port\":502,\"server_map_file\":\"panifresh_modbus_server_20260106224146.xml\",\"plant_name\":\"Panifresh\"}"
```

Após o scan:
- A tela de Dashboard mostra as miniaturas 16:9 com as principais variáveis e unidades.
- O IP lembra os últimos 10 endereços usados.
- A tela **Plantas** define a planta ativa; o Dashboard abre sempre a última planta selecionada.

## Sensores analógicos de pressão
- O frontend não aplica escala de transdutor.
- Use o valor já convertido pelo backend/modelo (unidade e decimais corretos).

## Banco de dados e performance
- Use MySQL local para leitura e escrita rápidas.
- Ajuste `DB_POOL_SIZE` no `.env` conforme a carga.
- As tabelas já têm índices para leitura por `device_id`, `metric` e tempo.
- Para alta frequência, use `backend/db/telemetry_partitions.sql`.
- Ajuste `POLL_INTERVAL_SECONDS` conforme necessidade de atualização.
- O backend usa pool de conexões; ajuste `DB_POOL_SIZE` para leituras mais rápidas.

## Scripts úteis
- Limpar dados do banco:
  ```bash
  python backend/scripts/clear_db.py
  ```
- Atualizar offsets usando server map:
  ```bash
  python backend/scripts/apply_server_map.py
  ```

## Rotas principais
- `POST /api/auth/login` — login (MySQL) ou usuário demo.
- `GET /api/plants` — lista plantas.
- `GET /api/plants/{id}/devices` — devices da planta.
- `GET /api/telemetry/overview` — resumo de telemetria por device.
- `POST /api/scans/server-import` — importa XML do servidor.
- `GET /api/server-maps` — lista server maps disponíveis.
- `GET /api/models` — lista modelos de device disponíveis.
- `POST /api/ai/analyze` — análise de alarmes via IA.

## Observações
- Sem MySQL, as rotas de leitura usam fallback em memória e algumas rotas de escrita retornam erro.
- Imagens dos controladores ficam em `frontend/public/images`.
- As miniaturas dos devices mantêm proporção 16:9 em grade de 4 colunas no desktop.
- Se a planta não possuir `server_map_file`, o backend usa fallback seguro sem forçar filtro global.

## Troubleshooting
- Erro `WinError 10013` ao subir o backend:
  - Tente `--host 127.0.0.1` (o `run-dev.bat` já usa este padrão).
  - Se a porta estiver bloqueada, use outra: `set KRYOS_PORT=4001` antes de rodar.
  - Libere o Python no firewall do Windows ou rode o terminal como administrador.
  - Se mudar a porta do backend, o proxy usa `KRYOS_PORT` automaticamente.
