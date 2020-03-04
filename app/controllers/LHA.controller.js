const LHAController             = {}
const LHAModel                  = require('../models/lha.model');
const TemuanModel               = require('../models/temuan.model');
const RekomendasiModel          = require('../models/rekomendasi.model');
const FungsiRekomendasiModel    = require('../models/fungsi_rekomendasi.model');
const LogActivityModel              = require('../models/log_activity.model')
const TLModel                   = require('../models/TL.model');
const _                         = require('lodash');
const moment                    = require('moment');
const parseResponse             = require('../helpers/parse-response')
const log                       = 'LHA controller';

function getUnique(arr, comp) {
    const unique = arr
    .map(e => e[comp])
    // store the keys of the unique objects
    .map((e, i, final) => final.indexOf(e) === i && i)        
    // eliminate the dead keys & store unique objects
    .filter(e => arr[e]).map(e => arr[e]);        
    return unique;
}

LHAController.getLHAController = async(req, res, next) => {
    console.log(`├── ${log} :: Get LHA Controller`);

    try{
        let {status} = req.body

        if (status == 'all') {
            // let { search, limit, offset } = req.body
            let dbLHA = await LHAModel.QueryCustom(`CALL SP_GET_ALL_DATA`);
            let obj = dbLHA.rows[0]
            result = _.map(obj, function(data){     
                return dataLHA = {
                    ID_LHA              : data.ID_LHA,
                    NomorLHA            : data.NomorLHA,
                    JudulLHA            : data.JudulLHA,
                    TanggalLHA          : moment(data.TanggalLHA).format('YYYY-MM-DD'),
                    TipeLHA             : data.TipeLHA,
                    StatusLHA           : data.StatusLHA,
                    TotalTemuan         : data.TotalTemuan,
                    TotalRekomendasi    : data.TotalRekomendasi
                }
            });
    
            // success
            res.status(200).send(
                parseResponse(true, result, '00', 'Get LHA Controller Success')
            )
        } else {
            let dbLHA = await LHAModel.QueryCustom(`CALL SP_VIEW_LHA_WHERE('`+status+`')`);
            let obj = dbLHA.rows[0]
            result = _.map(obj, function(data){      
                return dataRekomendasi = {
                    ID_LHA              : data.ID_LHA,
                    NomorLHA            : data.NomorLHA,
                    JudulLHA            : data.JudulLHA,
                    TanggalLHA          : moment(data.TanggalLHA).format('YYYY-MM-DD'),
                    TipeLHA             : data.TipeLHA,
                    StatusLHA           : data.StatusLHA,
                    TotalTemuan         : data.TotalTemuan,
                    TotalRekomendasi    : data.TotalRekomendasi
                };
            });
    
            // success
            res.status(200).send(
            parseResponse(true, result, '00', 'Get LHA Controller Success')
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

LHAController.getLHAdataController = async(req, res, next) => {
    console.log(`├── ${log} :: Get LHA Controller`);

    try{
        let {status} = req.body

        if (status == 'all') {
            let { search, limit, offset } = req.body
            let dbLHA = await LHAModel.QueryCustom(`CALL SP_VIEW_ALL_DATA('`+ search +`',`+limit+`,`+offset+`)`);           
            let obj = dbLHA.rows[0]
            result = _.map(obj, function(data){     
                return dataLHA = {
                    ID_LHA              : data.ID_LHA,
                    NomorLHA            : data.NomorLHA,
                    JudulLHA            : data.JudulLHA,
                    TanggalLHA          : moment(data.TanggalLHA).format('YYYY-MM-DD'),
                    TipeLHA             : data.TipeLHA,
                    StatusLHA           : data.StatusLHA,
                    TotalTemuan         : data.TotalTemuan,
                    TotalRekomendasi    : data.TotalRekomendasi
                }
            });
    
            // success
            res.status(200).send(
                parseResponse(true, result, '00', 'Get LHA Controller Success')
            )
        } else {
            let dbLHA = await LHAModel.QueryCustom(`CALL SP_VIEW_LHA_WHERE('`+status+`')`);
            let obj = dbLHA.rows[0]
            result = _.map(obj, function(data){      
                return dataRekomendasi = {
                    ID_LHA              : data.ID_LHA,
                    NomorLHA            : data.NomorLHA,
                    JudulLHA            : data.JudulLHA,
                    TanggalLHA          : moment(data.TanggalLHA).format('YYYY-MM-DD'),
                    TipeLHA             : data.TipeLHA,
                    StatusLHA           : data.StatusLHA,
                    TotalTemuan         : data.TotalTemuan,
                    TotalRekomendasi    : data.TotalRekomendasi
                };
            });
    
            // success
            res.status(200).send(
            parseResponse(true, result, '00', 'Get LHA Controller Success')
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

LHAController.getLHAbyIDController = async(req, res, next) => {
    console.log(`├── ${log} :: Get LHA By ID Controller`);

    try{
        let { idLHA } = req.body
        let condition = [{ key:'ID_LHA', value:idLHA}]
        let dbLHA = await LHAModel.getAll('*', condition);

        result = _.map(dbLHA, function(data){
            return dataRekomendasi = {
                ID_LHA              : data.ID_LHA,
                NomorLHA            : data.NomorLHA,
                JudulLHA            : data.JudulLHA,
                DokumenAudit        : data.DokumenAudit,
                TanggalLHA          : moment(data.TanggalLHA).format('YYYY-MM-DD'),
                TipeLHA             : data.TipeLHA,
                StatusLHA           : data.StatusLHA,
                CreatedDate         : moment(data.CreatedDate).format('YYYY-MM-DD'),
                CreatedBy           : data.CreatedBy,
            };
        });

        // success
        res.status(200).send(
            parseResponse(true, result, '00', 'Get LHA Controller Success')
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

LHAController.getTemuanController = async(req, res, next) => {
    console.log(`├── ${log} :: Get Temuan Controller`);

    try{
        let { idLHA } = req.body
        let condition = [{ key:'ID_LHA', value:idLHA }]
        let dbTemuan = await TemuanModel.getAll('*', condition);

        let whereTemuan = []
        for (let y = 0; y < dbTemuan.length; y++) {
            whereTemuan.push([
                { key:'ID_TEMUAN', value: dbTemuan[y].ID_TEMUAN }
            ])
        }

        let result = []
        for (let x = 0; x < whereTemuan.length; x++) {   
            dataTemuan = await TemuanModel.getAll('*', whereTemuan[x])            
            dataRekomendasi = await RekomendasiModel.getAll('*', whereTemuan[x])

            let pic = []
            for (let i = 0; i < dataRekomendasi.length; i++) {
                wherePIC = dataRekomendasi[i].ID_REKOMENDASI
                sql = `SELECT tblt_rekomendasi_fungsi.ID_RF, tblt_rekomendasi.ID_REKOMENDASI, 
                tblm_sub_fungsi.NamaSub, tblm_fungsi.NamaFungsi 
                FROM tblt_rekomendasi 
                LEFT JOIN tblt_rekomendasi_fungsi ON tblt_rekomendasi.ID_REKOMENDASI = tblt_rekomendasi_fungsi.ID_REKOMENDASI
                LEFT JOIN tblm_sub_fungsi ON tblm_sub_fungsi.ID_SUBFUNGSI = tblt_rekomendasi_fungsi.ID_SUBFUNGSI
                LEFT JOIN tblm_fungsi ON tblm_fungsi.ID_FUNGSI = tblm_sub_fungsi.ID_FUNGSI 
                WHERE tblt_rekomendasi.ID_REKOMENDASI =`+wherePIC

                dataPIC = await FungsiRekomendasiModel.QueryCustom(sql)
                pic.push(dataPIC.rows)
            }

            let tindakLanjut = []
            for (let i = 0; i < dataRekomendasi.length; i++) {
                whereIDRF = dataRekomendasi[i].ID_REKOMENDASI
                sql = `SELECT * FROM tblt_rekomendasi_tindaklanjut WHERE tblt_rekomendasi_tindaklanjut.ID_RF =`+whereIDRF
                dataTL = await TLModel.QueryCustom(sql)
                tindakLanjut.push(dataTL.rows)
            }

            resultTemuan = _.map(dataTemuan, function(data){
                return temuanData = {
                    ID_TEMUAN               : data.ID_TEMUAN,
                    ID_LHA                  : data.ID_LHA,
                    JudulTemuan             : data.JudulTemuan,
                    IndikasiBernilaiUang    : data.IndikasiBernilaiUang,
                    Nominal                 : data.Nominal,
                    StatusTemuan            : data.StatusTemuan,
                    CreatedDate             : moment(data.CreatedDate).format('YYYY-MM-DD'),
                    CreatedBy               : data.CreatedBy
                };
            });
    
            resultRekomendasi = _.map(dataRekomendasi, function(data){
                return rekomendasiData = {
                    ID_REKOMENDASI     : data.ID_REKOMENDASI,
                    ID_TEMUAN          : data.ID_TEMUAN,
                    JudulRekomendasi   : data.JudulRekomendasi,
                    BuktiTindakLanjut  : data.BuktiTindakLanjut,
                    StatusTL           : data.StatusTL,
                    DueDate            : moment(data.DueDate).format('YYYY-MM-DD'),
                    CloseDate          : moment(data.CloseDate).format('YYYY-MM-DD'),
                    CreatedDate        : moment(data.CreatedDate).format('YYYY-MM-DD'),
                    CreatedBy          : data.CreatedBy
                };
            });

            NamaFungsi = []
            NamaFungsi.push(_.map(pic[0], function(data){
                return rekomendasiData = {
                    NamaFungsi     : data.NamaFungsi,
                };
            }))
            NamaSub = []
            NamaSub.push(_.map(pic[0], function(data){
                return rekomendasiData = {
                    NamaSub     : data.NamaSub,
                };
            }))
            
            result.push([{
                temuan : resultTemuan,
                rekomendasi : resultRekomendasi,
                pic : { 
                    dataFungsi : getUnique(NamaFungsi[0],'NamaFungsi'),
                    dataSub : NamaSub[0]
                },
                TL : tindakLanjut[0]
            }])            
        }
        
        // success
        res.status(200).send(
            parseResponse(true, result, '00', 'Get Temuan Controller Success')
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

LHAController.getTemuanbyIDController = async(req, res, next) => {
    console.log(`├── ${log} :: Get Temuan By ID Controller`);

    try{
        let { idTemuan } = req.body
        let condition = [{ key:'ID_TEMUAN', value:idTemuan}]
        let db = await TemuanModel.getAll('*', condition);

        resultTemuan = _.map(db, function(data){
            return temuanData = {
                ID_TEMUAN               : data.ID_TEMUAN,
                ID_LHA                  : data.ID_LHA,
                JudulTemuan             : data.JudulTemuan,
                IndikasiBernilaiUang    : data.IndikasiBernilaiUang,
                Nominal                 : data.Nominal,
                StatusTemuan            : data.StatusTemuan,
                CreatedDate             : moment(data.CreatedDate).format('YYYY-MM-DD'),
                CreatedBy               : data.CreatedBy
            };
        });
        
        // success
        res.status(200).send(
            parseResponse(true, resultTemuan, '00', 'Get Temuan Controller Success')
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

LHAController.getRekomendasibyIDController = async(req, res, next) => {
    console.log(`├── ${log} :: Get Rekomendasi By ID Controller`);

    try{
        let { idRekomendasi } = req.body
        let condition = [{ key:'ID_Rekomendasi', value:idRekomendasi}]
        let db = await RekomendasiModel.getAll('*', condition);

        let sql = `SELECT tblm_sub_fungsi.NamaSub, tblm_fungsi.NamaFungsi FROM tblm_sub_fungsi 
        JOIN tblm_fungsi ON tblm_sub_fungsi.ID_FUNGSI = tblm_fungsi.ID_FUNGSI
        JOIN tblt_rekomendasi_fungsi ON tblm_sub_fungsi.ID_SUBFUNGSI = tblt_rekomendasi_fungsi.ID_SUBFUNGSI
        WHERE tblt_rekomendasi_fungsi.ID_REKOMENDASI =` + idRekomendasi

        let pic = await FungsiRekomendasiModel.QueryCustom(sql);

        resultRekomendasi = _.map(db, function(data){
            return rekomendasiData = {
                ID_REKOMENDASI     : data.ID_REKOMENDASI,
                ID_TEMUAN          : data.ID_TEMUAN,
                JudulRekomendasi   : data.JudulRekomendasi,
                BuktiTindakLanjut  : data.BuktiTindakLanjut,
                StatusTL           : data.StatusTL,
                DueDate            : moment(data.DueDate).format('YYYY-MM-DD'),
                CloseDate          : moment(data.CloseDate).format('YYYY-MM-DD'),
                CreatedDate        : moment(data.CreatedDate).format('YYYY-MM-DD'),
                CreatedBy          : data.CreatedBy
            };
        });

        resultFungsi = _.map(pic.rows, function(data){
            return rekomendasiData = {
                NamaFungsi     : data.NamaFungsi,
            };
        });
       
        resultSubFungsi = _.map(pic.rows, function(data){
            return rekomendasiData = {
                SubFungsi     : data.NamaSub,
            };
        });

        let postData = [{
            rekomendasi : resultRekomendasi,
            NamaFungsi : getUnique(resultFungsi,'NamaFungsi'),
            NamaSub : resultSubFungsi
        }]
 
        // success
        res.status(200).send(
            parseResponse(true, postData, '00', 'Get Rekomendasi Controller Success')
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

LHAController.getRekomendasiController = async(req, res, next) => {
    console.log(`├── ${log} :: Get Rekomendasi Controller`);

    try{

        let sql = `SELECT LHA.ID_LHA, LHA.NomorLHA, LHA.JudulLHA, T.ID_TEMUAN, T.JudulTemuan, 
                    R.ID_REKOMENDASI, R.JudulRekomendasi, LHA.TipeLHA, R.DueDate, R.StatusTL
                    FROM tblt_rekomendasi R
                    LEFT JOIN tblt_temuan T ON T.ID_TEMUAN = R.ID_TEMUAN
                    INNER JOIN tblt_lha LHA ON LHA.ID_LHA = T.ID_LHA
                    WHERE LHA.StatusLHA = 'A1' AND T.StatusTemuan = 'A1' AND R.StatusTL = 'A1' 
                    OR R.StatusTL = 'A4'
                    ORDER BY R.DueDate DESC`

        let dbRekomendasi = await TemuanModel.QueryCustom(sql);
        let obj = dbRekomendasi.rows

        result = _.map(obj, function(data){      
            return dataRekomendasi = {
                ID_LHA              : data.ID_LHA,
                NomorLHA            : data.NomorLHA,
                JudulLHA            : data.JudulLHA,
                ID_TEMUAN           : data.ID_TEMUAN,
                JudulTemuan         : data.JudulTemuan,
                ID_REKOMENDASI      : data.ID_REKOMENDASI,
                JudulRekomendasi    : data.JudulRekomendasi,
                TipeLHA             : data.TipeLHA,
                DueDate             : moment(data.DueDate).format('YYYY-MM-DD'),
                StatusTL            : data.StatusTL,
            };
        });

        // success
        res.status(200).send(
            parseResponse(true, result, '00', 'Get Rekomendasi Controller Success')
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

LHAController.searchLHAController = async(req, res, next) => {
    console.log(`├── ${log} :: Search LHA Controller`);

    try{

        let { page } = req.body

        if ( page == 'auditor') {
            let { tipe, dueDate, status } = req.body
            let sql = `SELECT LHA.ID_LHA, LHA.NomorLHA, LHA.JudulLHA, LHA.TanggalLHA, LHA.TipeLHA, LHA.StatusLHA, coalesce(X.totTemuan, 0) AS TotalTemuan, coalesce(Y.totRekomendasi, 0) AS TotalRekomendasi
                        FROM tblt_lha LHA 
                        LEFT JOIN ( SELECT COUNT(T.ID_LHA) as totTemuan, T.ID_LHA 
                        FROM tblt_lha L 
                        LEFT JOIN tblt_temuan T on L.ID_LHA = T.ID_LHA group by T.ID_LHA ) as X ON LHA.ID_LHA = X.ID_LHA 
                        LEFT JOIN ( SELECT count(temuan.id_lha) as totRekomendasi , temuan.id_lha
                        FROM tblt_temuan temuan 
                        RIGHT JOIN tblt_rekomendasi rek on temuan.ID_TEMUAN = rek.ID_TEMUAN group BY temuan.id_lha ) as Y ON Y.id_lha = X.ID_LHA
                        WHERE LHA.TipeLHA = '`+ tipe +`' AND CURDATE() `+ dueDate +` LHA.TanggalLHA AND LHA.StatusLHA = '`+ status +`'`
    
            let dbSearch = await LHAModel.QueryCustom(sql);
    
            // success
            res.status(200).send(
                parseResponse(true, dbSearch, '00', 'Get Rekomendasi Controller Success')
            )            
        } else if( page == 'auditee') {
            let { tipe, dueDate } = req.body
            let sql = `SELECT LHA.ID_LHA, LHA.NomorLHA, LHA.JudulLHA, T.ID_TEMUAN, T.JudulTemuan, R.ID_REKOMENDASI, R.JudulRekomendasi, LHA.TipeLHA, R.DueDate, R.StatusTL
                        FROM tblt_rekomendasi R
                        LEFT JOIN tblt_temuan T ON T.ID_TEMUAN = R.ID_TEMUAN
                        INNER JOIN tblt_lha LHA ON LHA.ID_LHA = T.ID_LHA
                        WHERE LHA.StatusLHA = 'A1' AND T.StatusTemuan = 'A1' AND R.StatusTL = 'A1' 
                        AND LHA.TipeLHA = '`+ tipe +`' AND CURDATE()`+ dueDate +`R.DueDate
                        ORDER BY LHA.NomorLHA ASC`            
    
            let dbSearch = await LHAModel.QueryCustom(sql);
    
            // success
            res.status(200).send(
                parseResponse(true, dbSearch, '00', 'Get Rekomendasi Controller Success')
            )                        
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

LHAController.editPICfungsiController = async(req, res, next) => {
    console.log(`├── ${log} :: Edit PIC Fungsi Rekomendasi Controller`);

    try{
        let { idRekomendasi, createdBy } = req.body

        let whereR = [{key:'ID_REKOMENDASI', value:idRekomendasi}]
        let dataRek = await RekomendasiModel.getBy('*', whereR)
        let whereT = [{key:'ID_Temuan', value:dataRek.ID_TEMUAN}]
        let dataTemuan = await TemuanModel.getBy('*', whereT)
        let whereL = [{key:'ID_LHA', value:dataTemuan.ID_LHA}]
        let dataLHA = await LHAModel.getBy('*', whereL)


        let where = [{key:'ID_REKOMENDASI', value:idRekomendasi}]
        let checkID = await FungsiRekomendasiModel.getAll('*', where)
        if (checkID.length > 0) {
            let deleteOldPIC = await FungsiRekomendasiModel.delete(where)

            if (deleteOldPIC.success = true) {
                let { picFungsi, dueDate } = req.body

                let GetPicFungsi = JSON.parse(picFungsi)

                let dataFungsi = []
                for (let i = 0; i < GetPicFungsi.length; i++) {
                    dataFungsi.push([
                        {key:'ID_REKOMENDASI', value:idRekomendasi},
                        {key:'ID_SUBFUNGSI', value:GetPicFungsi[i].idSubFungsi}
                    ])
                }

                let dueDateData = [{key:'DueDate', value:dueDate}]
                let updateDate = await RekomendasiModel.save(dueDateData, where)

                let updateResult = []
                for (let x = 0; x < dataFungsi.length; x++) {
                    let update = await FungsiRekomendasiModel.save(dataFungsi[x])
                    updateResult.push(update.success)
                }

                let updatePICFungsi = updateResult.every(myFunction);
                function myFunction(value) {
                    return value == true;
                }

                if (updatePICFungsi && updateDate.success == true) {
                    let logData = [
                        {key:'ID_LHA', value:dataLHA.ID_LHA},
                        {key:'UserId', value:createdBy},
                        {key:'Activity', value:'Edit PIC Fungsi'},
                        {key:'AdditionalInfo', value:'Edit PIC Fungsi Rekomendasi : '+dataRek.JudulRekomendasi+', Judul Temuan : '+dataTemuan.JudulTemuan+'.'},
                        {key:'Type', value:'New'}
                    ]
                    let log = await LogActivityModel.save(logData);

                    if (log.success == true) {
                        statusCode      = 200
                        responseCode    = '00'
                        message         = 'Edit PIC Fungsi Rekomendasi Berhasil !'
                        acknowledge     = false
                        result          = dataFungsi                                   
                    }                    
                }
            }
        } else {
            let { picFungsi, dueDate } = req.body

            let GetPicFungsi = JSON.parse(picFungsi)

            let dataFungsi = []
            for (let i = 0; i < GetPicFungsi.length; i++) {
                dataFungsi.push([
                    {key:'ID_REKOMENDASI', value:idRekomendasi},
                    {key:'ID_SUBFUNGSI', value:GetPicFungsi[i].idSubFungsi}
                ])
            }

            let dueDateData = [{key:'DueDate', value:dueDate}]
            let updateDate = await RekomendasiModel.save(dueDateData, where)

            let updateResult = []
            for (let x = 0; x < dataFungsi.length; x++) {
                let update = await FungsiRekomendasiModel.save(dataFungsi[x])
                updateResult.push(update.success)
            }

            let updatePICFungsi = updateResult.every(myFunction);
            function myFunction(value) {
                return value == true;
            }

            if (updatePICFungsi && updateDate.success == true) {
                let logData = [
                    {key:'ID_LHA', value:dataLHA.ID_LHA},
                    {key:'UserId', value:createdBy},
                    {key:'Activity', value:'Edit PIC Fungsi'},
                    {key:'AdditionalInfo', value:'Edit PIC Fungsi Rekomendasi : '+dataRek.JudulRekomendasi+', Judul Temuan : '+dataTemuan.JudulTemuan+'.'},
                    {key:'Type', value:'New'}
                ]
                let log = await LogActivityModel.save(logData);

                if (log.success == true) {
                    statusCode      = 200
                    responseCode    = '00'
                    message         = 'Edit PIC Fungsi Rekomendasi Berhasil !'
                    acknowledge     = false
                    result          = dataFungsi
                }
            }
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

LHAController.deleteLHAController = async(req, res, next) => {
    console.log(`├── ${log} :: Delete LHA Controller`);

    try{
        let {idLHA, deletedBy} = req.body

        let where = [{key:'ID_LHA', value:idLHA}]
        let getLHA = await LHAModel.getAll('*', where)

        if (getLHA.length > 0) {
            let getTemuan = await TemuanModel.getAll('*', where)

            if (getTemuan.length > 0) {       
                let dataRekomendasi = []
                for (let i = 0; i < getTemuan.length; i++) {
                    let whereT = [{key:'ID_TEMUAN', value:getTemuan[i].ID_TEMUAN}]
                    let getRekomendasi = await RekomendasiModel.getAll('*', whereT)
                    if (getRekomendasi.length > 0) {
                        dataRekomendasi.push(getRekomendasi)                        
                    }
                }

                if (dataRekomendasi.length > 0) {
                    let dataRekFungsi =[]
                    for (let x = 0; x < dataRekomendasi.length; x++) {
                        let whereR = [{key:'ID_REKOMENDASI', value:dataRekomendasi[x][0].ID_REKOMENDASI}]
                        let getRekFungsi = await FungsiRekomendasiModel.getAll('*', whereR)
                        if (getRekFungsi.length > 0) {
                            dataRekFungsi.push(getRekFungsi)
                        }    
                    }

                    if (dataRekFungsi.length > 0) {

                        let deleteLHA = await LHAModel.delete(where)
                        let hasil = []
                        for (let i = 0; i < getTemuan.length; i++) {
                            let idTemuan = [{key:'ID_TEMUAN',value:getTemuan[i].ID_TEMUAN}]
                            let deleteTemuan = await TemuanModel.delete(idTemuan)
                            hasil.push(deleteTemuan.success)
                        }    
                        for (let x = 0; x < dataRekomendasi.length; x++) {
                            let whereIDrek = [{key:'ID_REKOMENDASI', value:dataRekomendasi[x][0].ID_REKOMENDASI}]                            
                            let deleteRek = await RekomendasiModel.delete(whereIDrek)
                            hasil.push(deleteRek.success)
                        }
                        for (let z = 0; z < dataRekFungsi.length; z++) {
                            let whereIDRF = [{key:'ID_RF', value:dataRekFungsi[z][0].ID_RF}]
                            let deleteRF = await FungsiRekomendasiModel.delete(whereIDRF)
                            hasil.push(deleteRF.success)
                        }

                        let hasilDelete = hasil.every(myFunction);
                        function myFunction(value) {
                            return value == true;
                        }                    
    
                        let logData = [
                            {key:'ID_LHA', value:getLHA[0].ID_LHA},
                            {key:'UserId', value:deletedBy},
                            {key:'Activity', value:'Delete LHA'},
                            {key:'AdditionalInfo', value:'LHA '+getLHA[0].JudulLHA+' beserta '+getTemuan.length+' temuan & '+dataRekomendasi.length+' rekomendasi dihapus. '},
                            {key:'Type', value:'Delete'}
                        ]
                        let log = await LogActivityModel.save(logData);
         
                        if (deleteLHA.success && hasilDelete && log.success == true ) {
                            // only delete LHA
                            statusCode      = 200
                            responseCode    = '00'
                            message         = 'Delete LHA Controller Success!'
                            acknowledge     = true
                            result          = logData                    
                        } else {
                            // only delete LHA
                            statusCode      = 200
                            responseCode    = '99'
                            message         = 'Delete LHA Controller Error!'
                            acknowledge     = false
                            result          = null                    
                        }
                    } else {
                        let deleteLHA = await LHAModel.delete(where)
                        let hasil = []
                        for (let i = 0; i < getTemuan.length; i++) {
                            let idTemuan = [{key:'ID_TEMUAN',value:getTemuan[i].ID_TEMUAN}]
                            let deleteTemuan = await TemuanModel.delete(idTemuan)
                            hasil.push(deleteTemuan.success)
                        }    

                        for (let x = 0; x < dataRekomendasi.length; x++) {
                            let whereIDrek = [{key:'ID_REKOMENDASI', value:dataRekomendasi[x][0].ID_REKOMENDASI}]
                            let deleteRek = await RekomendasiModel.delete(whereIDrek)
                            hasil.push(deleteRek.success)
                        }

                        let hasilDelete = hasil.every(myFunction);
                        function myFunction(value) {
                            return value == true;
                        }                    
    
                        let logData = [
                            {key:'ID_LHA', value:getLHA[0].ID_LHA},
                            {key:'UserId', value:deletedBy},
                            {key:'Activity', value:'Delete LHA'},
                            {key:'AdditionalInfo', value:'LHA '+getLHA[0].JudulLHA+' beserta '+getTemuan.length+' temuan & '+dataRekomendasi.length+' rekomendasi dihapus. '},
                            {key:'Type', value:'Delete'}
                        ]
                        let log = await LogActivityModel.save(logData);
         
                        if (deleteLHA.success && hasilDelete && log.success == true ) {
                            // only delete LHA
                            statusCode      = 200
                            responseCode    = '00'
                            message         = 'Delete LHA Controller Success!'
                            acknowledge     = true
                            result          = logData                    
                        } else {
                            // only delete LHA
                            statusCode      = 200
                            responseCode    = '99'
                            message         = 'Delete LHA Controller Error!'
                            acknowledge     = false
                            result          = null                    
                        }   
                    }
                } else {
                    let deleteLHA = await LHAModel.delete(where)
                    let hasilTemuan = []
                    for (let i = 0; i < getTemuan.length; i++) {
                        let idTemuan = [{key:'ID_TEMUAN',value:getTemuan[i].ID_TEMUAN}]
                        let deleteLHA = await TemuanModel.delete(idTemuan)
                        hasilTemuan.push(deleteLHA.success)
                    }

                    let hasilDelete = hasilTemuan.every(myFunction);
                    function myFunction(value) {
                        return value == true;
                    }    

                    let logData = [
                        {key:'ID_LHA', value:getLHA[0].ID_LHA},
                        {key:'UserId', value:deletedBy},
                        {key:'Activity', value:'Delete LHA'},
                        {key:'AdditionalInfo', value:'LHA '+getLHA[0].JudulLHA+' dan '+getTemuan.length+' temuan dihapus. '},
                        {key:'Type', value:'Delete'}
                    ]
                    let log = await LogActivityModel.save(logData);
     
                    if (deleteLHA.success && hasilDelete && log.success == true ) {
                        // only delete LHA
                        statusCode      = 200
                        responseCode    = '00'
                        message         = 'Delete LHA Controller Success!'
                        acknowledge     = true
                        result          = logData                    
                    } else {
                        // only delete LHA
                        statusCode      = 200
                        responseCode    = '99'
                        message         = 'Delete LHA Controller Error!'
                        acknowledge     = false
                        result          = null                    
                    }                   
                }             
            } else {
                let deleteLHA = await LHAModel.delete(where)
                let logData = [
                    {key:'ID_LHA', value:getLHA[0].ID_LHA},
                    {key:'UserId', value:deletedBy},
                    {key:'Activity', value:'Delete LHA'},
                    {key:'AdditionalInfo', value:'LHA '+getLHA[0].JudulLHA+' dihapus.'},
                    {key:'Type', value:'Delete'}
                ]
                let log = await LogActivityModel.save(logData);

                if (deleteLHA.success && log.success == true ) {
                    // only delete LHA
                    statusCode      = 200
                    responseCode    = '00'
                    message         = 'Delete LHA Controller Success!'
                    acknowledge     = true
                    result          = logData                    
                } else {
                    // only delete LHA
                    statusCode      = 200
                    responseCode    = '99'
                    message         = 'Delete LHA Controller Error!'
                    acknowledge     = false
                    result          = null                    
                }
            }
        } else {
            statusCode      = 200
            responseCode    = '40'
            message         = 'LHA tidak ditemukan!'
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

module.exports = LHAController