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
        let { nomorLHA, judulLHA, tglLHA, tipeLHA, createdByLHA, temuan } = req.body

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
                    { key:'TanggalLHA', value:tglLHA },
                    { key:'TipeLHA', value:tipeLHA },
                    { key:'StatusLHA', value: 'A01' },
                    { key:'TotalTemuan', value: getTemuan.length },
                    { key:'CreatedBy', value:createdByLHA },
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
                            { key:'StatusTemuan', value: 'A01' },
                            { key: 'CreatedBy', value: getTemuan[i].createdBy},
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

        let { nomorLHA, rekomendasi } = req.body
        
        let getRekomendasi = JSON.parse(rekomendasi)

        let dataRekomendasi = []
        let dataPICFungsi = []
        for (let i = 0; i < getRekomendasi.length; i++) {
            dataRekomendasi.push([
                { key: 'ID_TEMUAN', value: getRekomendasi[i].idTemuan},               
                { key: 'JudulRekomendasi', value: getRekomendasi[i].judulRekomendasi},
                { key: 'BuktiTindakLanjut', value: getRekomendasi[i].buktiTL},
                { key: 'DueDate', value: getRekomendasi[i].dueDate},
                { key: 'CreatedBy', value: getRekomendasi[i].createdBy},
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
            let LHAcondition = [{ key:'NomorLHA', value: nomorLHA}]
            let totalRekomendasi = [{ key:'TotalRekomendasi', value:getRekomendasi.length }]
            let LHAupdate = await LHAModel.save(totalRekomendasi, LHAcondition)    

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
                
            if (cekFungsiRekomendasi == true && LHAupdate.success == true) {
            
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