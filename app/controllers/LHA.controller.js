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
        let dbLHA = await LHAModel.getAll('*', []);

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

        // success
        res.status(200).send(
            parseResponse(true, dbTemuan, '00', 'Get Temuan Controller Success')
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
        let { idLHA } = req.body
        let condition = [{ key:'ID_LHA', value:idLHA }]
        let dbTemuan = await TemuanModel.getAll('*', condition);

        // success
        res.status(200).send(
            parseResponse(true, dbTemuan, '00', 'Get Rekomendasi Controller Success')
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
        let { tipe, dueDate, status } = req.body
        let sql = `SELECT * FROM tblt_lha WHERE tblt_lha.TipeLHA = '`+ tipe +`' AND CURDATE() `+ dueDate +` tblt_lha.TanggalLHA AND tblt_lha.StatusLHA = '`+ status +`'`
        let dbSearch = await TemuanModel.QueryCustom(sql);

        // success
        res.status(200).send(
            parseResponse(true, dbSearch, '00', 'Get Rekomendasi Controller Success')
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