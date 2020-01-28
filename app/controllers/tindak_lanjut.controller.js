const TLController                  = {}
const TLModel                       = require('../models/TL.model');
const TemuanModel                   = require('../models/temuan.model');
const RekomendasiModel              = require('../models/rekomendasi.model');
const FungsiRekomendasiModel        = require('../models/fungsi_rekomendasi.model');
const parseResponse                 = require('../helpers/parse-response')
const log                           = 'TL controller';

TLController.auditeeTLController = async(req, res, next) => {
    console.log(`├── ${log} :: Get TL Controller`);

    try{

        let { action, idRF } = req.body

        if (action == 'create') {
            let { judulRekomendasi, catatanAuditee, createdBy } = req.body

            if (!req.files || Object.keys(req.files).length === 0) {
                statusCode      = 200
                responseCode    = '40'
                message         = 'No Files were uploaded !'
                acknowledge     = false
                result          = null
            } else {
                sampleFile = req.files.dokumenTL;
                uploadPath = __dirname+'./../public/Dokumen TL/'+'TL'+'_'+sampleFile.name; 
                
                sampleFile.mv(uploadPath, function(err) {
                    if (err) {
                        statusCode      = 200
                        responseCode    = '41'
                        message         = 'Upload dokumen gagal !'
                        acknowledge     = false
                        result          = null        
                    }
                });
    
                let dataTL = [
                    { key:'ID_RF', value:idRF},
                    { key:'DokumenTL', value: 'TL_'+judulRekomendasi+'_'+sampleFile.name },
                    { key:'CatatanAudit', value:catatanAuditee},
                    { key:'StatusTL', value:'A0'},
                    { key:'CreatedBy', value:createdBy}
                ]
    
                let insertTL = await TLModel.save(dataTL)
                
                if (insertTL.success == true) {
                    res.status(200).send(
                        parseResponse(true, dataTL, '00', 'Insert TL Controller Success')
                    )            
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

                    statusCode      = 200
                    responseCode    = '00'
                    message         = 'Update Status Controller Success'
                    acknowledge     = true
                    result          = postData
                    
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

module.exports = TLController