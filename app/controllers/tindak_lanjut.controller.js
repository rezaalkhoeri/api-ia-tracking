const TLController                  = {}
const TLModel                       = require('../models/TL.model');
const LHAModel                       = require('../models/lha.model');
const TemuanModel                   = require('../models/temuan.model');
const RekomendasiModel              = require('../models/rekomendasi.model');
const FungsiRekomendasiModel        = require('../models/fungsi_rekomendasi.model');
const LogActivityModel              = require('../models/log_activity.model')
const date                          = require('date-and-time');
const now                           = new Date();
const moment                        = require('moment');
const parseResponse                 = require('../helpers/parse-response')
const log                           = 'TL controller';

TLController.getTLByRekomendasiController = async(req, res, next) => {
    console.log(`├── ${log} :: Get TL Controller`);

    try{
        let {idRekomendasi} = req.body
        let condition = [{key:'ID_RF', value:idRekomendasi}]
        let getTL = await TLModel.getAll('*', condition)

        res.status(200).send(
            parseResponse(true, getTL, '00', 'Get Tindak Lanjut By Rekomendasi Controller Success')
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

TLController.auditeeTLController = async(req, res, next) => {
    console.log(`├── ${log} :: Auditee TL Controller`);

    try{

        let { action, idRF, createdBy } = req.body

        let whereRek = [{key:'ID_REKOMENDASI', value:idRF}]
        let getRek = await RekomendasiModel.getBy('*', whereRek)
        let whereTemuan = [{key:'ID_Temuan', value:getRek.ID_TEMUAN}]
        let getTemuan = await TemuanModel.getBy('*', whereTemuan)
        let whereLHA = [{key:'ID_LHA', value:getTemuan.ID_LHA}]
        let getLHA = await LHAModel.getBy('*', whereLHA)

        if (action == 'create') {

            let condition = [{key:'ID_RF', value:idRF}]
            let checkTL = await TLModel.getAll('*', condition)

            if (checkTL.length > 0) {
 
                let {catatanAuditee } = req.body

                let filename =[]
                if (req.files == null) {
                    filename.push(checkTL[0].DokumenTL)
                } else {                   
                    sampleFile = req.files.dokumenTL;
                    filename.push('TL_'+sampleFile.name)
                    uploadPath = __dirname+'./../public/Dokumen TL/TL_'+sampleFile.name; 
                    
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
                
                let dataTL = [
                    { key:'ID_RF', value:idRF},
                    { key:'DokumenTL', value: filename[0] },
                    { key:'CatatanAudit', value:catatanAuditee},
                    { key:'StatusTL', value:'A0'},
                    { key:'AuditeeBy', value:createdBy}
                ]

                let updateTL = await TLModel.save(dataTL, condition)
                    
                if (updateTL.success == true) {
                    let logData = [
                        {key:'ID_LHA', value:getLHA.ID_LHA},
                        {key:'UserId', value:createdBy},
                        {key:'Activity', value:'Tindak Lanjut By Auditee'},
                        {key:'AdditionalInfo', value:'Update data tindak lanjut untuk Rekomendasi : '+getRek.JudulRekomendasi+', Judul Temuan : '+getTemuan.JudulTemuan+'.'},
                        {key:'Type', value:'New'}
                    ]
                    let log = await LogActivityModel.save(logData);
                    
                    if (log.success == true) {
                        statusCode      = 200
                        responseCode    = '00'
                        message         = 'Insert TL Controller Success'
                        acknowledge     = true
                        result          = dataTL
                    }
                }
       
            } else {
                let { catatanAuditee, createdBy } = req.body

                let filename = []
                if (req.files == null) {
                    
                } else {                    
                    sampleFile = req.files.dokumenTL;
                    filename.push('TL_'+sampleFile.name)
                    uploadPath = __dirname+'./../public/Dokumen TL/TL_'+sampleFile.name; 
                    
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
        
                    let dataTL = [
                        { key:'ID_RF', value:idRF},
                        { key:'DokumenTL', value: filename[0] },
                        { key:'CatatanAudit', value:catatanAuditee},
                        { key:'StatusTL', value:'A0'},
                        { key:'AuditeeBy', value:createdBy}
                    ]
        
                    let insertTL = await TLModel.save(dataTL)
                    
                    if (insertTL.success == true) {
                        let logData = [
                            {key:'ID_LHA', value:getLHA.ID_LHA},
                            {key:'UserId', value:createdBy},
                            {key:'Activity', value:'Tindak Lanjut By Auditee'},
                            {key:'AdditionalInfo', value:'Menambahkan tindak lanjut untuk Rekomendasi : '+getRek.JudulRekomendasi+', Judul Temuan : '+getTemuan.JudulTemuan+'.'},
                            {key:'Type', value:'New'}
                        ]
                        let log = await LogActivityModel.save(logData);
            
                        if (log.success == true) {
                            statusCode      = 200
                            responseCode    = '00'
                            message         = 'Insert TL Controller Success'
                            acknowledge     = true
                            result          = dataTL
                        }
                    }                   
            }
                
        } else if(action == 'submit') {
            let condition = [{ key:'ID_RF', value: idRF }]
            let dataSubmit = [{ key:'StatusTL', value:'A1' }]

            let submit = await TLModel.save(dataSubmit, condition)

            if (submit.success == true) {
                let where = [{ key:'ID_REKOMENDASI', value: idRF }]
                let statusRekomendasi = [{ key:'StatusTL', value:'A2' }]
                let updateStatusRek = await RekomendasiModel.save(statusRekomendasi, where)

                if (updateStatusRek.success ==  true ) {
                    let postData = [dataSubmit, statusRekomendasi]

                    let logData = [
                        {key:'ID_LHA', value:getLHA.ID_LHA},
                        {key:'UserId', value:createdBy},
                        {key:'Activity', value:'Submit Tindak Lanjut Rekomendasi to Status A2 (ON REVIEW)'},
                        {key:'AdditionalInfo', value:'Submit Rekomendasi : '+getRek.JudulRekomendasi+', Judul Temuan : '+getTemuan.JudulTemuan+'.'},
                        {key:'Type', value:'Submit'}
                    ]
                    let log = await LogActivityModel.save(logData);

                    if (log.success == true) {
                        statusCode      = 200
                        responseCode    = '00'
                        message         = 'Update Status Controller Success'
                        acknowledge     = true
                        result          = postData      
                    }                    
                }
            }

        } else {
            statusCode      = 200
            responseCode    = '404'
            message         = 'Request Not Found'
            acknowledge     = false
            result          = null            
        }

        // return response
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

TLController.closeRekomendasiController = async(req, res, next) => {
    console.log(`├── ${log} :: Close Rekomendasi Controller`);

    try{
        let {idRekomendasi} = req.body

        let whereR = [{key:'ID_REKOMENDASI', value:idRekomendasi}]
        let dataRek = await RekomendasiModel.getBy('*', whereR)
        let whereT = [{key:'ID_Temuan', value:dataRek.ID_TEMUAN}]
        let dataTemuan = await TemuanModel.getBy('*', whereT)
        let whereL = [{key:'ID_LHA', value:dataTemuan.ID_LHA}]
        let dataLHA = await LHAModel.getBy('*', whereL)
        

        let TLcondition = [{key:'ID_RF', value:idRekomendasi}]
        let Rekomendasicondition = [{key:'ID_REKOMENDASI', value:idRekomendasi}]

        let getTL = await TLModel.getAll('*', TLcondition)
        let getRekomendasi = await RekomendasiModel.getAll('*', Rekomendasicondition)

        if (getTL.length && getRekomendasi.length > 0) {
            let {catatanAuditor, auditorBy} = req.body

            let dataTL = [
                {key:'CatatanFungsi', value:catatanAuditor},
                {key:'StatusTL', value:'A3'},
                {key:'TanggalAuditor', value: date.format(now, 'YYYY-MM-DD HH:mm:ss')},
                {key:'AuditorBy', value:auditorBy}
            ]

            let dataRek = [
                {key:'StatusTL', value:'A3'},
                {key:'CloseDate', value: date.format(now, 'YYYY-MM-DD')},
            ]

            let closeTL = await TLModel.save(dataTL, TLcondition)
            let closeRek = await RekomendasiModel.save(dataRek, Rekomendasicondition)
    
            if (closeTL.success && closeRek.success == true) {                 
                let idTemuan = getRekomendasi[0].ID_TEMUAN
                let whereTemuan = [{key:'ID_TEMUAN', value:idTemuan}]
                let allRekByTemuan = await RekomendasiModel.getAll('StatusTL', whereTemuan)

                statusTL = []
                for (let i = 0; i < allRekByTemuan.length; i++) {
                    statusTL.push(allRekByTemuan[i].StatusTL)
                }
                let hasilCek = statusTL.every((val, i, arr) => val === arr[0])
            
                if (hasilCek == true) {
                    let dataStatus = [{key:'StatusTemuan', value:'A3'}]        
                    let statusTemuan = await TemuanModel.save(dataStatus, whereTemuan)

                    if (statusTemuan.success == true ) {
                        let getTemuan = await TemuanModel.getAll('*', whereTemuan)
                        let whereLHA = [{key:'ID_LHA', value:getTemuan[0].ID_LHA}]
                        let temuanByLHA = await TemuanModel.getAll('StatusTemuan', whereLHA)

                        statusTemuan = []
                        for (let i = 0; i < temuanByLHA.length; i++) {
                            statusTemuan.push(temuanByLHA[i].StatusTemuan)
                        }
                        let cekTemuan = statusTemuan.every((val, i, arr) => val === arr[0])

                        if (cekTemuan == true) {
                            let dataLHA = [{key:'StatusLHA', value:'A3'}]
                            let statusLHA = await LHAModel.save(dataLHA, whereLHA)

                            if (statusLHA.success == true) {
                                let logData = [
                                    {key:'ID_LHA', value:dataLHA.ID_LHA},
                                    {key:'UserId', value:auditorBy},
                                    {key:'Activity', value:'Close Rekomendasi (Status A3 / CLOSE)'},
                                    {key:'AdditionalInfo', value:'Close Rekomendasi : '+dataRek.JudulRekomendasi+', Judul Temuan : '+dataTemuan.JudulTemuan+'.'},
                                    {key:'Type', value:'Approval'}
                                ]
                                let log = await LogActivityModel.save(logData);
                                
                                if (log.success == true) {
                                    res.status(200).send(
                                        parseResponse(true, dataTL, '00', 'Close Rekomendasi Controller Success')
                                    )
                                }
                            }
                        } else {                    
                            let logData = [
                                {key:'ID_LHA', value:dataLHA.ID_LHA},
                                {key:'UserId', value:auditorBy},
                                {key:'Activity', value:'Close Rekomendasi (Status A3 / CLOSE)'},
                                {key:'AdditionalInfo', value:'Close Rekomendasi : '+dataRek.JudulRekomendasi+', Judul Temuan : '+dataTemuan.JudulTemuan+'.'},
                                {key:'Type', value:'Approval'}
                            ]
                            let log = await LogActivityModel.save(logData);
                            
                            if (log.success == true) {
                                res.status(200).send(
                                    parseResponse(true, dataTL, '00', 'Close Rekomendasi Controller Success')
                                )
                            }
                        }
                    }
                } else {
                    let logData = [
                        {key:'ID_LHA', value:dataLHA.ID_LHA},
                        {key:'UserId', value:auditorBy},
                        {key:'Activity', value:'Close Rekomendasi (Status A3 / CLOSE)'},
                        {key:'AdditionalInfo', value:'Close Rekomendasi : '+dataRek.JudulRekomendasi+', Judul Temuan : '+dataTemuan.JudulTemuan+'.'},
                        {key:'Type', value:'Approval'}
                    ]
                    let log = await LogActivityModel.save(logData);
                    
                    if (log.success == true) {
                        res.status(200).send(
                            parseResponse(true, dataTL, '00', 'Close Rekomendasi Controller Success')
                        )
                    }
                }
            }
        } else {
            statusCode      = 200
            responseCode    = '43'
            message         = 'Rekomendasi & Tindak lanjut tidak ditemukan !'
            acknowledge     = false
            result          = null

            // return response
            res.status(statusCode).send(
                parseResponse(acknowledge, result, responseCode, message)
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


TLController.rejectTLRekomendasiController = async(req, res, next) => {
    console.log(`├── ${log} :: Reject TL Rekomendasi Controller`);

    try{
        let {idRekomendasi, catatanAuditor, createdBy} = req.body

        let whereR = [{key:'ID_REKOMENDASI', value:idRekomendasi}]
        let dataRek = await RekomendasiModel.getBy('*', whereR)
        let whereT = [{key:'ID_Temuan', value:dataRek.ID_TEMUAN}]
        let dataTemuan = await TemuanModel.getBy('*', whereT)
        let whereL = [{key:'ID_LHA', value:dataTemuan.ID_LHA}]
        let dataLHA = await LHAModel.getBy('*', whereL)

        let dataTL = [
            {key:'CatatanFungsi', value:catatanAuditor},
            {key:'StatusTL', value:'A4'},
            {key:'AuditorBy', value:createdBy}            
        ]
        let whereTL = [{key:'ID_RF', value: idRekomendasi}]
        let saveTL = await TLModel.save(dataTL, whereTL);

        if (saveTL.success == true) {
            let whereRekomendasi = [{key:'ID_REKOMENDASI', value: idRekomendasi}]
            let statusRek = [{key:'StatusTL',value:'A4'}]
            let saveStatusRek = await RekomendasiModel.save(statusRek, whereRekomendasi)

            if (saveStatusRek.success == true) {
                let logData = [
                    {key:'ID_LHA', value:dataLHA.ID_LHA},
                    {key:'UserId', value:createdBy},
                    {key:'Activity', value:'Reject Rekomendasi (Status A4 / REJECT)'},
                    {key:'AdditionalInfo', value:'Reject Rekomendasi : '+dataRek.JudulRekomendasi+', Judul Temuan : '+dataTemuan.JudulTemuan+'.'},
                    {key:'Type', value:'Approval'}
                ]
                let log = await LogActivityModel.save(logData);

                if (log.success == true) {
                    // return response
                    res.status(200).send(
                        parseResponse(true, dataTL, 00, 'Reject TL Rekomendasi Controller Success')
                    )                   
                }
            }
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


TLController.perpanjangDueDateController = async(req, res, next) => {
    console.log(`├── ${log} :: Perpanjang Due Date Rekomendasi Controller`);

    try{
        let {idRekomendasi, dueDate, createdBy } = req.body

        let whereR = [{key:'ID_REKOMENDASI', value:idRekomendasi}]
        let dataRek = await RekomendasiModel.getBy('*', whereR)
        let whereT = [{key:'ID_Temuan', value:dataRek.ID_TEMUAN}]
        let dataTemuan = await TemuanModel.getBy('*', whereT)
        let whereL = [{key:'ID_LHA', value:dataTemuan.ID_LHA}]
        let dataLHA = await LHAModel.getBy('*', whereL)

        let dataRekomendasi = [
            {key:'DueDate', value: moment(dueDate).format('YYYY-MM-DD')}
        ]
        let whereRekomendasi = [{key:'ID_REKOMENDASI', value: idRekomendasi}]
        let saveTL = await RekomendasiModel.save(dataRekomendasi, whereRekomendasi);

        if (saveTL.success == true) {
            let dataTL = [
                {key:'AuditorBy', value:createdBy}
            ]
            let whereTL = [{key:'ID_RF', value: idRekomendasi}]
            let updateTL = await TLModel.save(dataTL, whereTL);

            if (updateTL.success == true) {
                let logData = [
                    {key:'ID_LHA', value:dataLHA.ID_LHA},
                    {key:'UserId', value:createdBy},
                    {key:'Activity', value:'Perpanjang Due Date Rekomendasi'},
                    {key:'AdditionalInfo', value:'Perpanjang Due Date Rekomendasi '+ moment(dataRek.DueDate).format('DD MMMM YYYY')+' to '+ moment(dueDate).format('DD MMMM YYYY')},
                    {key:'Type', value:'Approval'}
                ]
                let log = await LogActivityModel.save(logData);
    
                if (log.success == true) {
                    res.status(200).send(
                        parseResponse(true, dataTL, 00, 'Perpanjang Due Date Rekomendasi Controller Success')
                    )                   
                }                
            }
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

module.exports = TLController