📅 Cronograma de Desenvolvimento Kryos 1.0
🚀 Sprint 1: Fundação em C++ e Aquisição Modbus (Back-end Local)
🔧 Isolar e reescrever a lógica de aquisição: Criar um protótipo em C++ usando a biblioteca libmodbus para substituir o atual código em Python.
⚙️ Multithreading: Implementar threads separadas para a leitura do Modbus TCP/RTU em alta velocidade e para o servidor da API.
📊 Fila de prioridade em memória: Desenvolver a estrutura de fila (std::priority_queue) em C++ para separar variáveis críticas (envio imediato) de variáveis de histórico.
☁️ Sprint 2: Infraestrutura Cloud e Conectividade Segura
🏗️ Configuração AWS: Provisionar a infraestrutura inicial usando seu bônus de US$ 100, incluindo uma instância EC2 (t3.medium) e o banco de dados RDS (MySQL).
🔐 Túnel VPN: Configurar o servidor VPN (OpenVPN ou WireGuard) na nuvem e o cliente na Raspberry Pi para garantir comunicação com IP fixo interno e criptografia do tráfego Modbus.
💾 Modelagem do Banco de Dados: Criar o esquema MySQL otimizado (tabelas particionadas para telemetria, usuários, plantas e dispositivos) focado em séries temporais.
🎛️ Sprint 3: Desenvolvimento do Hardware de Borda (IHM e Coletor)
📱 IHM de Skid (Stateless): Configurar a Raspberry Pi Zero 2 W com tela touch de 7". Implementar o C++ para gerenciar dados puramente na memória RAM (std::vector circular) com latência quase zero.
📺 Supervisório Central: Configurar a Raspberry Pi 4 (2GB) com tela de 10" ou TV externa.
🔄 Modo Kiosk e Systemd: Criar os scripts de inicialização no Linux (kryos-backend.service e kryos-ui.service) para abrir o navegador em tela cheia automaticamente e garantir a reconexão em caso de falhas.
🎨 Sprint 4: Interface Frontend e Experiência do Usuário (PWA)
⚛️ Desenvolvimento React/Tailwind: Construir os dashboards responsivos (Mobile-First) para celulares, tablets e monitores.
📲 Progressive Web App (PWA): Configurar o manifest.json e o Service Worker para permitir a instalação do Kryos diretamente na tela do celular, com suporte a tela cheia e notificações push.
🔑 Segurança 2FA: Implementar no backend C++ a geração de códigos de 6 dígitos com expiração de 5 minutos, integrando o envio via SMS ou E-mail para autenticação.
👥 Sprint 5: Gestão de Clientes, Retenção e Regras de SaaS
🛡️ Painel Administrativo (RBAC): Criar as telas de hierarquia para Super Admin, Gestor e Operador, permitindo a configuração remota de IPs e IDs Modbus.
💳 Gerenciamento de Planos e Sincronização: Programar a lógica no C++ que "acorda" a comunicação com a nuvem na IHM local apenas quando o cliente assina o contrato.
📄 Limpeza e Exportação: Criar workers para particionamento de dados de acordo com o plano do cliente (1, 3 ou 6 meses) e implementar a exportação de relatórios históricos em PDF.
🤖 Sprint 6: Inteligência Artificial e Previsibilidade
🔮 Manutenção Preditiva: Integrar a API do Vertex AI/Gemini para analisar amostras de telemetria (ex: ciclos de degelo) e exibir no React um índice de probabilidade de falhas futuras nos compressores.
📈 Análise de Comportamento: Desenvolver a tabela de logs de auditoria (audit_logs) e configurar a IA para identificar padrões ineficientes ou de risco na operação dos usuários.
