const express = require('express');
const router = express.Router();
const path = require('path');
const admin = require('../controllers/admin/adminControllers');
const { createUploader } = require('../utils/uploads');
const { verifyToken, authorize } = require('../middlewares/authorization');

router.use(verifyToken);
router.use(authorize('admin', 'editor'));

router.get('/dashboard', admin.dashboard);

const uploadJurnal = createUploader((req, file) => {
  if (file.fieldname === 'file') return path.join(__dirname, '../fileSaved/pdf');
  if (file.fieldname === 'cover_image') return path.join(__dirname, '../fileSaved/images/jurnal');
  return path.join(__dirname, '../fileSaved/other');
});
const uploadBerita = createUploader(() => path.join(__dirname, '../fileSaved/images/berita'));
const uploadProgram = createUploader(() => path.join(__dirname, '../fileSaved/images/program'));

router.get('/jurnal', admin.getAllJurnal);
router.delete('/jurnal/:id', admin.deleteJurnal);
router.put('/jurnal/:id', uploadJurnal.fields([
  { name: 'file', maxCount: 1 },
  { name: 'cover_image', maxCount: 1 }
]), admin.editJurnal);


router.get('/programs', admin.getAllPrograms);
router.delete('/delete/programs/:id', admin.deleteProgram);
router.put('/programs/:id', uploadProgram.single('poster'), admin.editProgram);

router.get('/berita', admin.getAllBerita);
router.delete('/delete/berita/:id', admin.deleteBerita);
router.put('/berita/:id', uploadBerita.single('cover'), admin.editBerita);

router.get('/messages', admin.getContactMessages);
router.get('/messages/:id', admin.getContactMessageDetail);
router.put('/messages/:id/status', admin.updateMessageStatus);
router.delete('/messages/:id', admin.deleteContactMessage);

module.exports = router;