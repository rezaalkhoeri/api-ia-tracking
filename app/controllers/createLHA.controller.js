const CreateLHAController         = {}
const LHAModel                    = require('../models/lha.model');
const TemuanModel                 = require('../models/temuan.model');
const RekomendasiModel            = require('../models/rekomendasi.model');
const FungsiRekomendasiModel      = require('../models/fungsi_rekomendasi.model');
const parseResponse               = require('../helpers/parse-response')
const log                         = 'Create LHA controller';

CreateLHAController.createLHAController = async(req, res, next) => {
    console.log(`├── ${log} :: Create LHA Data Controller`);

    try {
        let { nomorLHA, judulLHA, tglLHA, tipeLHA, createdBy, temuan } = req.body

        // Upload File Data
        if (!req.files || Object.keys(req.files).length === 0) {
            statusCode      = 200
            responseCode    = '40'
            message         = 'No Files were uploaded !'
            acknowledge     = false
            result          = null
        } else {
            sampleFile = req.files.dokumenAudit;
            uploadPath = __dirname+'./../public/Dokumen Audit/'+nomorLHA+'_'+sampleFile.name; 
            
            sampleFile.mv(uploadPath, function(err) {
                if (err) {
                    statusCode      = 200
                    responseCode    = '41'
                    message         = 'Upload dokumen gagal !'
                    acknowledge     = false
                    result          = null        
                }
            });

            let condition = [{key:'NomorLHA', value:nomorLHA}] 
            let check = await LHAModel.getAll('*', condition)

            let getTemuan = JSON.parse(temuan)

            if ( ! check.length > 0) {
                let dataLHA = [
                    { key:'NomorLHA', value:nomorLHA },
                    { key:'JudulLHA', value:judulLHA },
                    { key:'DokumenAudit', value: nomorLHA+'_'+sampleFile.name },
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
            } else {

                let { action, id_lha } = req.body

                if (action == 'update') {

                    let where = [{ key: 'ID_LHA', value: id_lha }]

                    let dataLHA = [
                        { key:'NomorLHA', value:nomorLHA },
                        { key:'JudulLHA', value:judulLHA },
                        { key:'DokumenAudit', value: nomorLHA+'_'+sampleFile.name },
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

                } else {
                    // LHA already exists
                    statusCode      = 200
                    responseCode    = '44'
                    message         = 'LHA already exists !'
                    acknowledge     = false
                    result          = null                    
                }
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

        let { action, createdBy } = req.body

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
                // let LHAcondition = [{ key:'NomorLHA', value: nomorLHA}]
                // let totalRekomendasi = [{ key:'TotalRekomendasi', value:getRekomendasi.length }]
                // let LHAupdate = await LHAModel.save(totalRekomendasi, LHAcondition)    
    
                let fungsiRekomendasi = []
                for (let y = 0; y < dataPICFungsi.length; y++) {
                    for (let x = 0; x < dataPICFungsi[y].length; x++) {
                        fungsiRekomendasi.push([
                            { key: 'ID_REKOMENDASI', value: dataPICFungsi[y][x].idRekomendasi},
                            { key: 'ID_FUNGSI', value: dataPICFungsi[y][x].idFungsi},
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
                
                    postData = [ 
                        {key:'Data Rekomendasi', value:dataRekomendasi},
                        {key:'Data Fungsi Rekomendasi', value:fungsiRekomendasi},
                    ]
    
                    statusCode      = 200
                    responseCode    = '00'
                    message         = 'Post Rekomendasi Fungsi Controller'
                    acknowledge     = true
                    result          = postData
                }
            }
    
        } else if (action == 'update') {
            let { rekomendasi } = req.body
            let getRekomendasi = JSON.parse(rekomendasi)

            let rekomendasiRes = []
            let fungsiRekomendasi = []
            let dataRekomendasi = []
            for (let i = 0; i < getRekomendasi.length; i++) {
                let whereRek = [{ key: 'ID_REKOMENDASI', value: getRekomendasi[i].idRekomendasi}]
                let checkRek = await RekomendasiModel.getAll('ID_REKOMENDASI', whereRek)

                if (checkRek.length > 0) {
                    let dataRekUpdate = [
                        { key: 'ID_TEMUAN', value: getRekomendasi[i].idTemuan},               
                        { key: 'JudulRekomendasi', value: getRekomendasi[i].judulRekomendasi},
                        { key: 'BuktiTindakLanjut', value: getRekomendasi[i].buktiTL},
                        { key: 'StatusTL', value: 'A0'},
                        { key: 'DueDate', value: getRekomendasi[i].dueDate},
                        { key: 'CreatedBy', value: createdBy},
                    ]
                    
                    let updateRek =  await RekomendasiModel.save(dataRekUpdate, whereRek);  
                    rekomendasiRes.push(updateRek.success)
                    dataRekomendasi.push(dataRekUpdate)

                    let dataPIC = getRekomendasi[i].PICfungsi
                    for (let y = 0; y < dataPIC.length; y++) {
                        let wherePIC = [{ key: 'ID_RF', value: dataPIC[y].idRF}]
                        let checkPIC = await FungsiRekomendasiModel.getAll('ID_RF', wherePIC) 
                        
                        if (checkPIC.length > 0) {
                            let dataPICfungsi = [
                                { key: 'ID_REKOMENDASI', value: dataPIC[y].idRekomendasi},
                                { key: 'ID_FUNGSI', value: dataPIC[y].idFungsi}    
                            ]

                            let updatePIC =  await FungsiRekomendasiModel.save(dataPICfungsi, wherePIC);  
                            fungsiRekomendasi.push(dataPICfungsi)
                            rekomendasiRes.push(updatePIC.success)
                        } else {
                            let dataPICfungsi = [
                                { key: 'ID_REKOMENDASI', value: dataPIC[y].idRekomendasi},
                                { key: 'ID_FUNGSI', value: dataPIC[y].idFungsi}    
                            ]

                            let updatePIC =  await FungsiRekomendasiModel.save(dataPICfungsi);  
                            fungsiRekomendasi.push(dataPICfungsi)
                            rekomendasiRes.push(updatePIC.success)                            
                        }

                    }

                } else {
                    let dataRekomendasiInsert = [
                        { key: 'ID_TEMUAN', value: getRekomendasi[i].idTemuan},               
                        { key: 'JudulRekomendasi', value: getRekomendasi[i].judulRekomendasi},
                        { key: 'BuktiTindakLanjut', value: getRekomendasi[i].buktiTL},
                        { key: 'StatusTL', value: 'A0'},
                        { key: 'DueDate', value: getRekomendasi[i].dueDate},
                        { key: 'CreatedBy', value: createdBy},
                    ]
    
                    let insertRek =  await RekomendasiModel.save(dataRekomendasiInsert);  
                    rekomendasiRes.push(insertRek.success)
                    dataRekomendasi.push(dataRekomendasiInsert)

                    let dataPIC = getRekomendasi[i].PICfungsi
                    for (let y = 0; y < dataPIC.length; y++) {
                        let wherePIC = [{ key: 'ID_RF', value: dataPIC[y].idRF}]
                        let checkPIC = await FungsiRekomendasiModel.getAll('ID_RF', wherePIC) 
                        
                        if (checkPIC.length > 0) {
                            let dataPICfungsi = [
                                { key: 'ID_REKOMENDASI', value: dataPIC[y].idRekomendasi},
                                { key: 'ID_FUNGSI', value: dataPIC[y].idFungsi}    
                            ]

                            let updatePIC =  await FungsiRekomendasiModel.save(dataPICfungsi, wherePIC);  
                            fungsiRekomendasi.push(dataPICfungsi)
                            rekomendasiRes.push(updatePIC.success)
                        } else {
                            let dataPICfungsi = [
                                { key: 'ID_REKOMENDASI', value: dataPIC[y].idRekomendasi},
                                { key: 'ID_FUNGSI', value: dataPIC[y].idFungsi}    
                            ]

                            let updatePIC =  await FungsiRekomendasiModel.save(dataPICfungsi);  
                            fungsiRekomendasi.push(dataPICfungsi)
                            rekomendasiRes.push(updatePIC.success)
                        }

                    }
                
                }
            }
        
            let cekResponse = rekomendasiRes.every(myFunction);
            function myFunction(value) {
                return value == true;
            }
                
            if (cekResponse == true) {
            
                postData = [ 
                    {key:'Data Rekomendasi', value:dataRekomendasi},
                    {key:'Data Fungsi Rekomendasi', value:fungsiRekomendasi},
                ]

                statusCode      = 200
                responseCode    = '00'
                message         = 'Post Rekomendasi Fungsi Controller'
                acknowledge     = true
                result          = postData
            }
            
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
        let { idLHA } = req.body
        let whereLHA = [{key:'ID_LHA', value: idLHA}]
        let getLHA = await LHAModel.getAll('*', whereLHA)
    
        if (getLHA.length > 0) {
            let statusLHA = [{key:'StatusLHA', value:'A1'}]
            let submitLHA = await LHAModel.save(statusLHA, whereLHA)
    
            if (submitLHA.success == true) {
                getTemuan = await TemuanModel.getAll('*', whereLHA)

                if (getTemuan.length > 0) {
                    statusTemuan = [{key:'StatusTemuan', value:'A1'}]
    
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
                            whereTemuan = [{key:'ID_TEMUAN', value : getTemuan[x].ID_TEMUAN}]
                            let getRekomendasi = await RekomendasiModel.getAll('*', whereTemuan)

                            dataRekomendasi.push(getRekomendasi)
                        }

                        statusCode      = 200
                        responseCode    = '00'
                        message         = 'Submit LHA Fungsi Controller'
                        acknowledge     = true
                        result          = dataRekomendasi

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