const FungsiController          = {}
const FungsiModel               = require('../models/fungsi.model');
const SubFungsiModel               = require('../models/sub_fungsi.model');
const parseResponse             = require('../helpers/parse-response')
const log                       = 'Fungsi controller';

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

FungsiController.getFungsiByIDController = async(req, res, next) => {
    console.log(`├── ${log} :: Get Fungsi By ID Controller`);

    try{
        let id = req.params.ID
        let where = [{ key: 'ID_FUNGSI', value: id }]

        let sql = await FungsiModel.getAll('*', where)

        // success
        res.status(200).send(
            parseResponse(true, sql, '00', 'Get Fungsi By ID Controller Success')
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

FungsiController.postFungsiController = async(req, res, next) => {
    console.log(`├── ${log} :: Post Fungsi Data Controller`);

    try {

        let { action, namaFungsi } = req.body

        if (action == "create") {

            let condition = [{ key:'NamaFungsi', value:namaFungsi }]
            let checkFungsi = await FungsiModel.getAll('*',condition)
            
            if (checkFungsi.length > 0) {
                // Fungsi already exists
                statusCode      = 200
                responseCode    = '44'
                message         = 'Fungsi already exists !'
                acknowledge     = false
                result          = null
            } else {
                let data = [
                    {key : 'NamaFungsi', value : namaFungsi},
                ]
                
                let insert =  await FungsiModel.save(data);
        
                if (insert.success == true) {
                    statusCode      = 200
                    responseCode    = '00'
                    message         = 'Insert Fungsi Data Controller Success'
                    acknowledge     = true
                    result          = data    
                }
            }

            res.status(statusCode).send(
                parseResponse(acknowledge, result, responseCode, message)
            )

        } else if (action == "update") {
            let { id } = req.body 
            let where = [{key:'ID_FUNGSI', value:id}]
            let data = [
                {key : 'NamaFungsi', value : namaFungsi},
            ]
            
            let update =  await FungsiModel.save(data, where);    
            
            if (update.success == true) {
                res.status(200).send(
                    parseResponse(true, data, '00', 'Update Fungsi Data Controller Success')
                )
            }                

        } else {
            res.status(200).send(
                parseResponse(true, null, '404', 'Request Not Found')
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

FungsiController.getSubFungsiController = async(req, res, next) => {
    console.log(`├── ${log} :: Get Sub Fungsi Controller`);

    try{
        let sql = `SELECT tblm_sub_fungsi.*, tblm_fungsi.NamaFungsi FROM tblm_sub_fungsi 
                JOIN tblm_fungsi ON tblm_fungsi.ID_FUNGSI = tblm_sub_fungsi.ID_FUNGSI`
        let dbFungsi = await SubFungsiModel.QueryCustom(sql);

        // success
        res.status(200).send(
            parseResponse(true, dbFungsi.rows, '00', 'Get Fungsi Controller Success')
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

FungsiController.getSubFungsiByIDController = async(req, res, next) => {
    console.log(`├── ${log} :: Get Sub Fungsi Sub By ID Controller`);

    try{
        let id = req.params.ID
        let sql = `SELECT tblm_sub_fungsi.*, tblm_fungsi.NamaFungsi FROM tblm_sub_fungsi 
                JOIN tblm_fungsi ON tblm_fungsi.ID_FUNGSI = tblm_sub_fungsi.ID_FUNGSI 
                WHERE tblm_sub_fungsi.ID_SUBFUNGSI =`+id
        let dbFungsi = await SubFungsiModel.QueryCustom(sql);

        // success
        res.status(200).send(
            parseResponse(true, dbFungsi.rows, '00', 'Get Fungsi By ID Controller Success')
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

FungsiController.postSubFungsiController = async(req, res, next) => {
    console.log(`├── ${log} :: Post Fungsi Data Controller`);

    try {

        let { action, subFungsi } = req.body

        if (action == "create") {

            let subData =  JSON.parse(subFungsi)

            let subArray = []
            for (let i = 0; i < subData.length; i++) {
                subArray.push([
                    {key : 'ID_FUNGSI', value : subData[i].idFungsi},
                    {key : 'NamaSub', value : subData[i].namaSub},
                ])
            }

            let result = []
            for (let x = 0; x < subArray.length; x++) {
                let insert =  await SubFungsiModel.save(subArray[x]);
                result.push(insert.success)
            }

            let insertResult = result.every(myFunction);
            function myFunction(value) {
                return value == true;
            }

            if (insertResult == true) {
                statusCode      = 200
                responseCode    = '00'
                message         = 'Insert Sub Fungsi Data Controller Success'
                acknowledge     = true
                result          = subArray    
            }
            res.status(statusCode).send(
                parseResponse(acknowledge, result, responseCode, message)
            )
        } else if (action == "update") {
            let { id, idFungsi, namaSub } = req.body 
            let where = [{key:'ID_SUBFUNGSI', value:id}]

            let data = [
                {key : 'ID_FUNGSI', value : idFungsi},
                {key : 'NamaSub', value : namaSub},
            ]

            let update =  await SubFungsiModel.save(data, where);
            
            if (update.success == true) {
                res.status(200).send(
                    parseResponse(true, data, '00', 'Update Fungsi Data Controller Success')
                )
            }

        } else {
            res.status(200).send(
                parseResponse(true, null, '404', 'Request Not Found')
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

module.exports = FungsiController