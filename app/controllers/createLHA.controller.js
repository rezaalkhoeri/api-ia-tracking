const CreateLHAController         = {}
const LHAModel                    = require('../models/lha.model');
const TemuanModel                 = require('../models/temuan.model');
const RekomendasiModel            = require('../models/rekomendasi.model');
const FungsiRekomendasiModel      = require('../models/fungsi_rekomendasi.model');
const LogActivityModel            = require('../models/log_activity.model');
const _                           = require('lodash');
const moment                      = require('moment');
const parseResponse               = require('../helpers/parse-response')
const log                         = 'Create LHA controller';

CreateLHAController.createLHAController = async(req, res, next) => {
    console.log(`├── ${log} :: Create LHA Data Controller`);

    try {
        let { nomorLHA, judulLHA, tglLHA, tipeLHA, createdBy, temuan } = req.body
        
        // Upload File Data
        let filename = []
        if (req.files == null) {

        } else {                   
            sampleFile = req.files.dokumenAudit
            // console.log(sampleFile);
            filename.push(sampleFile.name)
            uploadPath = __dirname+'./../public/Dokumen LHA/'+sampleFile.name
            
            sampleFile.mv(uploadPath, function(err) {
                if (err) {
                    statusCode      = 200
                    responseCode    = '41'
                    message         = 'Upload dokumen gagal !'
                    acknowledge     = false
                    result          = null        
                }
            });
        }

        let condition = [{key:'NomorLHA', value:nomorLHA}] 
        let check = await LHAModel.getAll('*', condition)

        let getTemuan = JSON.parse(temuan)

        if ( ! check.length > 0) {
            let dataLHA = [
                { key:'NomorLHA', value:nomorLHA },
                { key:'JudulLHA', value:judulLHA },
                { key:'DokumenAudit', value: filename[0] },
                { key:'TanggalLHA', value:tglLHA },
                { key:'TipeLHA', value:tipeLHA },
                { key:'StatusLHA', value: 'A0' },
                // { key:'TotalTemuan', value: getTemuan.length },
                { key:'CreatedBy', value:createdBy },
            ]
    
            let insertLHA =  await LHAModel.save(dataLHA);
    
            if (insertLHA.success == true) {
    
                let whereLHA = [{ key:'NomorLHA', value:nomorLHA }]
                let getLHA = await LHAModel.getBy('ID_LHA', whereLHA)
                let idLHA = getLHA.ID_LHA
    
                let dataTemuan = []
                for (let i = 0; i < getTemuan.length; i++) {
                    dataTemuan.push([
                        { key: 'ID_LHA', value: idLHA},
                        { key: 'JudulTemuan', value: getTemuan[i].judulTemuan},
                        { key: 'IndikasiBernilaiUang', value: getTemuan[i].indikasi},
                        { key: 'Nominal', value: getTemuan[i].nominal},
                        { key: 'StatusTemuan', value: 'A0' },
                        { key: 'CreatedBy', value: createdBy},
                    ])
                }
    
                let temuanRes = []
                for (let x = 0; x < dataTemuan.length; x++) {
                    let insertTemuan =  await TemuanModel.save(dataTemuan[x]);  
                    temuanRes.push(insertTemuan.success)
                }
    
                let temuanInsert = temuanRes.every(myFunction);
                function myFunction(value) {
                    return value == true;
                }
    
                if (temuanInsert == true) {
                    let logData = [
                        {key:'ID_LHA', value:idLHA},
                        {key:'UserId', value:createdBy},
                        {key:'Activity', value:'Create New LHA & Temuan status A0 (DRAFT)'},
                        {key:'AdditionalInfo', value:'Create LHA dengan nomor '+nomorLHA+' beserta '+dataTemuan.length+' temuan.'},
                        {key:'Type', value:'New'}
                    ]                        
                    let log = await LogActivityModel.save(logData);
    
                    if (log.success == true) {
                        postData = [
                            {key:'DATA LHA', value: dataLHA},
                            {key:'DATA Temuan', value: dataTemuan},
                        ]
        
                        statusCode      = 200
                        responseCode    = '00'
                        message         = 'Create LHA Controller Success'
                        acknowledge     = true
                        result          = postData                                
                    }
                }    
            }                    
        } else {

            let { action, id_lha } = req.body

            if (action == 'update') {

                let where = [{ key: 'ID_LHA', value: id_lha }]

                let dataLHA = [
                    { key:'NomorLHA', value:nomorLHA },
                    { key:'JudulLHA', value:judulLHA },
                    { key:'DokumenAudit', value: filename[0] },
                    { key:'TanggalLHA', value:tglLHA },
                    { key:'TipeLHA', value:tipeLHA },
                    { key:'StatusLHA', value: 'A0' },
                    // { key:'TotalTemuan', value: getTemuan.length },
                    { key:'CreatedBy', value:createdBy },
                ]
        
                let updateLHA =  await LHAModel.save(dataLHA, where);
                
                if (updateLHA.success == true) {        
                    let getTemuan = JSON.parse(temuan)
                    let whereLHA = [{ key:'NomorLHA', value:nomorLHA }]
                    let getLHA = await LHAModel.getBy('ID_LHA', whereLHA)
                    let idLHA = getLHA.ID_LHA

                    let temuanRes = []
                    let dataTemuan = []
                    for (let y = 0; y < getTemuan.length; y++) {
                        let whereTemuan = [{ key:'ID_TEMUAN', value:getTemuan[y].idTemuan }]
                        let checkTemuan = await TemuanModel.getAll('ID_TEMUAN', whereTemuan)

                        if (checkTemuan.length > 0) {
                            let dataTemuanUpdate = [
                                { key: 'ID_LHA', value: idLHA},
                                { key: 'JudulTemuan', value: getTemuan[y].judulTemuan},
                                { key: 'IndikasiBernilaiUang', value: getTemuan[y].indikasi},
                                { key: 'Nominal', value: getTemuan[y].nominal},
                                { key: 'StatusTemuan', value: 'A0' },
                                { key: 'CreatedBy', value: createdBy},
                            ]

                            let updateTemuan =  await TemuanModel.save(dataTemuanUpdate, whereTemuan);  
                            temuanRes.push(updateTemuan.success)
                            dataTemuan.push(dataTemuanUpdate)
                        } else {
                            let dataTemuanInsert = [
                                { key: 'ID_LHA', value: idLHA},
                                { key: 'JudulTemuan', value: getTemuan[y].judulTemuan},
                                { key: 'IndikasiBernilaiUang', value: getTemuan[y].indikasi},
                                { key: 'Nominal', value: getTemuan[y].nominal},
                                { key: 'StatusTemuan', value: 'A0' },
                                { key: 'CreatedBy', value: createdBy},
                            ]

                            let insertTemuan =  await TemuanModel.save(dataTemuanInsert);  
                            temuanRes.push(insertTemuan.success)
                            dataTemuan.push(dataTemuanInsert)
                        }
                    }
            
                    let temuanUpdate = temuanRes.every(myFunction);
                    function myFunction(value) {
                        return value == true;
                    }
        
                    if (temuanUpdate == true) {
                        let logData = [
                            {key:'ID_LHA', value:idLHA},
                            {key:'UserId', value:createdBy},
                            {key:'Activity', value:'Edit LHA & Temuan status A0 (DRAFT)'},
                            {key:'AdditionalInfo', value:'Edit data LHA dengan nomor '+nomorLHA+' beserta '+dataTemuan.length+' temuan.'},
                            {key:'Type', value:'New'}
                        ]                            
                        let log = await LogActivityModel.save(logData);

                        if (log.success == true) {
                            postData = [
                                {key:'DATA LHA', value: dataLHA},
                                {key:'DATA Temuan', value: dataTemuan},
                            ]
            
                            statusCode      = 200
                            responseCode    = '00'
                            message         = 'Update LHA Controller Success'
                            acknowledge     = true
                            result          = postData                                    
                        }
                    }    
                }

            } else {
                // LHA already exists
                statusCode      = 200
                responseCode    = '44'
                message         = 'LHA already exists !'
                acknowledge     = false
                result          = null                    
            }
        }

        res.status(statusCode).send(
            parseResponse(acknowledge, result, responseCode, message)
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

CreateLHAController.AddRekomendasiController = async(req, res, next) => {
    console.log(`├── ${log} :: Create LHA Data Controller`);

    try {
        if (req.currentUser.body.role == 1 || req.currentUser.body.role == 3 || req.currentUser.body.role == 4){
            let { action, idLHA } = req.body

            if (action == 'create') {
                let { rekomendasi } = req.body
                let getRekomendasi = JSON.parse(rekomendasi)

                function onlyUnique(value, index, self) {
                    return self.indexOf(value) === index;
                }

                let whereLHA = [{key:'ID_LHA', value:idLHA}]
                let getTemuan = await TemuanModel.getAll('ID_TEMUAN', whereLHA)

                let oldRekomendasi = []
                for (let a = 0; a < getTemuan.length; a++) {
                    let whereTemuan = [{key:'ID_TEMUAN', value:getTemuan[a].ID_TEMUAN}]
                    let getOldRek = await RekomendasiModel.getAll('*', whereTemuan)
                    oldRekomendasi.push(getOldRek)
                    await RekomendasiModel.delete(whereTemuan)
                }

                let oldRek = [].concat.apply([], oldRekomendasi.filter(onlyUnique)) ;
                
                for (let f = 0; f < oldRek.length; f++) {
                    let whereRek = [{ key: 'ID_REKOMENDASI', value: oldRek[f].ID_REKOMENDASI }]
                    await FungsiRekomendasiModel.delete(whereRek)
                }

                let dataRekomendasi = []
                let dataPICFungsi = []
                for (let i = 0; i < getRekomendasi.length; i++) {
                    dataRekomendasi.push([
                        { key: 'ID_TEMUAN', value: getRekomendasi[i].idTemuan },
                        { key: 'JudulRekomendasi', value: getRekomendasi[i].judulRekomendasi },
                        { key: 'BuktiTindakLanjut', value: getRekomendasi[i].buktiTL },
                        { key: 'StatusTL', value: 'A0' },
                        { key: 'DueDate', value: getRekomendasi[i].dueDate },
                        { key: 'CreatedBy', value: req.currentUser.body.userid},
                    ])

                    dataPICFungsi.push(getRekomendasi[i].PICfungsi)
                }

                let insertRekomendasi = []
                for (let z = 0; z < dataRekomendasi.length; z++) {
                    let rekomendasiSave = await RekomendasiModel.save(dataRekomendasi[z])
                    insertRekomendasi.push(rekomendasiSave.success)
                }

                let cekRekomendasi = insertRekomendasi.every(myFunction);
                function myFunction(value) {
                    return value == true;
                }

                if (cekRekomendasi == true) {
                    IDrekomendasi = []
                    for (let i = 0; i < getTemuan.length; i++) {
                        let whereTemuan = [{ key: 'ID_TEMUAN', value: getTemuan[i].ID_TEMUAN }]
                        let getRekID = await RekomendasiModel.getAll('*', whereTemuan)
                        IDrekomendasi.push(getRekID)
                    }
                    let IDRmerged = [].concat.apply([], IDrekomendasi);
                
                    let fungsiRekomendasi = []
                    for (let i = 0; i < IDRmerged.length; i++) {
                        let whereIDR = [{ key: 'ID_REKOMENDASI', value: IDRmerged[i].ID_REKOMENDASI }]
                        await FungsiRekomendasiModel.delete(whereIDR)

                        for (let x = 0; x < dataPICFungsi[i].length; x++) {
                            fungsiRekomendasi.push([
                                { key: 'ID_REKOMENDASI', value: IDRmerged[i].ID_REKOMENDASI },
                                { key: 'ID_SUBFUNGSI', value: dataPICFungsi[i][x].idSubFungsi },
                            ])
                        }
                    }

                    let PICfungsidata = []
                    for (let z = 0; z < fungsiRekomendasi.length; z++) {
                        let fungsiRekSave = await FungsiRekomendasiModel.save(fungsiRekomendasi[z])
                        PICfungsidata.push(fungsiRekSave.success)
                    }

                    let cekFungsiRekomendasi = PICfungsidata.every(myFunction);
                    function myFunction(value) {
                        return value == true;
                    }

                    if (cekFungsiRekomendasi == true) {
                        let logData = [
                            { key: 'ID_LHA', value: idLHA },
                            { key: 'UserId', value: req.currentUser.body.userid },
                            { key: 'Activity', value: 'Add Rekomendasi status A0 (DRAFT)' },
                            { key: 'AdditionalInfo', value: 'Menambahkan ' + IDRmerged.length + ' rekomendasi.' },
                            { key: 'Type', value: 'New' }
                        ]
                        let log = await LogActivityModel.save(logData);

                        if (log.success == true) {
                            statusCode = 200
                            responseCode = '00'
                            message = 'Add Rekomendasi Success'
                            acknowledge = true
                            result = IDRmerged
                        } else {
                            statusCode = 200
                            responseCode = '99'
                            message = 'Add Rekomendasi Failed'
                            acknowledge = false
                            result = null
                        }
                    } else {
                        statusCode = 200
                        responseCode = '99'
                        message = 'Add Rekomendasi Failed'
                        acknowledge = false
                        result = null
                    }
                } else {
                    statusCode = 200
                    responseCode = '99'
                    message = 'Add Rekomendasi Failed'
                    acknowledge = false
                    result = null
                }
            } else if (action == 'update') {
                statusCode = 200
                responseCode = '00'
                message = 'Update Rekomendasi Fungsi Controller'
                acknowledge = true
                result = 'BELUM GAN! SUSAH SEKALI'
            } else {
                statusCode = 200
                responseCode = '404'
                message = 'Request not found'
                acknowledge = false
                result = null
            }
        } else {
            statusCode = 200
            acknowledge = false
            responseCode = '99'
            message = "You haven't permission!"
            result = null
        }

        res.status(statusCode).send(
            parseResponse(acknowledge, result, responseCode, message)
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

CreateLHAController.SubmitController = async(req, res, next) => {
    console.log(`├── ${log} :: Create LHA Data Controller`);

    try {
        let { idLHA } = req.body
        let whereLHA = [{key:'ID_LHA', value: idLHA}]
        let getLHA = await LHAModel.getAll('*', whereLHA)
    
        if (getLHA.length > 0) {
            let statusLHA = [{key:'StatusLHA', value:'A1'}]
            let submitLHA = await LHAModel.save(statusLHA, whereLHA)
    
            if (submitLHA.success == true) {
                let getTemuan = await TemuanModel.getAll('*', whereLHA)

                if (getTemuan.length > 0) {
                    let statusTemuan = [{key:'StatusTemuan', value:'A1'}]
    
                    resultTemuan = []
                    for (let i = 0; i < getTemuan.length; i++) {
                        let submitTemuan = await TemuanModel.save(statusTemuan, whereLHA)
                        resultTemuan.push(submitTemuan.success)
                    }
    
                    let temuanSubmit = resultTemuan.every(myFunction);
                    function myFunction(value) {
                        return value == true;
                    }
    
                    if (temuanSubmit == true) {

                        dataRekomendasi = []
                        for (let x = 0; x < getTemuan.length; x++) {
                            let whereTemuan = [{key:'ID_TEMUAN', value : getTemuan[x].ID_TEMUAN}]
                            let getRekomendasi = await RekomendasiModel.getAll('*', whereTemuan)

                            dataRekomendasi.push(getRekomendasi)
                        }

                        submitResult = []
                        for (let y = 0; y < dataRekomendasi.length; y++) {
                            for (let i = 0; i < dataRekomendasi[y].length; i++) {
                                let conditionRek = [{key:'ID_REKOMENDASI', value : dataRekomendasi[y][i].ID_REKOMENDASI}]
                                let statusRek = [{key:'StatusTL', value : 'A1'}]
                                let submitRekomendasi = await RekomendasiModel.save(statusRek, conditionRek)
                                submitResult.push(submitRekomendasi.success)
                            }
                        }

                        let resultSubmit = submitResult.every(myFunction);
                        function myFunction(value) {
                            return value == true;
                        }    

                        if (resultSubmit == true) {
                            let submitData = [{
                                LHA : getLHA,
                                Temuan : getTemuan,
                                Rek : dataRekomendasi
                            }]

                            let whereID = [{key:'ID_LHA', value:idLHA}]
                            let nomorLHA = await LHAModel.getAll('NomorLHA', whereID)
        
                            let logData = [
                                {key:'ID_LHA', value:idLHA},
                                {key:'UserId', value: req.currentUser.body.userid},
                                {key:'Activity', value:'Submit LHA '+ nomorLHA[0].NomorLHA +', Temuan & Rekomendasi to status A1 (OPEN)'},
                                {key:'AdditionalInfo', value:'Menunggu tindak lanjut dari auditee.'},
                                {key:'Type', value:'Submit'}
                            ]
                            let log = await LogActivityModel.save(logData);
        
                            if (log.success == true) {
                                statusCode      = 200
                                responseCode    = '00'
                                message         = 'Submit LHA Success'
                                acknowledge     = true
                                result          = submitData      
                            }
                        }
                    } 
                } else {
                    statusCode      = 200
                    responseCode    = '99'
                    message         = 'Temuan Not Found'
                    acknowledge     = false
                    result          = null
                }
            }
    
        } else {
            statusCode      = 200
            responseCode    = '99'
            message         = 'LHA Not Found'
            acknowledge     = false
            result          = null                    
        }

        res.status(statusCode).send(
            parseResponse(acknowledge, result, responseCode, message)
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

CreateLHAController.SaveLHAController = async (req, res, next) => {
    console.log(`├── ${log} :: Create LHA Data Controller`);

    try {
        if (req.currentUser.body.role == 1 || req.currentUser.body.role == 3 || req.currentUser.body.role == 4) {
            let { action, nomorLHA, judulLHA, tglLHA, tipeLHA, filename } = req.body
            
            if (action == 'create') {
                let condition = [{ key: 'NomorLHA', value: nomorLHA }]
                let cekData = await LHAModel.getAll('*', condition)

                if (!cekData.length > 0) {
                    let dataLHA = [
                        { key: 'NomorLHA', value: nomorLHA },
                        { key: 'JudulLHA', value: judulLHA },
                        { key: 'DokumenAudit', value: filename },
                        { key: 'TanggalLHA', value: tglLHA },
                        { key: 'TipeLHA', value: tipeLHA },
                        { key: 'StatusLHA', value: 'A0' },
                        { key: 'CreatedBy', value: req.currentUser.body.userid },
                    ]

                    let insertLHA = await LHAModel.save(dataLHA);

                    if (insertLHA.success == true) {
                        let where = [{ key: 'NomorLHA', value: nomorLHA }]
                        let getLHA = await LHAModel.getAll('*', where)

                        let obj = getLHA
                        dataLHA = _.map(obj, function (data) {
                            return dataLHA = {
                                ID_LHA: data.ID_LHA,
                                NomorLHA: data.NomorLHA,
                                JudulLHA: data.JudulLHA,
                                DokumenAudit: data.DokumenAudit,
                                TanggalLHA: moment(data.TanggalLHA).format('YYYY-MM-DD'),
                                TipeLHA: data.TipeLHA,
                                StatusLHA: data.StatusLHA,
                            }
                        });

                        let logData = [
                            { key: 'ID_LHA', value: dataLHA[0].ID_LHA },
                            { key: 'UserId', value: req.currentUser.body.userid },
                            { key: 'Activity', value: 'Create LHA status A0 (DRAFT)' },
                            { key: 'AdditionalInfo', value: 'Create LHA ' + nomorLHA + '.' },
                            { key: 'Type', value: 'New' }
                        ]
                        let log = await LogActivityModel.save(logData);

                        if (log.success == true) {
                            statusCode = 200
                            acknowledge = true
                            responseCode = '00'
                            message = 'Insert LHA Success!'
                            result = dataLHA
                        } else {
                            statusCode = 200
                            acknowledge = false
                            responseCode = '99'
                            message = 'Insert LHA Failed!'
                            result = null                            
                        }
                    } else {
                        statusCode = 200
                        acknowledge = false
                        responseCode = '99'
                        message = 'Insert LHA Failed!'
                        result = null
                    }
                } else {
                    statusCode = 200
                    acknowledge = false
                    responseCode = '99'
                    message = 'Nomor LHA sudah ada! Mohon periksa kembali.'
                    result = null
                }                
            } else if (action == 'update'){
                let { idLHA } = req.body
                let condition = [{key:'ID_LHA', value:idLHA}]
                let check = await LHAModel.getAll('*', condition)

                if (check.length > 0) {
                    let dataLHA = [
                        { key: 'NomorLHA', value: nomorLHA },
                        { key: 'JudulLHA', value: judulLHA },
                        { key: 'DokumenAudit', value: filename },
                        { key: 'TanggalLHA', value: tglLHA },
                        { key: 'TipeLHA', value: tipeLHA },
                        { key: 'StatusLHA', value: 'A0' },
                        { key: 'CreatedBy', value: req.currentUser.body.userid },
                    ]

                    let updateLHA = await LHAModel.save(dataLHA, condition);

                    if (updateLHA.success == true) {
                        let getLHA = await LHAModel.getAll('*', condition)

                        let obj = getLHA
                        dataLHA = _.map(obj, function (data) {
                            return dataLHA = {
                                ID_LHA: data.ID_LHA,
                                NomorLHA: data.NomorLHA,
                                JudulLHA: data.JudulLHA,
                                DokumenAudit: data.DokumenAudit,
                                TanggalLHA: moment(data.TanggalLHA).format('YYYY-MM-DD'),
                                TipeLHA: data.TipeLHA,
                                StatusLHA: data.StatusLHA,
                            }
                        });

                        let logData = [
                            { key: 'ID_LHA', value: dataLHA[0].ID_LHA },
                            { key: 'UserId', value: req.currentUser.body.userid },
                            { key: 'Activity', value: 'Update LHA status A0 (DRAFT)' },
                            { key: 'AdditionalInfo', value: 'Update LHA ' + nomorLHA + '.' },
                            { key: 'Type', value: 'New' }
                        ]
                        let log = await LogActivityModel.save(logData);

                        if (log.success == true) {
                            statusCode = 200
                            acknowledge = true
                            responseCode = '00'
                            message = 'Update LHA Success!'
                            result = dataLHA                            
                        } else {
                            statusCode = 200
                            acknowledge = false
                            responseCode = '99'
                            message = 'Update LHA Failed!'
                            result = null                            
                        }
                    } else {
                        statusCode = 200
                        acknowledge = false
                        responseCode = '99'
                        message = 'Update LHA Failed!'
                        result = null
                    }                    
                } else {
                    statusCode = 200
                    acknowledge = false
                    responseCode = '99'
                    message = "LHA does not exist!"
                    result = null
                }
            } else if (action == 'delete'){
                let { idLHA } = req.body
                let condition = [{ key: 'ID_LHA', value: idLHA }]
                let check = await LHAModel.getAll('*', condition)

                if (check.length > 0) {
                    let hapusLHA = await LHAModel.delete(condition)
                    if (hapusLHA.success == true) {
                        statusCode = 200
                        acknowledge = true
                        responseCode = '00'
                        message = 'Delete LHA Success!'
                        result = null                        
                    } else {
                        statusCode = 200
                        acknowledge = false
                        responseCode = '99'
                        message = 'Delete LHA Failed!'
                        result = null                        
                    }
                } else {
                    statusCode = 200
                    acknowledge = false
                    responseCode = '99'
                    message = "LHA does not exist!"
                    result = null                    
                }
            }
        } else {
            statusCode = 200
            acknowledge = false
            responseCode = '99'
            message = "You haven't permission!"
            result = null
        }

        res.status(statusCode).send(
            parseResponse(acknowledge, result, responseCode, message)
        )
    } catch (error) {
        console.log('Error exception :' + error)
        let resp = parseResponse(false, null, '99', error)
        next({
            resp,
            status: 500
        })
    }
}

CreateLHAController.SaveTemuanController = async (req, res, next) => {
    console.log(`├── ${log} :: Create LHA Data Controller`);

    try {
        if (req.currentUser.body.role == 1 || req.currentUser.body.role == 3 || req.currentUser.body.role == 4) {

            let { idLHA, temuan } = req.body
            getTemuan = JSON.parse(temuan)

            let temuanRes = []
            for (let i = 0; i < getTemuan.length; i++) {
                let where = [{ key: 'ID_TEMUAN', value: getTemuan[i].idTemuan }]
                let check = await TemuanModel.getAll('*', where)

                if (check.length > 0) {
                    let dataTemuan = [
                        { key: 'ID_LHA', value: idLHA },
                        { key: 'JudulTemuan', value: getTemuan[i].judulTemuan },
                        { key: 'IndikasiBernilaiUang', value: getTemuan[i].indikasi },
                        { key: 'Nominal', value: getTemuan[i].nominal },
                        { key: 'StatusTemuan', value: 'A0' },
                        { key: 'CreatedBy', value: req.currentUser.body.userid },
                    ]
                    let updateTemuan = await TemuanModel.save(dataTemuan,where);
                    temuanRes.push(updateTemuan.success)
                } else {
                    let dataTemuan = [
                        { key: 'ID_LHA', value: idLHA },
                        { key: 'JudulTemuan', value: getTemuan[i].judulTemuan },
                        { key: 'IndikasiBernilaiUang', value: getTemuan[i].indikasi },
                        { key: 'Nominal', value: getTemuan[i].nominal },
                        { key: 'StatusTemuan', value: 'A0' },
                        { key: 'CreatedBy', value: req.currentUser.body.userid },
                    ]
                    let insertTemuan = await TemuanModel.save(dataTemuan);
                    temuanRes.push(insertTemuan.success)
                }
            }

            let temuanInsert = temuanRes.every(myFunction);
            function myFunction(value) {
                return value == true;
            }

            if (temuanInsert == true) {
                let condition = [{key:'ID_LHA',value:idLHA}]
                let getLHA = await LHAModel.getAll('*',condition)
                let logData = [
                    { key: 'ID_LHA', value: idLHA },
                    { key: 'UserId', value: req.currentUser.body.userid },
                    { key: 'Activity', value: 'Menambahkan Temuan status A0 (DRAFT)' },
                    { key: 'AdditionalInfo', value: 'Menambahkan ' + getTemuan.length + ' temuan pada LHA ' + getLHA[0].NomorLHA + '.' },
                    { key: 'Type', value: 'New' }
                ]
                let log = await LogActivityModel.save(logData);

                if (log.success == true) {
                    let condition = [{ key: 'ID_LHA', value: idLHA }]
                    let getTemuan = await TemuanModel.getAll('*', condition)

                    statusCode = 200
                    acknowledge = true
                    responseCode = '00'
                    message = 'Add Temuan Success'
                    result = getTemuan
                }
            } else {
                statusCode = 200
                acknowledge = false
                responseCode = '99'
                message = 'Add Temuan Failed'
                result = null
            }
        } else {
            statusCode = 200
            acknowledge = false
            responseCode = '99'
            message = "You haven't permission!"
            result = null
        }

        res.status(statusCode).send(
            parseResponse(acknowledge, result, responseCode, message)
        )
    } catch (error) {
        console.log('Error exception :' + error)
        let resp = parseResponse(false, null, '99', error)
        next({
            resp,
            status: 500
        })
    }
}

CreateLHAController.DeleteTemuanByIDController = async (req, res, next) => {
    console.log(`├── ${log} :: Create LHA Data Controller`);

    try {
        if (req.currentUser.body.role == 1 || req.currentUser.body.role == 3 || req.currentUser.body.role == 4) {
            let {idTemuan} = req.body

            let condition = [{key:'ID_TEMUAN', value:idTemuan}]
            let cek = await TemuanModel.getAll('*', condition)

            if (cek.length > 0) {
                let cekRek = await RekomendasiModel.getAll('*', condition)
                console.log(cekRek);                
                if (cekRek.length > 0) {
                    let hapusRek = await RekomendasiModel.delete(condition)
                    if (hapusRek.success == true) {
                        let hapus = await TemuanModel.delete(condition)
                        if (hapus.success == true) {
                            statusCode = 200
                            acknowledge = true
                            responseCode = '00'
                            message = "Delete temuan success!"
                            result = null
                        }
                    }                    
                } else {
                    let hapus = await TemuanModel.delete(condition)
                    if (hapus.success == true) {
                        statusCode = 200
                        acknowledge = true
                        responseCode = '00'
                        message = "Delete temuan success!"
                        result = null
                    }                   
                }
            } else {
                statusCode = 200
                acknowledge = false
                responseCode = '99'
                message = "Temuan isn't exist!"
                result = null                
            }
        } else {
            statusCode = 200
            acknowledge = false
            responseCode = '99'
            message = "You haven't permission!"
            result = null
        }

        res.status(statusCode).send(
            parseResponse(acknowledge, result, responseCode, message)
        )
    } catch (error) {
        console.log('Error exception :' + error)
        let resp = parseResponse(false, null, '99', error)
        next({
            resp,
            status: 500
        })
    }
}

module.exports = CreateLHAController