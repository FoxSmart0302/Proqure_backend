const passport = require('passport');
const express = require('express');
const { escapeHTMLMiddleware } = require('../utils');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.post('/categorylist', categoryController.categorylist);
router.post('/itemlist', categoryController.itemlist);
router.post('/item', categoryController.item);
router.post('/related', categoryController.related);

router.post('/register', passport.authenticate('jwt', { session: false }), categoryController.register);
router.post('/edit', passport.authenticate('jwt', { session: false }), categoryController.edit);
router.post('/delete', passport.authenticate('jwt', { session: false }), categoryController.delete);
module.exports = router;