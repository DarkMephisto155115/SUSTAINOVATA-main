-- Migration for Missing Features: Contact, Team, Partners
-- Date: December 6, 2024

-- ===========================
-- Contact Messages Table
-- ===========================
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

-- ===========================
-- Team Members Table
-- ===========================
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

-- ===========================
-- Partners Table
-- ===========================
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
-- Alter users table to add new fields
-- ===========================
ALTER TABLE `users` 
ADD COLUMN IF NOT EXISTS `telephone` varchar(20),
ADD COLUMN IF NOT EXISTS `address` text,
ADD COLUMN IF NOT EXISTS `photo_path` varchar(255),
ADD COLUMN IF NOT EXISTS `bio` longtext,
ADD COLUMN IF NOT EXISTS `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- ===========================
-- Insert Sample Team Members
-- ===========================
INSERT IGNORE INTO `team_members` (`name`, `position`, `category`, `description`, `email`, `expertise`, `display_order`, `is_active`)
VALUES
('Prof. Asep', 'Founder Sustainovata', 'founder', 'Founder and visionary behind Sustainovata initiative', 'prof.asep@sustainovata.com', 'Sustainable Development', 1, TRUE),
('Budi Siregar M.Pd', 'Co Founder Sustainovata', 'founder', 'Co-founder with expertise in education and community development', 'budi.siregar@sustainovata.com', 'Education, Community Development', 2, TRUE),
('Siti Arifah M.P', 'Ketua Divisi Peneliti', 'team', 'Head of Research Division leading agricultural research initiatives', 'siti.arifah@sustainovata.com', 'Agricultural Research', 3, TRUE),
('Nurul S.Kom', 'Ketua Divisi Pengembang', 'team', 'Head of Development Division overseeing technology solutions', 'nurul@sustainovata.com', 'Software Development, IoT', 4, TRUE);

-- ===========================
-- Insert Sample Partners
-- ===========================
INSERT IGNORE INTO `partners` (`name`, `description`, `category`, `contact_person`, `contact_email`, `collaboration_type`, `status`, `display_order`)
VALUES
('Universitas Brawijaya', 'Research and development partner for agricultural technology and sustainability initiatives', 'Research Institute', 'Dr. Ari Wibowo', 'ari@ub.ac.id', 'Research Collaboration', 'active', 1),
('LPPM Unibraw', 'Community Development Partnership focused on grassroots empowerment programs', 'Community Organization', 'Siti Mardiah', 'lppm@ub.ac.id', 'Community Engagement', 'active', 2),
('Kementerian Pertanian', 'Government Partner for Agricultural Programs and policy support', 'Government', 'Bambang Sutrisno', 'info@pertanian.go.id', 'Policy Support', 'active', 3),
('TechStartup Indonesia', 'Technology Solutions Partner providing digital innovation and IoT integration', 'Technology Company', 'Agus Wijaya', 'info@techstartup.id', 'Technology Integration', 'active', 4);
