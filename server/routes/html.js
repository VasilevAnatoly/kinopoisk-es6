import express from 'express';
import path from 'path';

const rootPath = process.cwd() + '/';

const router = express.Router();

router.get('/', function (req, res) {
    res.sendFile(path.join(rootPath, 'public/', 'kinopoisk.html'));
});

module.exports = router;