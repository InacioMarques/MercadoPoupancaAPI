const servicesProduct = require('../services/manageProduct')

exports.search = async(query, data, res) => {
    switch(query.type){
        case 'name':
            servicesProduct.searchProductName(data, res);
            break;

        case 'barcode':
            servicesProduct.searchProductBarcode(data, res);
            break;
        
        case 'order':
            switch(query.market){
                case'Mercadona':
                    servicesProduct.searchProductOrder(query.order, 1, {}, res)
                break;

                case'Pingo Doce':
                    servicesProduct.searchProductOrder(query.order, 2, {}, res)
                break;

                case'Aldi':
                    servicesProduct.searchProductOrder(query.order, 3, {}, res)
                break;

                case'Lidl':
                    servicesProduct.searchProductOrder(query.order, 4, {}, res)
                break;

                case'Continente':
                    servicesProduct.searchProductOrder(query.order, 5, {}, res)
                break;
                default:
                    servicesProduct.searchProductOrder(query.order, 0, {}, res)
            }
        break;

        default:
            servicesProduct.searchProductAll(data, res);
    }
};

exports.insertProduct = async(query, data, res) => {
    servicesProduct.postProduct(data, res);
};

exports.updateProduct = async(query, data, res) => {
    servicesProduct.putProductPrice(data, res)
};

exports.deleteProduct = async(query, data, res) => {
    let lenght = Object.keys(data).length;

    if(lenght >= 1){
        servicesProduct.deleteProduct(data, res);
    } else {
        res.status(400).send("missing body request");
    }
};