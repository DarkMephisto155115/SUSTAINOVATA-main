const express = require('express');
const router = express.Router();
const AuthorJournalController = require('../controllers/client/authorJournalController');
const { verifyToken } = require('../middlewares/authorization');
const { createUploader } = require('../utils/uploads');

const uploadJournal = createUploader((req, file) => {
  if (file.fieldname === 'file') return 'src/fileSaved/pdf';
  if (file.fieldname === 'cover_image') return 'src/fileSaved/images/jurnal';
  return 'src/fileSaved/other';
});

router.use(verifyToken);

router.post('/journals', uploadJournal.fields([
  { name: 'file', maxCount: 1 },
  { name: 'cover_image', maxCount: 1 }
]), AuthorJournalController.createJournal);

router.get('/journals', AuthorJournalController.getMyJournals);
router.get('/journals/:id', AuthorJournalController.getJournalDetail);
router.put('/journals/:id', uploadJournal.fields([
  { name: 'file', maxCount: 1 },
  { name: 'cover_image', maxCount: 1 }
]), AuthorJournalController.updateJournal);
router.delete('/journals/:id', AuthorJournalController.deleteJournal);

router.post('/journals/:ID_jurnal/submit-review', AuthorJournalController.submitForReview);
router.post('/journals/:ID_jurnal/upload-revision', uploadJournal.single('file'), AuthorJournalController.uploadRevision);

module.exports = router;
