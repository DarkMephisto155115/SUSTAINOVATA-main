const util = require("util");
const db = require("../config/db");

// Ubah db.query jadi fungsi berbasis Promise
const queryAsync = util.promisify(db.query).bind(db);

module.exports = queryAsync;
