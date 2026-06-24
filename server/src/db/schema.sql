CREATE TABLE IF NOT EXISTS contact_messages (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_contact_messages_created_at (created_at)
);

CREATE TABLE IF NOT EXISTS visitor_sessions (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  session_id VARCHAR(64) NOT NULL UNIQUE,
  visitor_id VARCHAR(64) NULL,
  ip_address VARCHAR(45) NULL,
  user_agent VARCHAR(512) NULL,
  connected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  disconnected_at TIMESTAMP NULL,
  last_seen_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_new_visit TINYINT(1) NOT NULL DEFAULT 1,
  INDEX idx_visitor_sessions_visitor_id (visitor_id),
  INDEX idx_visitor_sessions_connected_at (connected_at),
  INDEX idx_visitor_sessions_last_seen_at (last_seen_at)
);

CREATE TABLE IF NOT EXISTS visitor_events (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  session_id VARCHAR(64) NOT NULL,
  event_type ENUM('connect', 'disconnect', 'heartbeat') NOT NULL,
  online_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_visitor_events_created_at (created_at),
  INDEX idx_visitor_events_session_id (session_id)
);
