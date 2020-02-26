const PICController         = {}
const PICModel              = require('../models/pic.model');
const parseResponse         = require('../helpers/parse-response')
const log                   = 'PIC controller';

PICController.getPICController = async(req, res, next) => {
    console.log(`├── ${log} :: Get PIC Controller`);

    try{
        let sql = `SELECT tblm_pic.*, tblm_sub_fungsi.NamaSub, tblm_fungsi.NamaFungsi FROM tblm_pic 
        JOIN tblm_sub_fungsi ON tblm_pic.ID_SUBFUNGSI = tblm_sub_fungsi.ID_SUBFUNGSI
        JOIN tblm_fungsi ON tblm_fungsi.ID_FUNGSI = tblm_sub_fungsi.ID_FUNGSI`
        let dbPIC = await PICModel.QueryCustom(sql);

        // success
        res.status(200).send(
            parseResponse(true, dbPIC.rows, '00', 'Get PIC Controller Success')
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

PICController.modalGetPICController = async(req, res, next) => {
    console.log(`├── ${log} :: Get PIC Modal Controller`);

    try{
        let sql = `SELECT DISTINCT tblm_fungsi.ID_FUNGSI, tblm_fungsi.NamaFungsi, tblm_pic.AccountTipe FROM tblm_pic
        JOIN tblm_fungsi On tblm_pic.ID_FUNGSI = tblm_fungsi.ID_FUNGSI`
        let dbPIC = await PICModel.QueryCustom(sql);

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
        let sql = `SELECT tblm_pic.*, tblm_sub_fungsi.*, tblm_fungsi.* FROM tblm_pic 
        JOIN tblm_sub_fungsi ON tblm_pic.ID_SUBFUNGSI = tblm_sub_fungsi.ID_SUBFUNGSI
        JOIN tblm_fungsi ON tblm_fungsi.ID_FUNGSI = tblm_sub_fungsi.ID_FUNGSI WHERE tblm_pic.ID =`+id

        let dbPIC = await PICModel.QueryCustom(sql);

        // success
        res.status(200).send(
            parseResponse(true, dbPIC.rows, '00', 'Get PIC By ID Controller Success')
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

        let { action, dataPIC } = req.body

        if (action == "create") {
            let getPIC = JSON.parse(dataPIC)

            insertData = []
            for (let i = 0; i < getPIC.length; i++) {
                insertData.push([
                    {key : 'ID_SUBFUNGSI', value : getPIC[i].idSubFungsi},
                    {key : 'EmailPekerja', value : getPIC[i].email},
                    {key : 'Status', value : getPIC[i].default},
                ])
            }

            insertResult = []
            for (let x = 0; x < insertData.length; x++) {
                let insert =  await PICModel.save(insertData[x]);
                insertResult.push(insert.success)
            }

            let resultData = insertResult.every(myFunction);
            function myFunction(value) {
                return value == true;
            }
                    
            if (resultData == true) {
                statusCode      = 200
                responseCode    = '00'
                message         = 'Insert PIC Data Controller Success'
                acknowledge     = true
                result          = insertData
            }                

            res.status(statusCode).send(
                parseResponse(acknowledge, result, responseCode, message)
            )
        } else if (action == "update") {
            let { id, idSubFungsi, email, status } = req.body 
            let where = [{key:'ID', value:id}]
            let data = [
                {key : 'ID_SUBFUNGSI', value : idSubFungsi},
                {key : 'EmailPekerja', value : email},
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