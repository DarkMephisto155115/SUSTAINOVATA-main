const db = require('../../utils/db');

class CollaborationController {
  static async createCollaboration(req, res) {
    try {
      console.log('📋 Create Collaboration Request');
      console.log('Body:', req.body);
      console.log('File:', req.file);
      console.log('User:', req.user);

      const { title, description, visibility } = req.body;
      const userId = req.user.ID_user;
      const document_file = req.file?.filename || null;

      if (!title || !document_file) {
        return res.status(400).json({ message: 'Title and document file are required' });
      }

      const query = `
        INSERT INTO collaborations 
        (title, description, document_file, owner_id, visibility, status)
        VALUES (?, ?, ?, ?, ?, 'active')
      `;
      
      const result = await db(query, [title, description || null, document_file, userId, visibility || 'private']);

      const membersQuery = `
        INSERT INTO collaboration_members (ID_collab, FK_ID_user, role)
        VALUES (?, ?, 'owner')
      `;
      await db(membersQuery, [result.insertId, userId]);

      console.log('✅ Collaboration created successfully:', result.insertId);
      res.status(201).json({ message: 'Collaboration created successfully', data: { ID_collab: result.insertId } });
    } catch (error) {
      console.error('❌ Error creating collaboration:', error.message);
      res.status(500).json({ message: 'Error creating collaboration', error: error.message });
    }
  }

  static async getMyCollaborations(req, res) {
    try {
      const userId = req.user.ID_user;
      const query = `
        SELECT c.*, u.name as owner_name,
               COUNT(DISTINCT cm.FK_ID_user) as member_count
        FROM collaborations c
        JOIN users u ON c.owner_id = u.ID_user
        LEFT JOIN collaboration_members cm ON c.ID_collab = cm.ID_collab
        WHERE c.owner_id = ? OR c.ID_collab IN (
          SELECT ID_collab FROM collaboration_members WHERE FK_ID_user = ?
        )
        GROUP BY c.ID_collab
        ORDER BY c.created_at DESC
      `;
      const collabs = await db(query, [userId, userId]);
      res.status(200).json({ data: collabs });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching collaborations', error: error.message });
    }
  }

  static async getCollaborationDetail(req, res) {
    try {
      const { ID_collab } = req.params;
      const userId = req.user.ID_user;

      const query = `
        SELECT c.*, u.name as owner_name
        FROM collaborations c
        JOIN users u ON c.owner_id = u.ID_user
        WHERE c.ID_collab = ?
      `;
      const collab = await db(query, [ID_collab]);

      if (collab.length === 0) {
        return res.status(404).json({ message: 'Collaboration not found' });
      }

      const membersQuery = `
        SELECT u.ID_user, u.name, u.email, cm.role, cm.added_at
        FROM collaboration_members cm
        JOIN users u ON cm.FK_ID_user = u.ID_user
        WHERE cm.ID_collab = ?
      `;
      const members = await db(membersQuery, [ID_collab]);

      res.status(200).json({ data: collab[0], members });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching collaboration detail', error: error.message });
    }
  }

  static async addMember(req, res) {
    try {
      const { ID_collab, FK_ID_user, role } = req.body;
      const userId = req.user.ID_user;

      const ownerCheck = await db('SELECT owner_id FROM collaborations WHERE ID_collab = ?', [ID_collab]);
      if (ownerCheck[0].owner_id !== userId) {
        return res.status(403).json({ message: 'Only owner can add members' });
      }

      const query = `
        INSERT INTO collaboration_members (ID_collab, FK_ID_user, role)
        VALUES (?, ?, ?)
      `;
      await db(query, [ID_collab, FK_ID_user, role || 'viewer']);

      res.status(201).json({ message: 'Member added successfully' });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'Member already exists' });
      }
      res.status(500).json({ message: 'Error adding member', error: error.message });
    }
  }

  static async removeMember(req, res) {
    try {
      const { ID_collab, FK_ID_user } = req.params;
      const userId = req.user.ID_user;

      const ownerCheck = await db('SELECT owner_id FROM collaborations WHERE ID_collab = ?', [ID_collab]);
      if (ownerCheck[0].owner_id !== userId) {
        return res.status(403).json({ message: 'Only owner can remove members' });
      }

      await db('DELETE FROM collaboration_members WHERE ID_collab = ? AND FK_ID_user = ?', [ID_collab, FK_ID_user]);
      res.status(200).json({ message: 'Member removed successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error removing member', error: error.message });
    }
  }

  static async updateCollaboration(req, res) {
    try {
      const { ID_collab } = req.params;
      const { title, description, visibility, status } = req.body;
      const userId = req.user.ID_user;

      const ownerCheck = await db('SELECT owner_id FROM collaborations WHERE ID_collab = ?', [ID_collab]);
      if (ownerCheck[0].owner_id !== userId) {
        return res.status(403).json({ message: 'Only owner can update collaboration' });
      }

      const query = `
        UPDATE collaborations
        SET title = ?, description = ?, visibility = ?, status = ?
        WHERE ID_collab = ?
      `;
      await db(query, [title, description, visibility, status, ID_collab]);

      res.status(200).json({ message: 'Collaboration updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating collaboration', error: error.message });
    }
  }

  static async deleteCollaboration(req, res) {
    try {
      const { ID_collab } = req.params;
      const userId = req.user.ID_user;

      const ownerCheck = await db('SELECT owner_id FROM collaborations WHERE ID_collab = ?', [ID_collab]);
      if (ownerCheck[0].owner_id !== userId) {
        return res.status(403).json({ message: 'Only owner can delete collaboration' });
      }

      await db('DELETE FROM collaborations WHERE ID_collab = ?', [ID_collab]);
      res.status(200).json({ message: 'Collaboration deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting collaboration', error: error.message });
    }
  }
}

module.exports = CollaborationController;
