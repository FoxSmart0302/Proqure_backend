const passport = require('passport');
const express = require('express');
const router = express.Router();

const { escapeHTMLMiddleware } = require('../utils');
const productController = require('../controllers/productController');

router.post('/productlist', passport.authenticate('jwt', { session: false }), productController.list);
router.post('/register', passport.authenticate('jwt', { session: false }), productController.register);
router.post('/edit', passport.authenticate('jwt', { session: false }), productController.edit);
router.post('/delete', passport.authenticate('jwt', { session: false }), productController.delete);

module.exports = router;