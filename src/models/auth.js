const database = require('../config/databaseUsers')

exports.verify = async(user, callback) =>{
    let userEmail = user.user;

    if(userEmail !== null || userEmail !== undefined){
        let userDB = await database.searchDB(`* FROM client WHERE email = '${userEmail}'`);

        if(userDB.length == 1){
            userDB = userDB[0];
                
            if(userDB.admin == 1 && userDB.market !== 'null'){
                return callback(true, userDB.market);

            } else {
                return callback(false, 'null')
            }
        }
    }
}

exports.verifyAdminApp = async(user, callback) =>{
    let userEmail = user.user;
    
    if(userEmail !== null || userEmail !== undefined){
        let userDB = await database.searchDB(`* FROM client WHERE email = '${user.user}'`);

        if(userDB.length == 1){
            userDB = userDB[0];
                
            if(userDB.admin == 2){
                return callback(true);
            } else {
                return callback(false)
            }
        }
    }
}