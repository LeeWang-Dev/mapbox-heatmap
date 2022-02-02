const path = require("path");
const fs = require("fs");
const express = require("express");
const router = express.Router();

const dataPath = path.resolve("./") + '/data/features.geojson';

// READ
router.get('/features', (req, res) => {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            throw err;
        }

        res.send(JSON.parse(data));

    });
});

module.exports = router;