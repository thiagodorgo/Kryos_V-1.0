-- Banco de trabalho
CREATE DATABASE IF NOT EXISTS kryos;
USE kryos;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('cliente', 'supervisor', 'administrador') DEFAULT 'cliente',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS plants (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(160) NOT NULL,
  status ENUM('online', 'degraded', 'offline') DEFAULT 'online',
  vpn_tunnel VARCHAR(120),
  hostname VARCHAR(200),
  server_map_file VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS devices (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  plant_id BIGINT NOT NULL,
  name VARCHAR(160) NOT NULL,
  modbus_id INT NOT NULL,
  family_code VARCHAR(80),
  model_file VARCHAR(200),
  device_code VARCHAR(120),
  alarm_active BOOLEAN DEFAULT FALSE,
  last_seen_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (plant_id) REFERENCES plants(id)
);

CREATE TABLE IF NOT EXISTS device_variables (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  device_id BIGINT NOT NULL,
  code VARCHAR(160) NOT NULL,
  label VARCHAR(255) NOT NULL,
  function_code INT NOT NULL,
  offset INT NOT NULL,
  length INT NOT NULL,
  address_in VARCHAR(40),
  measure_unit VARCHAR(40),
  decimals INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (device_id) REFERENCES devices(id)
);

CREATE TABLE IF NOT EXISTS telemetry (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  device_id BIGINT NOT NULL,
  metric VARCHAR(120) NOT NULL,
  value DOUBLE NOT NULL,
  captured_at DATETIME NOT NULL,
  FOREIGN KEY (device_id) REFERENCES devices(id)
);

ALTER TABLE telemetry
  ADD INDEX IF NOT EXISTS idx_telemetry_device_metric_time (device_id, metric, captured_at),
  ADD INDEX IF NOT EXISTS idx_telemetry_device_time (device_id, captured_at);

CREATE TABLE IF NOT EXISTS device_readings (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  device_id BIGINT NOT NULL,
  variable_id BIGINT,
  code VARCHAR(160),
  value DOUBLE,
  status VARCHAR(60),
  error TEXT,
  response_ms INT,
  raw_registers JSON,
  captured_at DATETIME NOT NULL,
  FOREIGN KEY (device_id) REFERENCES devices(id)
);

ALTER TABLE device_readings
  ADD INDEX IF NOT EXISTS idx_device_readings_device_time (device_id, captured_at),
  ADD INDEX IF NOT EXISTS idx_device_readings_device_code_time (device_id, code, captured_at);

CREATE TABLE IF NOT EXISTS device_dashboard_variables (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  device_id BIGINT NOT NULL,
  variable_id BIGINT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE,
  FOREIGN KEY (variable_id) REFERENCES device_variables(id) ON DELETE CASCADE
);

ALTER TABLE device_dashboard_variables
  ADD INDEX IF NOT EXISTS idx_dashboard_variables_device (device_id);

CREATE TABLE IF NOT EXISTS device_mini_graph_variables (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  device_id BIGINT NOT NULL,
  variable_id BIGINT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE,
  FOREIGN KEY (variable_id) REFERENCES device_variables(id) ON DELETE CASCADE
);

ALTER TABLE device_mini_graph_variables
  ADD INDEX IF NOT EXISTS idx_mini_graph_variables_device (device_id);

CREATE TABLE IF NOT EXISTS device_assets (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  device_id BIGINT NOT NULL,
  model_file VARCHAR(200),
  image_key VARCHAR(120),
  image_path VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE
);

ALTER TABLE device_assets
  ADD INDEX IF NOT EXISTS idx_device_assets_device (device_id);

CREATE TABLE IF NOT EXISTS alarms (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  plant_id BIGINT NOT NULL,
  device_id BIGINT NOT NULL,
  code VARCHAR(60) NOT NULL,
  description VARCHAR(255),
  severity ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
  opened_at DATETIME NOT NULL,
  acknowledged_at DATETIME,
  closed_at DATETIME,
  FOREIGN KEY (plant_id) REFERENCES plants(id),
  FOREIGN KEY (device_id) REFERENCES devices(id)
);

CREATE TABLE IF NOT EXISTS audit_log (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT,
  action VARCHAR(200) NOT NULL,
  entity VARCHAR(120),
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS scan_sessions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  plant_id BIGINT,
  user_id BIGINT,
  protocol ENUM('tcp', 'rtu') NOT NULL,
  status ENUM('running', 'finished', 'failed') DEFAULT 'running',
  config JSON,
  started_at DATETIME NOT NULL,
  finished_at DATETIME,
  total_results INT DEFAULT 0,
  FOREIGN KEY (plant_id) REFERENCES plants(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS scan_results (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  session_id BIGINT NOT NULL,
  connection VARCHAR(200),
  ip VARCHAR(64),
  port INT,
  unit_id INT,
  function_code INT,
  offset INT,
  length INT,
  status VARCHAR(60),
  response_ms INT,
  error TEXT,
  registers JSON,
  created_at DATETIME NOT NULL,
  FOREIGN KEY (session_id) REFERENCES scan_sessions(id)
);

CREATE TABLE IF NOT EXISTS scan_logs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  session_id BIGINT NOT NULL,
  level ENUM('info', 'warning', 'error') DEFAULT 'info',
  message VARCHAR(255),
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES scan_sessions(id)
);
