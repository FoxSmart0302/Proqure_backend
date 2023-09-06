const passport = require('passport');
const express = require('express');
const { escapeHTMLMiddleware } = require('../utils');
const router = express.Router();
const inboxController = require('../controllers/inboxController');

router.post('/inboxlist', inboxController.inboxlist);
router.post('/register', passport.authenticate('jwt', { session: false }), inboxController.register);
router.post('/delete', passport.authenticate('jwt', { session: false }), inboxController.delete);
router.post('/makeread', passport.authenticate('jwt', { session: false }), inboxController.makeread);

module.exports = router;