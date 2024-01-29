const express = require('express');
const controller = require('../controllers/catalogController');

const router = express.Router();

router.get("/", async(req, res) =>{
    controller.catalogGet(req, res);
});

module.exports = router;