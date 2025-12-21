-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 06 Desember 2025
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sustainovata-db`
--

-- ============================================================
-- Original Tables
-- ============================================================

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `ID_user` int(25) NOT NULL PRIMARY KEY,
  `name` varchar(255) NOT NULL,
  `username` varchar(20) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `address` text DEFAULT NULL,
  `photo_path` varchar(255),
  `bio` longtext,
  `role` varchar(25) NOT NULL DEFAULT 'user',
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO users (name, email, password, role)
VALUES ('Admin User', 'admin@test.com', '$2b$10$mLEapRS9h2piwDO0gFdr9uenglCT2KfB41g6uY2ezIEdpa7vcDMpu', 'admin');

-- Editor account
INSERT INTO users (name, email, password, role)
VALUES ('Editor User', 'editor@test.com', '$2b$10$mLEapRS9h2piwDO0gFdr9uenglCT2KfB41g6uY2ezIEdpa7vcDMpu', 'editor');

-- Author account
INSERT INTO users (name, email, password, role)
VALUES ('Author User', 'author@test.com', '$2b$10$mLEapRS9h2piwDO0gFdr9uenglCT2KfB41g6uY2ezIEdpa7vcDMpu', 'author');

-- --------------------------------------------------------

--
-- Struktur dari tabel `programs`
--

CREATE TABLE `programs` (
  `ID_program` int(11) NOT NULL PRIMARY KEY,
  `name` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `peserta` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `poster` text NOT NULL,
  `add_date` date NOT NULL DEFAULT current_timestamp(),
  `Jenis_program` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `programs`
--


-- --------------------------------------------------------

--
-- Struktur dari tabel `peserta_programs`
--

CREATE TABLE `peserta_programs` (
  `ID_user` int(11) NOT NULL,
  `ID_Porogram` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `news`
--

CREATE TABLE `news` (
  `ID_news` int(11) NOT NULL PRIMARY KEY,
  `title` varchar(255) NOT NULL,
  `kategori` text NOT NULL,
  `ringkasan` text NOT NULL,
  `text` text NOT NULL,
  `cover` varchar(255) NOT NULL,
  `date_published` date NOT NULL,
  `date_upload` date NOT NULL DEFAULT current_timestamp(),
  `FK_ID_user` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `news`
--


-- --------------------------------------------------------

--
-- Struktur dari tabel `jurnal`
--

CREATE TABLE `jurnal` (
  `ID_jurnal` int(25) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `title` varchar(255) NOT NULL,
  `writer` varchar(255) NOT NULL,
  `keyword` varchar(255) NOT NULL,
  `abstract` text NOT NULL,
  `doi` varchar(255) NOT NULL,
  `file` text NOT NULL,
  `cover_image` text DEFAULT NULL,
  `date_published` date NOT NULL,
  `date_upload` date NOT NULL DEFAULT current_timestamp(),
  `FK_ID_user` int(11) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'draft',
  `revision_count` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `jurnal`
--
-- ============================================================
-- New Tables for Features
-- ============================================================

-- --------------------------------------------------------

--
-- Struktur dari tabel `journal_reviews`
--

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

-- --------------------------------------------------------

--
-- Struktur dari tabel `journal_versions`
--

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

-- --------------------------------------------------------

--
-- Struktur dari tabel `collaborations`
--

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

-- --------------------------------------------------------

--
-- Struktur dari tabel `collaboration_members`
--

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

-- --------------------------------------------------------

--
-- Struktur dari tabel `contact_messages`
--

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

-- --------------------------------------------------------

--
-- Struktur dari tabel `team_members`
--

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

--
-- Dumping data untuk tabel `team_members`
--

INSERT IGNORE INTO `team_members` (`name`, `position`, `category`, `description`, `email`, `expertise`, `display_order`, `is_active`)
VALUES
('Prof. Asep', 'Founder Sustainovata', 'founder', 'Founder and visionary behind Sustainovata initiative', 'prof.asep@sustainovata.com', 'Sustainable Development', 1, TRUE),
('Budi Siregar M.Pd', 'Co Founder Sustainovata', 'founder', 'Co-founder with expertise in education and community development', 'budi.siregar@sustainovata.com', 'Education, Community Development', 2, TRUE),
('Siti Arifah M.P', 'Ketua Divisi Peneliti', 'team', 'Head of Research Division leading agricultural research initiatives', 'siti.arifah@sustainovata.com', 'Agricultural Research', 3, TRUE),
('Nurul S.Kom', 'Ketua Divisi Pengembang', 'team', 'Head of Development Division overseeing technology solutions', 'nurul@sustainovata.com', 'Software Development, IoT', 4, TRUE);

-- --------------------------------------------------------

--
-- Struktur dari tabel `partners`
--

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

--
-- Dumping data untuk tabel `partners`
--

INSERT IGNORE INTO `partners` (`name`, `description`, `category`, `contact_person`, `contact_email`, `collaboration_type`, `status`, `display_order`)
VALUES
('Universitas Brawijaya', 'Research and development partner for agricultural technology and sustainability initiatives', 'Research Institute', 'Dr. Ari Wibowo', 'ari@ub.ac.id', 'Research Collaboration', 'active', 1),
('LPPM Unibraw', 'Community Development Partnership focused on grassroots empowerment programs', 'Community Organization', 'Siti Mardiah', 'lppm@ub.ac.id', 'Community Engagement', 'active', 2),
('Kementerian Pertanian', 'Government Partner for Agricultural Programs and policy support', 'Government', 'Bambang Sutrisno', 'info@pertanian.go.id', 'Policy Support', 'active', 3),
('TechStartup Indonesia', 'Technology Solutions Partner providing digital innovation and IoT integration', 'Technology Company', 'Agus Wijaya', 'info@techstartup.id', 'Technology Integration', 'active', 4);

-- ============================================================
-- Indexes
-- ============================================================

--
-- Additional Indexes for Performance
--
CREATE INDEX IF NOT EXISTS idx_journal_status ON jurnal(status);
CREATE INDEX IF NOT EXISTS idx_journal_editor ON journal_reviews(FK_ID_editor);
CREATE INDEX IF NOT EXISTS idx_collab_owner ON collaborations(owner_id);
CREATE INDEX IF NOT EXISTS idx_collab_member ON collaboration_members(FK_ID_user);

-- ============================================================
-- AUTO_INCREMENT
-- ============================================================

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `ID_user` int(25) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT untuk tabel `programs`
--
ALTER TABLE `programs`
  MODIFY `ID_program` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT untuk tabel `news`
--
ALTER TABLE `news`
  MODIFY `ID_news` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `jurnal`
--
ALTER TABLE `jurnal`
  MODIFY `ID_jurnal` int(25) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT untuk tabel `team_members`
--
ALTER TABLE `team_members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `partners`
--
ALTER TABLE `partners`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `journal_reviews`
--
ALTER TABLE `journal_reviews`
  MODIFY `ID_review` int(25) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `journal_versions`
--
ALTER TABLE `journal_versions`
  MODIFY `ID_version` int(25) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `collaborations`
--
ALTER TABLE `collaborations`
  MODIFY `ID_collab` int(25) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `collaboration_members`
--
ALTER TABLE `collaboration_members`
  MODIFY `ID_member` int(25) NOT NULL AUTO_INCREMENT;

-- ========================================================
-- Collaboration Requests Table
-- ========================================================

CREATE TABLE IF NOT EXISTS `collaboration_requests` (
  `ID_request` int(25) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `from_user_id` int(25),
  `to_editor_id` int(25),
  `organization_name` varchar(255),
  `contact_name` varchar(255),
  `contact_email` varchar(255),
  `contact_phone` varchar(20),
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

--
-- AUTO_INCREMENT untuk tabel `collaboration_requests`
--
ALTER TABLE `collaboration_requests`
  MODIFY `ID_request` int(25) NOT NULL AUTO_INCREMENT;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
