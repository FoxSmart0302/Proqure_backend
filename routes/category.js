const passport = require('passport');
const express = require('express');
const { escapeHTMLMiddleware } = require('../utils');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.post('/categorylist', categoryController.categorylist);
router.post('/itemlist', categoryController.itemlist);
router.post('/item', categoryController.item);
router.post('/related', categoryController.related);

module.exports = router;