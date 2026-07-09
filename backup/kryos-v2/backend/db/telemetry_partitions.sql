-- Optional: apply only if you want partitioned tables for high-frequency telemetry.
-- This uses monthly RANGE partitions on captured_at (MySQL 8+).

-- Telemetry table with partitions (for new deployments)
-- Example template: adjust starting month/year as needed.
/*
ALTER TABLE telemetry
PARTITION BY RANGE COLUMNS(captured_at) (
  PARTITION p2025_01 VALUES LESS THAN ('2025-02-01'),
  PARTITION p2025_02 VALUES LESS THAN ('2025-03-01'),
  PARTITION p2025_03 VALUES LESS THAN ('2025-04-01'),
  PARTITION pmax VALUES LESS THAN (MAXVALUE)
);
*/

-- Device readings with partitions (optional)
/*
ALTER TABLE device_readings
PARTITION BY RANGE COLUMNS(captured_at) (
  PARTITION p2025_01 VALUES LESS THAN ('2025-02-01'),
  PARTITION p2025_02 VALUES LESS THAN ('2025-03-01'),
  PARTITION p2025_03 VALUES LESS THAN ('2025-04-01'),
  PARTITION pmax VALUES LESS THAN (MAXVALUE)
);
*/

-- Optional event to add next month's partition automatically.
-- Enable event scheduler: SET GLOBAL event_scheduler = ON;
/*
DELIMITER //
CREATE EVENT IF NOT EXISTS ev_add_telemetry_partition
ON SCHEDULE EVERY 1 MONTH
DO
BEGIN
  DECLARE next_month DATE;
  DECLARE partition_name VARCHAR(16);
  SET next_month = DATE_FORMAT(DATE_ADD(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01');
  SET partition_name = DATE_FORMAT(next_month, 'p%Y_%m');
  SET @sql := CONCAT(
    'ALTER TABLE telemetry ADD PARTITION (PARTITION ',
    partition_name,
    ' VALUES LESS THAN (\\'',
    DATE_FORMAT(DATE_ADD(next_month, INTERVAL 1 MONTH), '%Y-%m-01'),
    '\\'))'
  );
  PREPARE stmt FROM @sql;
  EXECUTE stmt;
  DEALLOCATE PREPARE stmt;
END//
DELIMITER ;
*/
