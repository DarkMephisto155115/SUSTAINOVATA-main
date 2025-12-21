const db = require('../../utils/db');

class AuthorJournalController {
  static async createJournal(req, res) {
    try {
      console.log('=== CREATE JOURNAL REQUEST ===');
      console.log('Headers:', req.headers);
      console.log('Body:', req.body);
      console.log('Files:', req.files);
      console.log('User:', req.user);

      const { title, writer, keyword, abstract, doi } = req.body;
      const userId = req.user.ID_user;
      
      if (!userId) {
        console.error('❌ User ID is missing from JWT token');
        return res.status(401).json({ message: 'User ID missing in token. Please log out and log back in.' });
      }
      const file = req.files?.file?.[0]?.filename || null;
      const cover_image = req.files?.cover_image?.[0]?.filename || null;

      console.log('Extracted data:', { title, writer, keyword, abstract, doi, userId, file, cover_image });

      if (!title || !writer || !abstract) {
        console.log('Validation failed: Missing required fields');
        return res.status(400).json({ message: 'Title, writer, and abstract are required' });
      }

      const query = `
        INSERT INTO jurnal 
        (title, writer, keyword, abstract, doi, file, cover_image, date_published, date_upload, FK_ID_user, status, revision_count)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, 'draft', 0)
      `;
      
      const publishDate = new Date().toISOString().split('T')[0];
      console.log('Query parameters:', [title, writer, keyword || '', abstract, doi || '', file, cover_image, publishDate, userId]);

      const result = await db(query, [title, writer, keyword || '', abstract, doi || '', file, cover_image, publishDate, userId]);
      
      console.log('Journal created successfully with ID:', result.insertId);

      res.status(201).json({ message: 'Journal created successfully', data: { ID_jurnal: result.insertId } });
    } catch (error) {
      console.error('=== ERROR IN CREATE JOURNAL ===');
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      console.error('Error details:', error);
      res.status(500).json({ message: 'Error creating journal', error: error.message });
    }
  }

  static async getMyJournals(req, res) {
    try {
      const userId = req.user.ID_user;
      const query = `
        SELECT * FROM jurnal
        WHERE FK_ID_user = ?
        ORDER BY date_upload DESC
      `;
      const journals = await db(query, [userId]);
      res.status(200).json({ data: journals });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching journals', error: error.message });
    }
  }

