const passport = require('passport');
const express = require('express');
const { escapeHTMLMiddleware } = require('../utils');
const router = express.Router();
const sentController = require('../controllers/sentController');

router.post('/sentlist', sentController.sentlist);
router.post('/register', passport.authenticate('jwt', { session: false }), sentController.register);
router.post('/delete', passport.authenticate('jwt', { session: false }), sentController.delete);

router.post('/messagelist', passport.authenticate('jwt', { session: false }), sentController.messagelist);
router.post('/messagedelete', passport.authenticate('jwt', { session: false }), sentController.messagedelete);

module.exports = router;