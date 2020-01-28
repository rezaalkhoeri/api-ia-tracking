const LHAController         = {}
const LHAModel              = require('../models/lha.model');
const TemuanModel                 = require('../models/temuan.model');
const RekomendasiModel            = require('../models/rekomendasi.model');
const FungsiRekomendasiModel      = require('../models/fungsi_rekomendasi.model');
const parseResponse         = require('../helpers/parse-response')
const log                   = 'LHA controller';

LHAController.getLHAController = async(req, res, next) => {
    console.log(`├── ${log} :: Get LHA Controller`);

    try{
        let {status} = req.body

        if (status == 'all') {
            let dbLHA = await LHAModel.QueryCustom('CALL SP_VIEW_ALL_DATA');
            // success
            res.status(200).send(
                parseResponse(true, dbLHA, '00', 'Get LHA Controller Success')
            )
        } else {
            let dbLHA = await LHAModel.QueryCustom(`CALL SP_VIEW_LHA_WHERE('`+status+`')`);
        
            // success
            res.status(200).send(
            parseResponse(true, dbLHA, '00', 'Get LHA Controller Success')
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

        // success
        res.status(200).send(
            parseResponse(true, dbLHA, '00', 'Get LHA Controller Success')
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
            result.push([{
                temuan : await TemuanModel.getAll('*', whereTemuan[x]),
                rekomendasi : await RekomendasiModel.getAll('*', whereTemuan[x])
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

        // success
        res.status(200).send(
            parseResponse(true, db, '00', 'Get Temuan Controller Success')
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

        let sql = `SELECT tblm_fungsi.NamaFungsi FROM tblm_fungsi 
                    JOIN tblt_rekomendasi_fungsi ON tblm_fungsi.ID_FUNGSI = tblt_rekomendasi_fungsi.ID_FUNGSI
                    WHERE tblt_rekomendasi_fungsi.ID_REKOMENDASI =` + idRekomendasi

        let pic = await FungsiRekomendasiModel.QueryCustom(sql);
        
        let postData = [{
            rekomendasi : db,
            PIC : pic.rows
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
                    ORDER BY LHA.NomorLHA ASC`

        let dbRekomendasi = await TemuanModel.QueryCustom(sql);

        // success
        res.status(200).send(
            parseResponse(true, dbRekomendasi, '00', 'Get Rekomendasi Controller Success')
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

module.exports = LHAController