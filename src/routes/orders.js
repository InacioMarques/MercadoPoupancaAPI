const express = require('express');
const controller = require('../controllers/orderController');

const router = express.Router();

router.get("/", async(req, res) =>{
    controller.getOrder(req, res);
});

router.post("/", async(req, res) =>{
    controller.postOrder(req, res);
});

router.put("/", async(req, res) =>{
    controller.putOrder(req, res);
});

router.delete("/", async(req, res) =>{
    controller.deleteOrder(req, res);
});

module.exports = router;