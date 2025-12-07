const express = require('express');
const router = express.Router();
const authControllers = require('./../controllers/authControllers');
const clients = require('./../controllers/client/clientControllers');
const multer = require('multer');
const path = require('path');

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/png', 'image/jpeg', 'image/gif'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

router.post('/register', authControllers.registerUser);
router.post('/login', authControllers.loginUser);

router.get('/home', clients.getHome)
router.get('/about', clients.getAbout)
router.get('/program', clients.getPrograms)
router.get('/programs/:id', clients.getProgramDetail)
router.get('/berita', clients.getBerita)
router.get('/news/:id', clients.getNewsDetail)
router.get('/publications/:id', clients.getPublicationDetail)
router.get('/jurnal', clients.getJurnal)
router.get('/publikasi', clients.getPublications)
router.get('/riset', clients.getResearch)
router.get('/research/:id', clients.getResearchDetail)
router.get('/resources/:id', clients.getResourceDetail)

router.post('/contact', upload.single('attachment'), clients.submitContactMessage);
router.get('/team', clients.getTeamMembers);
router.get('/partners', clients.getPartners);
router.put('/profile', clients.updateUserProfile);
router.get('/profile', clients.getUserProfile);
router.post('/collaboration-request', clients.submitCollaborationRequest);

module.exports = router;
