const passport = require('passport');
const express = require('express');
const router = express.Router();

const { escapeHTMLMiddleware } = require('../utils');
const userController = require('../controllers/userController');

router.post('/login', userController.login);
router.post('/register', userController.register);
router.post('/userlist', userController.userlist);
router.get('/current', passport.authenticate('jwt', { session: false }), userController.current);
router.post('/edit', passport.authenticate('jwt', { session: false }), userController.edit);
router.post('/delete', passport.authenticate('jwt', { session: false }), userController.delete);
router.post('/changestatus', passport.authenticate('jwt', { session: false }), userController.changestatus);

module.exports = router;