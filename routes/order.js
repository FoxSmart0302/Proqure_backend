const passport = require('passport');
const express = require('express');
const { escapeHTMLMiddleware } = require('../utils');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/orderlist', orderController.orderlist);
router.post('/register', passport.authenticate('jwt', { session: false }), orderController.register);
router.post('/delete', passport.authenticate('jwt', { session: false }), orderController.delete);
router.post('/makeread', passport.authenticate('jwt', { session: false }), orderController.makeread);

module.exports = router;