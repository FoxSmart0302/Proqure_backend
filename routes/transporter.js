const passport = require('passport');
const express = require('express');
const router = express.Router();

const { escapeHTMLMiddleware } = require('../utils');
const transporterController = require('../controllers/transporterController');

router.post('/register', passport.authenticate('jwt', { session: false }), transporterController.register);
router.post('/list', passport.authenticate('jwt', { session: false }), transporterController.list);
router.post('/edit', passport.authenticate('jwt', { session: false }), transporterController.edit);
router.post('/delete', passport.authenticate('jwt', { session: false }), transporterController.delete);
router.get('/current', passport.authenticate('jwt', { session: false }), transporterController.current);

module.exports = router;