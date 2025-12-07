const queryAsync = require('../utils/db');

exports.getEditors = async (req, res) => {
  try {
    const editors = await queryAsync(
      `SELECT ID_user, name, email, phone, bio 
       FROM users 
       WHERE role = ? 
       ORDER BY name ASC`,
      ['editor']
    );

    res.status(200).json({
      success: true,
      data: editors,
      total: editors.length
    });
  } catch (error) {
    console.error('Error fetching editors:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
