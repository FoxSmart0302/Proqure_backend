const passport = require('passport');
const express = require('express');
const router = express.Router();

const { escapeHTMLMiddleware } = require('../utils');
const itemController = require('../controllers/itemController');

router.post('/addwishitem', passport.authenticate('jwt', { session: false }), escapeHTMLMiddleware, itemController.addwishitem);
router.post('/removewishitem', passport.authenticate('jwt', { session: false }), escapeHTMLMiddleware, itemController.removewishitem);
router.post('/addcartitem', passport.authenticate('jwt', { session: false }), escapeHTMLMiddleware, itemController.addcartitem);
router.post('/removecartitem', passport.authenticate('jwt', { session: false}), escapeHTMLMiddleware, itemController.removecartitem);
router.post('/quantitychange', passport.authenticate('jwt', {session: false}), itemController.quantitychange);
router.post('/addtobagitem', passport.authenticate('jwt', {session: false}), escapeHTMLMiddleware, itemController.addtobagitem);
module.exports = router;