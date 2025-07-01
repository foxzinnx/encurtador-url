const express = require('express');
const apiController = require('../controllers/api.controller');
const authController = require('../controllers/auth.controller');
const router = express.Router();

router.get('/ping', (req, res) => {
    res.json({pong: true});
});

router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.post('/api/shorten', authController.verifyToken, apiController.shorten);
router.get('/:shortUrl', apiController.shortUrl);

module.exports = router;