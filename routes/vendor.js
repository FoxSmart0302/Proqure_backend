const passport = require('passport');
const express = require('express');
const router = express.Router();

const { escapeHTMLMiddleware } = require('../utils');
const vendorController = require('../controllers/vendorController');

router.post('/login', vendorController.login);
router.post('/register', vendorController.register);
router.post('/vendorlist', vendorController.vendorlist);
router.get('/current', passport.authenticate('jwt', { session: false }), vendorController.current);
router.post('/edit', passport.authenticate('jwt', { session: false }), vendorController.edit);
router.post('/delete', passport.authenticate('jwt', { session: false }), vendorController.delete);

module.exports = router;