const queryAsync = require('./src/utils/db');

(async () => {
  try {
    const users = await queryAsync('SELECT ID_user, name, email, role FROM users LIMIT 5');
    console.log('Users in database:');
    console.table(users);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    process.exit(0);
  }
})();
