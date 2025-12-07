-- Consolidated Database Migration
-- Combines all features: Journal Management, Collaboration, Contact, Team, and Partners
-- Date: December 2024

-- ===========================
-- ALTER TABLES
-- ===========================

-- Modify users table to support multiple roles
ALTER TABLE `users` MODIFY `role` varchar(25) NOT NULL DEFAULT 'user';

-- Add new fields to users table
ALTER TABLE `users` 
ADD COLUMN IF NOT EXISTS `telephone` varchar(20),
ADD COLUMN IF NOT EXISTS `address` text,
ADD COLUMN IF NOT EXISTS `photo_path` varchar(255),
ADD COLUMN IF NOT EXISTS `bio` longtext,
ADD COLUMN IF NOT EXISTS `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Add new fields to jurnal table for status tracking
ALTER TABLE `jurnal` ADD COLUMN IF NOT EXISTS `status` varchar(50) NOT NULL DEFAULT 'draft';
ALTER TABLE `jurnal` ADD COLUMN IF NOT EXISTS `revision_count` int(11) DEFAULT 0;

-- ===========================
-- CREATE TABLES
-- ===========================

-- Journal Reviews Table (for editor feedback and journal guidance)
CREATE TABLE IF NOT EXISTS `journal_reviews` (
  `ID_review` int(25) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `ID_jurnal` int(25) NOT NULL,
  `FK_ID_editor` int(25) NOT NULL,
  `FK_ID_author` int(25) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'pending',
  `feedback` longtext,
  `revision_notes` longtext,
  `created_at` timestamp DEFAULT current_timestamp(),
  `updated_at` timestamp DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  FOREIGN KEY (ID_jurnal) REFERENCES jurnal(ID_jurnal) ON DELETE CASCADE,
  FOREIGN KEY (FK_ID_editor) REFERENCES users(ID_user),
  FOREIGN KEY (FK_ID_author) REFERENCES users(ID_user)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Journal Versions Table (for tracking revisions)
CREATE TABLE IF NOT EXISTS `journal_versions` (
  `ID_version` int(25) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `ID_jurnal` int(25) NOT NULL,
  `FK_ID_user` int(25) NOT NULL,
  `version_number` int(11) NOT NULL,
  `file` text NOT NULL,
  `description` text,
  `created_at` timestamp DEFAULT current_timestamp(),
  FOREIGN KEY (ID_jurnal) REFERENCES jurnal(ID_jurnal) ON DELETE CASCADE,
  FOREIGN KEY (FK_ID_user) REFERENCES users(ID_user)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Collaborations Table (for document sharing)
CREATE TABLE IF NOT EXISTS `collaborations` (
  `ID_collab` int(25) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `title` varchar(255) NOT NULL,
  `description` text,
  `document_file` text NOT NULL,
  `owner_id` int(25) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'active',
  `visibility` varchar(50) NOT NULL DEFAULT 'private',
  `created_at` timestamp DEFAULT current_timestamp(),
  `updated_at` timestamp DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  FOREIGN KEY (owner_id) REFERENCES users(ID_user) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Collaboration Members Table (team members in collaborations)
CREATE TABLE IF NOT EXISTS `collaboration_members` (
  `ID_member` int(25) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `ID_collab` int(25) NOT NULL,
  `FK_ID_user` int(25) NOT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'viewer',
  `added_at` timestamp DEFAULT current_timestamp(),
  FOREIGN KEY (ID_collab) REFERENCES collaborations(ID_collab) ON DELETE CASCADE,
  FOREIGN KEY (FK_ID_user) REFERENCES users(ID_user) ON DELETE CASCADE,
  UNIQUE KEY unique_member (ID_collab, FK_ID_user)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Contact Messages Table (for contact forms and collaboration requests)
CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `topic` varchar(100) NOT NULL,
  `message` longtext NOT NULL,
  `attachment_path` varchar(255),
  `status` enum('new', 'read', 'replied') DEFAULT 'new',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_email` (`email`),
  INDEX `idx_status` (`status`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Team Members Table (founders, team leads, researchers)
CREATE TABLE IF NOT EXISTS `team_members` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `position` varchar(255) NOT NULL,
  `category` enum('founder', 'team', 'researcher') DEFAULT 'team',
  `description` longtext,
  `photo_path` varchar(255),
  `email` varchar(255),
  `phone` varchar(20),
  `linkedin_url` varchar(255),
  `twitter_url` varchar(255),
  `expertise` varchar(255),
  `display_order` int(11) DEFAULT 0,
  `is_active` boolean DEFAULT TRUE,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_category` (`category`),
  INDEX `idx_is_active` (`is_active`),
  INDEX `idx_display_order` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Partners Table (partnership information)
CREATE TABLE IF NOT EXISTS `partners` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` longtext,
  `logo_path` varchar(255),
  `website_url` varchar(255),
  `category` varchar(100),
  `contact_person` varchar(255),
  `contact_email` varchar(255),
  `contact_phone` varchar(20),
  `collaboration_type` varchar(255),
  `start_date` date,
  `status` enum('active', 'inactive', 'pending') DEFAULT 'active',
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_category` (`category`),
  INDEX `idx_display_order` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ===========================
-- CREATE INDEXES
-- ===========================

CREATE INDEX IF NOT EXISTS idx_journal_status ON jurnal(status);
CREATE INDEX IF NOT EXISTS idx_journal_editor ON journal_reviews(FK_ID_editor);
CREATE INDEX IF NOT EXISTS idx_collab_owner ON collaborations(owner_id);
CREATE INDEX IF NOT EXISTS idx_collab_member ON collaboration_members(FK_ID_user);

-- ===========================
-- INSERT SAMPLE DATA
-- ===========================

-- Sample Team Members
INSERT IGNORE INTO `team_members` (`name`, `position`, `category`, `description`, `email`, `expertise`, `display_order`, `is_active`)
VALUES
('Prof. Asep', 'Founder Sustainovata', 'founder', 'Founder and visionary behind Sustainovata initiative', 'prof.asep@sustainovata.com', 'Sustainable Development', 1, TRUE),
('Budi Siregar M.Pd', 'Co Founder Sustainovata', 'founder', 'Co-founder with expertise in education and community development', 'budi.siregar@sustainovata.com', 'Education, Community Development', 2, TRUE),
('Siti Arifah M.P', 'Ketua Divisi Peneliti', 'team', 'Head of Research Division leading agricultural research initiatives', 'siti.arifah@sustainovata.com', 'Agricultural Research', 3, TRUE),
('Nurul S.Kom', 'Ketua Divisi Pengembang', 'team', 'Head of Development Division overseeing technology solutions', 'nurul@sustainovata.com', 'Software Development, IoT', 4, TRUE);

-- Sample Partners
INSERT IGNORE INTO `partners` (`name`, `description`, `category`, `contact_person`, `contact_email`, `collaboration_type`, `status`, `display_order`)
VALUES
('Universitas Brawijaya', 'Research and development partner for agricultural technology and sustainability initiatives', 'Research Institute', 'Dr. Ari Wibowo', 'ari@ub.ac.id', 'Research Collaboration', 'active', 1),
('LPPM Unibraw', 'Community Development Partnership focused on grassroots empowerment programs', 'Community Organization', 'Siti Mardiah', 'lppm@ub.ac.id', 'Community Engagement', 'active', 2),
('Kementerian Pertanian', 'Government Partner for Agricultural Programs and policy support', 'Government', 'Bambang Sutrisno', 'info@pertanian.go.id', 'Policy Support', 'active', 3),
('TechStartup Indonesia', 'Technology Solutions Partner providing digital innovation and IoT integration', 'Technology Company', 'Agus Wijaya', 'info@techstartup.id', 'Technology Integration', 'active', 4);
