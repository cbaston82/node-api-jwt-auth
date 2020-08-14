const express = require('express');
const {signUp, signIn, signOut} = require('../controllers/auth');
const {userById} = require('../controllers/user');
const {userSignUpValidator} = require('../validator');

const router = express.Router();

router.post('/signUp', userSignUpValidator, signUp);
router.post('/signIn', signIn);
router.get('/signOut', signOut);

// any router containing userId, app will first execute userById
router.param('userId', userById);

module.exports = router;
