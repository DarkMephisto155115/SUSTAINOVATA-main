const db = require('../../utils/db');

class JournalReviewController {
  static async getPendingJournals(req, res) {
    try {
      const query = `
        SELECT j.*, u.name as author_name
        FROM jurnal j
        JOIN users u ON j.FK_ID_user = u.ID_user
        WHERE j.status = 'pending_review'
        ORDER BY j.date_upload DESC
      `;
      const journals = await db(query);
      res.status(200).json({ data: journals });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching journals', error: error.message });
    }
  }

  static async getAllJournals(req, res) {
    try {
      const query = `
        SELECT j.*, u.name as author_name
        FROM jurnal j
        JOIN users u ON j.FK_ID_user = u.ID_user
        WHERE j.status IN ('pending_review', 'published', 'revision_needed', 'rejected')
        ORDER BY j.date_upload DESC
      `;
      const journals = await db(query);
      res.status(200).json({ data: journals });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching journals', error: error.message });
    }
  }

  static async getJournalDetail(req, res) {
    try {
      const { id } = req.params;
      const query = `
        SELECT j.*, u.name as author_name, u.email as author_email
        FROM jurnal j
        JOIN users u ON j.FK_ID_user = u.ID_user
        WHERE j.ID_jurnal = ?
      `;
      const journal = await db(query, [id]);
      
      if (journal.length === 0) {
        return res.status(404).json({ message: 'Journal not found' });
      }

      console.log(`\n📖 Journal Detail Request for ID: ${id}`);
      console.log(`   Title: ${journal[0].title}`);
      console.log(`   PDF File: ${journal[0].file}`);
      console.log(`   Cover Image: ${journal[0].cover_image}`);
      console.log(`   Status: ${journal[0].status}`);

      const reviewQuery = `
        SELECT * FROM journal_reviews
        WHERE ID_jurnal = ?
        ORDER BY created_at DESC
      `;
      const reviews = await db(reviewQuery, [id]);

      res.status(200).json({ data: journal[0], reviews });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching journal detail', error: error.message });
    }
  }

  static async createReview(req, res) {
    try {
      const { ID_jurnal, FK_ID_author, status, feedback, revision_notes } = req.body;
      const FK_ID_editor = req.user.ID_user;

      if (!ID_jurnal || !FK_ID_author || !status) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const query = `
        INSERT INTO journal_reviews 
        (ID_jurnal, FK_ID_editor, FK_ID_author, status, feedback, revision_notes)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      
      await db(query, [ID_jurnal, FK_ID_editor, FK_ID_author, status, feedback || null, revision_notes || null]);

      if (status === 'approved') {
        await db('UPDATE jurnal SET status = ? WHERE ID_jurnal = ?', ['published', ID_jurnal]);
      } else if (status === 'revision') {
        await db('UPDATE jurnal SET status = ? WHERE ID_jurnal = ?', ['revision_needed', ID_jurnal]);
      } else if (status === 'rejected') {
        await db('UPDATE jurnal SET status = ? WHERE ID_jurnal = ?', ['rejected', ID_jurnal]);
      }

      res.status(201).json({ message: 'Review created successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error creating review', error: error.message });
    }
  }

  static async updateReview(req, res) {
    try {
      const { ID_review } = req.params;
      const { status, feedback, revision_notes } = req.body;

      const query = `
        UPDATE journal_reviews
        SET status = ?, feedback = ?, revision_notes = ?
        WHERE ID_review = ?
      `;
      
      await db(query, [status, feedback || null, revision_notes || null, ID_review]);
      res.status(200).json({ message: 'Review updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating review', error: error.message });
    }
  }

  static async getEditorStats(req, res) {
    try {
      const editorId = req.user.ID_user;
      
      const pendingQuery = `SELECT COUNT(*) as count FROM journal_reviews WHERE FK_ID_editor = ? AND status = 'pending'`;
      const approvedQuery = `SELECT COUNT(*) as count FROM journal_reviews WHERE FK_ID_editor = ? AND status = 'approved'`;
      const revisionQuery = `SELECT COUNT(*) as count FROM journal_reviews WHERE FK_ID_editor = ? AND status = 'revision'`;

      const pending = await db(pendingQuery, [editorId]);
      const approved = await db(approvedQuery, [editorId]);
      const revision = await db(revisionQuery, [editorId]);

      res.status(200).json({
        data: {
          pendingReview: pending[0].count,
          approved: approved[0].count,
          needsRevision: revision[0].count
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching stats', error: error.message });
    }
  }
}

module.exports = JournalReviewController;
