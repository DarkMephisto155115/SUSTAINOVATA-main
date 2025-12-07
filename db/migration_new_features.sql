-- Migration untuk fitur baru: Editor, Kolaborasi, dan Jurnal Management

-- Alter users table untuk menambah role editor
ALTER TABLE `users` MODIFY `role` varchar(25) NOT NULL DEFAULT 'user';

-- Table untuk jurnal reviews (bimbingan jurnal)
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

-- Table untuk journal versions (tracking revisi)
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

-- Table untuk kolaborasi (sharing dokumen)
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

-- Table untuk collaboration members (anggota kolaborasi)
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

-- Add new fields to jurnal table untuk status tracking
ALTER TABLE `jurnal` ADD COLUMN IF NOT EXISTS `status` varchar(50) NOT NULL DEFAULT 'draft';
ALTER TABLE `jurnal` ADD COLUMN IF NOT EXISTS `revision_count` int(11) DEFAULT 0;

-- Add indexes untuk better performance
CREATE INDEX IF NOT EXISTS idx_journal_status ON jurnal(status);
CREATE INDEX IF NOT EXISTS idx_journal_editor ON journal_reviews(FK_ID_editor);
CREATE INDEX IF NOT EXISTS idx_collab_owner ON collaborations(owner_id);
CREATE INDEX IF NOT EXISTS idx_collab_member ON collaboration_members(FK_ID_user);
