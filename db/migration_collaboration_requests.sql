-- Migration for Collaboration Requests Management
-- Adds support for tracking collaboration requests between users/authors and editors

CREATE TABLE IF NOT EXISTS `collaboration_requests` (
  `ID_request` int(25) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `from_user_id` int(25) NOT NULL,
  `to_editor_id` int(25) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` longtext,
  `document_id` int(25),
  `status` varchar(50) NOT NULL DEFAULT 'pending',
  `rejection_reason` longtext,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `reviewed_at` timestamp NULL,
  FOREIGN KEY (from_user_id) REFERENCES users(ID_user) ON DELETE CASCADE,
  FOREIGN KEY (to_editor_id) REFERENCES users(ID_user) ON DELETE CASCADE,
  INDEX `idx_to_editor` (to_editor_id),
  INDEX `idx_from_user` (from_user_id),
  INDEX `idx_status` (status),
  INDEX `idx_created_at` (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Auto increment for collaboration_requests
ALTER TABLE `collaboration_requests`
  MODIFY `ID_request` int(25) NOT NULL AUTO_INCREMENT;
