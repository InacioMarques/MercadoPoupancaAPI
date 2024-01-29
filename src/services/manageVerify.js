const databaseUser = require('../config/databaseUsers');
const databaseAdmin = require('../config/databaseAdmin');

exports.getVerify = async(req, res) => {
    let id = req.query.id;

    if(id !== undefined || id !== null || id !== ''){
        let verifyData = await databaseUser.searchDB(`* FROM verified WHERE id = '${id}'`);

        if(verifyData.length == 1){
            let verifyUser = await databaseAdmin.updateDB(`client SET verified = 1 WHERE email = '${verifyData[0].email}'`);

            if(verifyUser.affectedRows == 1){
                let deleteVerify = await databaseAdmin.deleteDB(`FROM verified WHERE email = '${verifyData[0].email}'`);

                if(deleteVerify.affectedRows == 1){
                    res.status(200).send('Account verified')
                }
            }
        } else {
            res.status(404).send('Acount already verified or not found')
        }
    } else {
        res.status(400).send('bad query parameter')
    }
}