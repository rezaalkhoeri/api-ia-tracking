const StatusController       = {}
const StatusModel            = require('../models/status.model');
const parseResponse         = require('../helpers/parse-response')
const log                   = 'Status controller';

StatusController.getStatusController = async(req, res, next) => {
    console.log(`├── ${log} :: Get Status Controller`);

    try{
        let dbStatus = await StatusModel.getAll('*', []);

        // success
        res.status(200).send(
            parseResponse(true, dbStatus, '00', 'Get Status Controller Success')
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

module.exports = StatusController