const databaseUsers = require('../config/databaseUsers')

exports.getAds = async (req, res) =>{
    let ads = await databaseUsers.searchDB('* FROM publicity');

    if(ads.length >= 1){
        res.status(200).json(ads);
    } else {
        res.status(404).send('error while getting ads')
    }
};