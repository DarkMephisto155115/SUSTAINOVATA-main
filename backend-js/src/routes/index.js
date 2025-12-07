const express = require('express');
const router = express.Router();

const clientRoutes = require('./clientRoutes');
const adminRoutes = require('./adminRoutes');
const editorRoutes = require('./editorRoutes');
const authorRoutes = require('./authorRoutes');
const userRoutes = require('./userRoutes');
const uploads = require('./uploadFile');
const images = require('./images');

router.use('/clients', clientRoutes); 
router.use('/admin', adminRoutes); 
router.use('/editor', editorRoutes);
router.use('/author', authorRoutes);
router.use('/users', userRoutes);
router.use('/uploads', uploads);
router.use('/images', images);

module.exports = router;