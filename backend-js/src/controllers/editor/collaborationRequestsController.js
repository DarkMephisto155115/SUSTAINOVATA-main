const queryAsync = require('../../utils/db');

exports.getCollaborationRequests = async (req, res) => {
  try {
    const requests = await queryAsync(
      `SELECT * FROM collaboration_requests
       ORDER BY created_at DESC`
    );

    res.status(200).json({
      success: true,
      data: requests,
      total: requests.length
    });
  } catch (error) {
    console.error('Error fetching collaboration requests:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.getCollaborationRequestDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await queryAsync(
      `SELECT * FROM collaboration_requests WHERE ID_request = ?`,
      [id]
    );

    if (request.length === 0) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    res.status(200).json({ success: true, data: request[0] });
  } catch (error) {
    console.error('Error fetching request detail:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.acceptCollaborationRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const editorId = req.user.ID_user;

    const request = await queryAsync(
      'SELECT * FROM collaboration_requests WHERE ID_request = ?',
      [id]
    );

    if (request.length === 0) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (request[0].status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Request has already been processed' });
    }

    await queryAsync(
      `UPDATE collaboration_requests 
       SET status = 'accepted',
           to_editor_id = ?,
           reviewed_at = NOW(),
           updated_at = NOW()
       WHERE ID_request = ?`,
      [editorId, id]
    );

    res.status(200).json({ success: true, message: 'Collaboration request accepted' });
  } catch (error) {
    console.error('Error accepting request:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.rejectCollaborationRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejection_reason } = req.body;
    const editorId = req.user.ID_user;

    if (!rejection_reason || !rejection_reason.trim()) {
      return res.status(400).json({ success: false, message: 'Rejection reason is required' });
    }

    const request = await queryAsync(
      'SELECT * FROM collaboration_requests WHERE ID_request = ?',
      [id]
    );

    if (request.length === 0) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (request[0].status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Request has already been processed' });
    }

    await queryAsync(
      `UPDATE collaboration_requests 
       SET status = 'rejected',
           to_editor_id = ?,
           rejection_reason = ?,
           reviewed_at = NOW(),
           updated_at = NOW()
       WHERE ID_request = ?`,
      [editorId, rejection_reason, id]
    );

    res.status(200).json({ success: true, message: 'Collaboration request rejected' });
  } catch (error) {
    console.error('Error rejecting request:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.createCollaborationRequest = async (req, res) => {
  try {
    const { to_editor_id, title, description, document_id } = req.body;
    const fromUserId = req.user.ID_user;

    if (!to_editor_id || !title) {
      return res.status(400).json({ 
        success: false, 
        message: 'Editor ID and title are required' 
      });
    }

    const editorExists = await queryAsync(
      'SELECT ID_user FROM users WHERE ID_user = ? AND role = ?',
      [to_editor_id, 'editor']
    );

    if (editorExists.length === 0) {
      return res.status(400).json({ success: false, message: 'Editor not found' });
    }

    const result = await queryAsync(
      `INSERT INTO collaboration_requests 
       (from_user_id, to_editor_id, title, description, document_id, status)
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [fromUserId, to_editor_id, title, description || null, document_id || null]
    );

    res.status(201).json({ 
      success: true, 
      message: 'Collaboration request created',
      data: { ID_request: result.insertId }
    });
  } catch (error) {
    console.error('Error creating collaboration request:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