  static async getJournalDetail(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.ID_user;

      const query = `
        SELECT j.*, u.name as author_name
        FROM jurnal j
        JOIN users u ON j.FK_ID_user = u.ID_user
        WHERE j.ID_jurnal = ? AND j.FK_ID_user = ?
      `;
      const journal = await db(query, [id, userId]);

      if (journal.length === 0) {
        return res.status(404).json({ message: 'Journal not found' });
      }

      console.log(`\n📖 Author Journal Detail Request for ID: ${id}`);
      console.log(`   Title: ${journal[0].title}`);
      console.log(`   PDF File: ${journal[0].file}`);
      console.log(`   Cover Image: ${journal[0].cover_image}`);
      console.log(`   Status: ${journal[0].status}`);

      const reviewsQuery = `
        SELECT * FROM journal_reviews
        WHERE ID_jurnal = ?
        ORDER BY created_at DESC
      `;
      const reviews = await db(reviewsQuery, [id]);

      const versionsQuery = `
        SELECT * FROM journal_versions
        WHERE ID_jurnal = ?
        ORDER BY version_number DESC
      `;
      const versions = await db(versionsQuery, [id]);

      res.status(200).json({ data: journal[0], reviews, versions });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching journal detail', error: error.message });
    }
  }

  static async submitForReview(req, res) {
    try {
      const { ID_jurnal } = req.params;
      const userId = req.user.ID_user;

      const journalCheck = await db('SELECT FK_ID_user, status FROM jurnal WHERE ID_jurnal = ?', [ID_jurnal]);
      if (journalCheck.length === 0) {
        return res.status(404).json({ message: 'Journal not found' });
      }

      if (journalCheck[0].FK_ID_user !== userId) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      if (journalCheck[0].status !== 'draft') {
        return res.status(400).json({ message: 'Journal can only be submitted from draft status' });
      }

      await db('UPDATE jurnal SET status = ? WHERE ID_jurnal = ?', ['pending_review', ID_jurnal]);
      res.status(200).json({ message: 'Journal submitted for review successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error submitting journal', error: error.message });
    }
  }

  static async uploadRevision(req, res) {
    try {
      const { ID_jurnal } = req.params;
      const { revision_notes } = req.body;
      const userId = req.user.ID_user;
      const file = req.file?.filename || null;

      console.log('📝 Upload Revision Request:', { ID_jurnal, userId, file, revision_notes });

      if (!file) {
        return res.status(400).json({ message: 'File is required' });
      }

      const journalCheck = await db('SELECT FK_ID_user, status, revision_count FROM jurnal WHERE ID_jurnal = ?', [ID_jurnal]);
      if (journalCheck.length === 0) {
        return res.status(404).json({ message: 'Journal not found' });
      }

      if (journalCheck[0].FK_ID_user !== userId) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      const versionNumber = journalCheck[0].revision_count + 1;

      const versionQuery = `
        INSERT INTO journal_versions 
        (ID_jurnal, FK_ID_user, version_number, file, description)
        VALUES (?, ?, ?, ?, ?)
      `;
      await db(versionQuery, [ID_jurnal, userId, versionNumber, file, revision_notes || null]);

      await db('UPDATE jurnal SET file = ?, revision_count = ?, status = ? WHERE ID_jurnal = ?', 
        [file, versionNumber, 'pending_review', ID_jurnal]);

      console.log('✅ Revision uploaded successfully for journal:', ID_jurnal);
      res.status(200).json({ message: 'Revision uploaded successfully' });
    } catch (error) {
      console.error('❌ Error uploading revision:', error.message);
      res.status(500).json({ message: 'Error uploading revision', error: error.message });
    }
  }

  static async updateJournal(req, res) {
    try {
      const { ID_jurnal } = req.params;
      const { title, writer, keyword, abstract, doi } = req.body;
      const userId = req.user.ID_user;

      const journalCheck = await db('SELECT FK_ID_user, status FROM jurnal WHERE ID_jurnal = ?', [ID_jurnal]);
      if (journalCheck.length === 0) {
        return res.status(404).json({ message: 'Journal not found' });
      }

      if (journalCheck[0].FK_ID_user !== userId) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      if (journalCheck[0].status !== 'draft') {
        return res.status(400).json({ message: 'Can only update draft journals' });
      }

      const query = `
        UPDATE jurnal
        SET title = ?, writer = ?, keyword = ?, abstract = ?, doi = ?
        WHERE ID_jurnal = ?
      `;
      await db(query, [title, writer, keyword, abstract, doi, ID_jurnal]);

      res.status(200).json({ message: 'Journal updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating journal', error: error.message });
    }
  }

  static async deleteJournal(req, res) {
    try {
      const { ID_jurnal } = req.params;
      const userId = req.user.ID_user;

      const journalCheck = await db('SELECT FK_ID_user, status FROM jurnal WHERE ID_jurnal = ?', [ID_jurnal]);
      if (journalCheck.length === 0) {
        return res.status(404).json({ message: 'Journal not found' });
      }

      if (journalCheck[0].FK_ID_user !== userId) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      if (journalCheck[0].status !== 'draft') {
        return res.status(400).json({ message: 'Can only delete draft journals' });
      }

      await db('DELETE FROM jurnal WHERE ID_jurnal = ?', [ID_jurnal]);
      res.status(200).json({ message: 'Journal deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting journal', error: error.message });
    }
  }
}

module.exports = AuthorJournalController;
