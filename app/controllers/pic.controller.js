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

PICController.getPICByIDController = async(req, res, next) => {
    console.log(`├── ${log} :: Get PIC By ID Controller`);

    try{
        let id = req.params.ID
        let where = [{ key: 'ID', value: id }]

        let sql = await PICModel.getAll('*', where)

        // success
        res.status(200).send(
            parseResponse(true, sql, '00', 'Get PIC By ID Controller Success')
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

PICController.postPICController = async(req, res, next) => {
    console.log(`├── ${log} :: Post PIC Data Controller`);

    try {

        let { action, idFungsi, accountType, emailPekerja } = req.body

        if (action == "create") {

            let condition = [{ key:'EmailPekerja', value:emailPekerja }]
            let checkEmail = await PICModel.getAll('*',condition)
            
            if (checkEmail.length > 0) {
                // Email already exists
                statusCode      = 200
                responseCode    = '44'
                message         = 'Email already exists !'
                acknowledge     = false
                result          = null
            } else {
                let data = [
                    {key : 'ID_FUNGSI', value : idFungsi},
                    {key : 'AccountTipe', value : accountType},
                    {key : 'EmailPekerja', value : emailPekerja},
                    {key : 'Status', value : '1'},
                ]
                
                let insert =  await PICModel.save(data);
        
                if (insert.success == true) {
                    statusCode      = 200
                    responseCode    = '00'
                    message         = 'Insert PIC Data Controller Success'
                    acknowledge     = true
                    result          = data
                }                
            }

            res.status(statusCode).send(
                parseResponse(acknowledge, result, responseCode, message)
            )
        } else if (action == "update") {
            let { id, status } = req.body 
            let where = [{key:'ID', value:id}]
            let data = [
                {key : 'ID_FUNGSI', value : idFungsi},
                {key : 'AccountTipe', value : accountType},
                {key : 'EmailPekerja', value : emailPekerja},
                {key : 'Status', value : status},
            ]
            
            let update =  await PICModel.save(data, where);    
            
            if (update.success == true) {
                res.status(200).send(
                    parseResponse(true, data, '00', 'Update PIC Data Controller Success')
                )
            }                

        } else {
            let data = [
                {key:'response', value:'404'},
                {key:'data', value:'Request Not Found'}
            ]
            res.status(200).send(
                parseResponse(true, data, '404', 'Request Not Found')
            )
        }

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