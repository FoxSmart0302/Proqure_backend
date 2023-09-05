const passport = require('passport');
const express = require('express');
const { escapeHTMLMiddleware } = require('../utils');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.post('/notificationlist', notificationController.notificationlist);
router.post('/register', passport.authenticate('jwt', { session: false }), notificationController.register);
router.post('/delete', passport.authenticate('jwt', { session: false }), notificationController.delete);

router.post('/notificationlist', notificationController.messagelist);
router.post('/messagedelete', passport.authenticate('jwt', { session: false }), notificationController.messagedelete);

module.exports = router;