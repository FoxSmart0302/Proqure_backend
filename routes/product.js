const passport = require('passport');
const express = require('express');
const router = express.Router();

const { escapeHTMLMiddleware } = require('../utils');
const productController = require('../controllers/productController');

router.post('/register', passport.authenticate('jwt', { session: false }), productController.register);
router.post('/productlist', passport.authenticate('jwt', { session: false }), productController.list);
router.post('/edit', passport.authenticate('jwt', { session: false }), productController.edit);
router.post('/delete', passport.authenticate('jwt', { session: false }), productController.delete);
router.get('/current', passport.authenticate('jwt', { session: false }), productController.current);

module.exports = router;