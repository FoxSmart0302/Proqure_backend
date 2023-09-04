const passport = require('passport');
const express = require('express');
const router = express.Router();

const { escapeHTMLMiddleware } = require('../utils');
const clientController = require('../controllers/clientController');

router.post('/clientlist',passport.authenticate('jwt', { session: false }), clientController.clientlist);
router.post('/register', passport.authenticate('jwt', { session: false }), clientController.register);
router.post('/edit', passport.authenticate('jwt', { session: false }), clientController.edit);
router.post('/delete', passport.authenticate('jwt', { session: false }), clientController.delete);

module.exports = router;