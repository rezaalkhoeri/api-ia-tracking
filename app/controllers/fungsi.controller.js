const FungsiController         = {}
const FungsiModel              = require('../models/fungsi.model');
const parseResponse         = require('../helpers/parse-response')
const log                   = 'Fungsi controller';

FungsiController.getFungsiController = async(req, res, next) => {
    console.log(`├── ${log} :: Get Fungsi Controller`);

    try{
        let dbFungsi = await FungsiModel.getAll('*', []);

        // success
        res.status(200).send(
            parseResponse(true, dbFungsi, '00', 'Get Fungsi Controller Success')
        )
    } catch(error) {
        console.log('Error exception :' + error)
        let resp = parseResponse(false, null, '99', error)
        next({
            resp,
            status: 500
        })
    }
}

module.exports = FungsiController