const passport = require('passport');
const express = require('express');
const router = express.Router();

const { escapeHTMLMiddleware } = require('../utils');
const itemController = require('../controllers/itemController');

router.post('/addwishitem', passport.authenticate('jwt', { session: false }), escapeHTMLMiddleware, itemController.addwishitem);
router.post('/deletewishitem', passport.authenticate('jwt', { session: false }), escapeHTMLMiddleware, itemController.deletewishitem);
module.exports = router;