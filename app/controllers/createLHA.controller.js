const CreateLHAController         = {}
const LHAModel                    = require('../models/lha.model');
const TemuanModel                 = require('../models/temuan.model');
const RekomendasiModel            = require('../models/rekomendasi.model');
const FungsiRekomendasiModel      = require('../models/fungsi_rekomendasi.model');
const LogActivityModel            = require('../models/log_activity.model');
const _                           = require('lodash');
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
            filename.push(nomorLHA+'_'+sampleFile.name)
            uploadPath = __dirname+'./../public/Dokumen LHA/'+nomorLHA+'_'+sampleFile.name
            
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

        let { action, idLHA, createdBy } = req.body

        if (action == 'create') {

            let { rekomendasi } = req.body
            let getRekomendasi = JSON.parse(rekomendasi)
    
            let dataRekomendasi = []
            let dataPICFungsi = []
            for (let i = 0; i < getRekomendasi.length; i++) {
                dataRekomendasi.push([
                    { key: 'ID_TEMUAN', value: getRekomendasi[i].idTemuan},               
                    { key: 'JudulRekomendasi', value: getRekomendasi[i].judulRekomendasi},
                    { key: 'BuktiTindakLanjut', value: getRekomendasi[i].buktiTL},
                    { key: 'StatusTL', value: 'A0'},
                    { key: 'DueDate', value: getRekomendasi[i].dueDate},
                    { key: 'CreatedBy', value: createdBy},
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
                let temuanID = []
                for (let y = 0; y < getRekomendasi.length; y++) {
                    temuanID.push(getRekomendasi[y].idTemuan)
                }

                function onlyUnique(value, index, self) { 
                    return self.indexOf(value) === index;
                }
                let unique = temuanID.filter( onlyUnique );

                IDrekomendasi = []
                for (let i = 0; i < unique.length; i++) {
                    let whereTemuan = [{ key: 'ID_TEMUAN', value: unique[i]}]
                    let getRekID = await RekomendasiModel.getAll('ID_REKOMENDASI', whereTemuan)
                    IDrekomendasi.push(getRekID)
                }

                let merged = [].concat.apply([], IDrekomendasi);

                let fungsiRekomendasi = []
                for (let i = 0; i < merged.length; i++) {
                    for (let x = 0; x < dataPICFungsi[i].length; x++) {
                        fungsiRekomendasi.push([
                            { key: 'ID_REKOMENDASI', value: merged[i].ID_REKOMENDASI},
                            { key: 'ID_FUNGSI', value: dataPICFungsi[i][x].idFungsi},
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
                        {key:'ID_LHA', value:idLHA},
                        {key:'UserId', value:createdBy},
                        {key:'Activity', value:'Add Rekomendasi status A0 (DRAFT)'},
                        {key:'AdditionalInfo', value:'Menambahkan '+ dataRekomendasi.length +' rekomendasi.'},
                        {key:'Type', value:'New'}
                    ]
                    let log = await LogActivityModel.save(logData);

                    if (log.success == true) {
                        postData = [ 
                            {key:'Data Rekomendasi', value:dataRekomendasi},
                            {key:'Data Fungsi Rekomendasi', value:fungsiRekomendasi},
                        ]
        
                        statusCode      = 200
                        responseCode    = '00'
                        message         = 'Add Rekomendasi Fungsi Controller'
                        acknowledge     = true
                        result          = postData                            
                    }
                }
            }
    
        } else if (action == 'update') {
            statusCode      = 200
            responseCode    = '00'
            message         = 'Update Rekomendasi Fungsi Controller'
            acknowledge     = true
            result          = 'BELUM GAN! SUSAH SEKALI'
            
        } else {
            statusCode      = 200
            responseCode    = '404'
            message         = 'Request not found'
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

CreateLHAController.SubmitController = async(req, res, next) => {
    console.log(`├── ${log} :: Create LHA Data Controller`);

    try {
        let { idLHA, createdBy } = req.body
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
                                {key:'UserId', value:createdBy},
                                {key:'Activity', value:'Submit LHA, Temuan & Rekomendasi to status A1 (OPEN)'},
                                {key:'AdditionalInfo', value:'Menunggu tindak lanjut dari auditee.'},
                                {key:'Type', value:'Submit'}
                            ]
                            let log = await LogActivityModel.save(logData);
        
                            if (log.success == true) {
                                statusCode      = 200
                                responseCode    = '00'
                                message         = 'Submit LHA Fungsi Controller'
                                acknowledge     = true
                                result          = submitData      
                            }
                        }
                    } 
                } else {
                    statusCode      = 200
                    responseCode    = '44'
                    message         = 'Temuan Not Found'
                    acknowledge     = false
                    result          = null
                }
            }
    
        } else {
            statusCode      = 200
            responseCode    = '44'
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


module.exports = CreateLHAController