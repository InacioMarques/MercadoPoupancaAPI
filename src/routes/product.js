const express = require('express')
const controller = require('../controllers/productController')
const utilities = require("../utils/token");
const model = require('../models/auth')

const router = express.Router();

router.get("/", (req, res) => {
    controller.search(req.query, req.body, res);
});

router.post("/", (req, res) => {
    utilities.validateToken(req, res, function callback (){
        model.verify(req.user, function callback(verify, market){
            if(verify == true){
                req.body.market = market;

                
                controller.insertProduct(req.query, req.body, res);
            } else {
                res.status(403).send('Something missing on token or without permission');
            }
        });
    });
});

router.put("/", (req, res) => {
    utilities.validateToken(req, res, function callback(){
        model.verify(req.user, function callback(verify, market){
            if(verify == true){
                req.body.market = market;
    
                controller.updateProduct(req.query, req.body, res);
            } else {
                res.status(403).send('Something missing on token or without permission');
            }
        });
    });
})

router.delete("/", (req, res) => {
    utilities.validateToken(req, res, function callback(){
        model.verify(req.user, function callback(verify){
            if(verify == true){
                req.body.market = market;
    
                controller.deleteProduct(req.query, req.body, res);
            } else {
                res.status(403).send('Something missing on token or without permission');
            }
        });
    });
})
module.exports = router;