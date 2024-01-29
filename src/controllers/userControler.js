const servicesUsers = require('../services/manageUsers');
const jtw = require('../utils/token');

exports.userGet = async (req, res) => {
    let query = req.query, data = req.body;

    switch(query.type){
        case 'login':
            servicesUsers.loginUser(data, res);
            break;
        case 'userInfo':
            jtw.validateToken(req, res, function callback(){
                servicesUsers.userInfo(req.user, res);
            });
            break;
        default:
            res.status(400).send('invalid query')
    }
};

exports.userPost = async (query, data, res) => {
    servicesUsers.registerUser(data, res);
};

exports.userPut = async (req, res) => {
    let querys = req.query;

    jtw.validateToken(req, res, function callback(){
        switch(querys.type){
            case 'password':
                    servicesUsers.newPasswordUser(req, res);
                break;
            case 'adress':
                    servicesUsers.putUserAdress(req, res);
                break;
            default:
                res.status(400).send('invalid query')
        } 
    });
};

exports.userDelete = async (req, res) => {
    jtw.validateToken(req, res, function callback(){
        servicesUsers.deleteUser(req, res);
    });
}