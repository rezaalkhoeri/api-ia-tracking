const AppDataController       = {}
const AppDataModel            = require('../models/apps.model');
const parseResponse         = require('../helpers/parse-response');
const log                   = 'Apps Data Controller';
const { generateToken, encryptPassword }    = require('../lib/jwt');

AppDataController.getAppDataController = async(req, res, next) => {
    console.log(`├── ${log} :: Get Users Data Controller`);

    try{
        let sql = await AppDataModel.getAll('*', []);

        // success
        res.status(200).send(
            parseResponse(true, sql, '00', 'Get App Data Controller Success')
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


module.exports = AppDataController
