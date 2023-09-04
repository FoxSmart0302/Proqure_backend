const passport = require('passport');
const express = require('express');
const { escapeHTMLMiddleware } = require('../utils');
const router = express.Router();
const segmentController = require('../controllers/segmentController');

router.post('/segmentlist', segmentController.segmentlist);
router.post('/register', passport.authenticate('jwt', { session: false }), segmentController.register);
router.post('/edit', passport.authenticate('jwt', { session: false }), segmentController.edit);
router.post('/delete', passport.authenticate('jwt', { session: false }), segmentController.delete);
module.exports = router;