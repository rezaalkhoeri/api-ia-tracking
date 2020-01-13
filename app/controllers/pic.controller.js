const PICController         = {}
const PICModel              = require('../models/pic.model');
const parseResponse         = require('../helpers/parse-response')
const log                   = 'PIC controller';

PICController.getPICController = async(req, res, next) => {
    console.log(`├── ${log} :: Get PIC Controller`);

    try{
        let dbPIC = await PICModel.getAll('*', []);

        // success
        res.status(200).send(
            parseResponse(true, dbPIC, '00', 'Get PIC Controller Success')
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

module.exports = PICController