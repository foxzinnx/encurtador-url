const express = require('express');
const apiController = require('../controllers/api.controller');
const router = express.Router();

router.get('/ping', (req, res) => {
    res.json({pong: true});
});

router.post('/api/shorten', apiController.shorten);
router.get('/:shortUrl', apiController.shortUrl);

module.exports = router;