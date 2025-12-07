const express = require('express');
const router = express.Router();
const JournalReviewController = require('../controllers/editor/journalReviewController');
const CollaborationController = require('../controllers/editor/collaborationController');
const CollaborationRequestsController = require('../controllers/editor/collaborationRequestsController');
const { verifyToken, authorize } = require('../middlewares/authorization');
const { createUploader } = require('../utils/uploads');

const uploadCollab = createUploader(() => 'src/fileSaved/collaborations');

router.use(verifyToken);
router.use(authorize('editor'));

router.get('/dashboard/stats', JournalReviewController.getEditorStats);

router.get('/journals', JournalReviewController.getAllJournals);
router.get('/journals/pending', JournalReviewController.getPendingJournals);
router.get('/journals/:id', JournalReviewController.getJournalDetail);
router.post('/journals/:id/review', JournalReviewController.createReview);
router.put('/reviews/:ID_review', JournalReviewController.updateReview);

router.post('/collaborations', uploadCollab.single('document_file'), CollaborationController.createCollaboration);
router.get('/collaborations', CollaborationController.getMyCollaborations);
router.get('/collaborations/:ID_collab', CollaborationController.getCollaborationDetail);
router.put('/collaborations/:ID_collab', CollaborationController.updateCollaboration);
router.delete('/collaborations/:ID_collab', CollaborationController.deleteCollaboration);

router.post('/collaborations/:ID_collab/members', CollaborationController.addMember);
router.delete('/collaborations/:ID_collab/members/:FK_ID_user', CollaborationController.removeMember);

router.get('/collaboration-requests', CollaborationRequestsController.getCollaborationRequests);
router.get('/collaboration-requests/:id', CollaborationRequestsController.getCollaborationRequestDetail);
router.put('/collaboration-requests/:id/accept', CollaborationRequestsController.acceptCollaborationRequest);
router.put('/collaboration-requests/:id/reject', CollaborationRequestsController.rejectCollaborationRequest);
router.post('/collaboration-requests', CollaborationRequestsController.createCollaborationRequest);

module.exports = router;
