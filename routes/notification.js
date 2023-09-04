const passport = require('passport');
const express = require('express');
const { escapeHTMLMiddleware } = require('../utils');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.post('/notificationlist', notificationController.notificationlist);
router.post('/register', passport.authenticate('jwt', { session: false }), notificationController.register);
router.post('/edit', passport.authenticate('jwt', { session: false }), notificationController.edit);
router.post('/delete', passport.authenticate('jwt', { session: false }), notificationController.delete);
module.exports = router;