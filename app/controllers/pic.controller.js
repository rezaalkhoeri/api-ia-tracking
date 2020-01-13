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
            let data = [
                {key : 'ID_FUNGSI', value : idFungsi},
                {key : 'AccountTipe', value : accountType},
                {key : 'EmailPekerja', value : emailPekerja},
                {key : 'Status', value : '1'},
            ]
            
            let insert =  await PICModel.save(data);
    
            if (insert.success == true) {
                res.status(200).send(
                    parseResponse(true, data, '00', 'Insert PIC Data Controller Success')
                )
            }                
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
                parseResponse(true, data, '00', 'Request Not Found')
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