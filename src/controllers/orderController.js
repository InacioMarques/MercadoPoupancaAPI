const service = require('../services/manageOrders');
const jwt = require('../utils/token');
const model = require('../models/auth');

exports.getOrder = async(req, res) => {
    switch(req.query.type){
        case 'user':
            jwt.validateToken(req, res, function callback(){
                service.getOrder(req, res);
            });
        break;
        case 'admin':
            jwt.validateToken(req, res, function callback(){
                model.verifyAdminApp(req.user, function callback (value){
                    if(value == true){
                        service.getOrderAdmin(req, res)
                    } else {
                        res.status(403).send('Without perms')
                    }
                })
            });
        break;
        default:
            res.status(400).send('whitout query parameter')
    }
};

exports.postOrder = async(req, res) => {
    jwt.validateToken(req, res, function callback(){
        service.postOrder(req, res);
    });
};

exports.putOrder = async(req, res) => {
    let querys = req.querys;
    jwt.validateToken(req, res, function callback(){
        model.verifyAdminApp(req.user, function callback(value){
            if(value == true){
                switch(querys.type){
                    case 'changeOrderStatus':
                        service.putStatusOrder(req, res);
                        break;
                    default:
                        res.status(400).send('Bad querys in use');
                };
            } else {
                res.status(403).send('Without perms')
            }
        });
    });
}

exports.deleteOrder = async(req, res) => {
    jwt.validateToken(req, res, function callback(){
        model.verifyAdminApp(req.user, function callback(value){
            if(value == true){
                service.deleteOrder(req, res);
            } else {
                res.status(403).send('Without perms')
            }
        });
    });
}