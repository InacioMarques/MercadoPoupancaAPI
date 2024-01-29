const databaseUser = require('../config/databaseUsers');

exports.getPromo = async(req, res) => {
    let promo = req.query.code;

    if(promo !== undefined || promo !== null || promo !== ''){
        let promoData = await databaseUser.searchDB(`* FROM promo_code WHERE promoCode = '${promo}'`);

        if(promoData.length == 1){
            res.status(200).json([{promoCode: promoData[0].amount}])
        } else {
            res.status(404).send('promotion not found')
        }
    } else {
        res.status(400).send('bad query parameter')
    }
}