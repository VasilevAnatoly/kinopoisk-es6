const express = require('express');
const path = require('path');

const rootPath = process.cwd() + '/';

var router = express.Router();

router.get('/', function (req, res) {
    res.sendFile(path.join(rootPath, 'public/', 'kinopoisk.html'));
});

module.exports = router;