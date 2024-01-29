const databaseUsers = require('../config/databaseUsers');
const databaseAdmin = require('../config/databaseAdmin');
const jwt = require('../utils/token');
const bcrypt = require('bcrypt');
const model = require('../models/sqlQuery')
const nodemailer = require('../config/nodemail')

exports.loginUser = async (data, res) =>{
    let user = await databaseUsers.searchDB(`* FROM client WHERE email = '${data.email}'`);

    if(user.length >= 1){
        user = user[0];
        if(user.verified == 1){
            let verifyHash = bcrypt.compare(data.password, user.password);

            verifyHash
            .then((msg)=>{
                if(msg){
                    jwt.generateToken(data.email, function callback(token){
                        res.status(200).json([{token: token, admin: user.admin}]);
                    });
                } else {
                    res.status(401).send('wrong password');
                }
            });
        } else {
            res.status(403).send('user not verified');
        }
    } else {
        res.status(404).send('user not found');
    }
};

exports.userInfo = async (user, res) =>{
    let userEmail = user.user;
    
    let userInfo = await databaseUsers.searchDB(`* FROM client WHERE email = '${userEmail}'`);

    if(userInfo.length == 1){
        userInfo = userInfo[0];
        Object.keys(userInfo).forEach((key)=>{
            if(key == 'adress' || key == 'phoneNumber' || key == 'nif'){
                if(userInfo[key] == null){
                    userInfo[key] = '';
                }
            }
        });
        let reponse = {
            image: userInfo.image,
            name: userInfo.name,
            adress: userInfo.adress,
            phoneNumber: `${userInfo.phoneNumber}`,
            nif: `${userInfo.nif}`
        }
        res.status(200).json([reponse]);
    } else {
        res.status(404).send('user not found');
    }
};

exports.registerUser = async (data, res) =>{
    let verifyEmail = await databaseUsers.searchDB(`* FROM client WHERE email = '${data.email}'`);

    if(verifyEmail.length == 0){
        if((data.name !== undefined || data.name !== '') && (data.email !== undefined || data.email !== '') && (data.password !== undefined || data.password !== '')){
            data.password = await bcrypt.hash(data.password, 10);
            let registerUser = await databaseAdmin.insertDB(`client (name, email, password) VALUES ('${data.name}', '${data.email}', '${data.password}')`);

            if(registerUser.affectedRows == 1){
                let verified = await databaseAdmin.insertDB(`verified (email) VALUES ('${data.email}')`);

                if(verified.affectedRows == 1){
                    await nodemailer.sendVerify(data.email, verified.insertId);
                    res.status(200).json([{msg: "user registed"}]);
                }
            }
        } else {
            res.status(404).send('bad body request');
        }
    } else {
        res.status(409).send('email exist')
    }
};

exports.newPasswordUser = async (req, res) =>{
    let user = req.user.user, password = req.body.password, newPassword = req.body.newPassword; 
    let getUser = await databaseUsers.searchDB(`* FROM client WHERE email = '${user}'`);
    
    if(getUser.length >= 1){
        getUser = getUser[0];

        let verifyHash = bcrypt.compare(password, getUser.password)

        verifyHash
        .then(async (msg)=>{
            if(msg){
                let hash = await bcrypt.hash(newPassword, 10);
                let userUpdate = await databaseAdmin.updateDB(`client SET password = '${hash}' WHERE email = '${user}'`)
                
                if(userUpdate.affectedRows >= 1){
                    res.status(200).send('password changed');
                }
            } else {
                res.status(401).send('wrong password');
            }
        });
    } else {
        res.status(404).send('invalid user');
    }
};

exports.putUserAdress = async (req, res) =>{
    let user = req.user.user, adressInfo = req.body, callback;

    model.adressVerify(adressInfo, async function callback(msg){
        if(msg == true){
            let newAdressDB = await databaseAdmin.updateDB(`client SET image = '${adressInfo.image}', name = '${adressInfo.name}', adress = '${adressInfo.adress}', phoneNumber = '${adressInfo.phoneNumber}', nif = '${adressInfo.nif}' WHERE email = '${user}'`);

            if(newAdressDB.affectedRows >= 1){
                res.status(200).send('adress Update');
            }
        } else {
            res.status(404).send('bad body request')
        }
    });
};

exports.deleteUser = async (req, res) =>{
    let user = req.user.user;

    let deleteUserDB = await databaseAdmin.deleteDB(`FROM client WHERE email = '${user}'`);

    if(deleteUserDB.affectedRows >= 1){
        res.status(200).send('user deleted');
    }
}