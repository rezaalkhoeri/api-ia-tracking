const EmailController           = {}
const path                      = require('path')
//const rp                        = require('request-promise')
const LHAModel                  = require('../models/lha.model');
const partnerapis               = require('../helpers/partner-api')
const log                       = 'Email controller'
const moment                    = require('moment')
const ejs                       = require('ejs')
const unirest                     = require('unirest')



EmailController.findRecipient = async (req, res, next) => {
    console.log(`├── ${log} :: Find Recipient`);

    try {
        let {
            idLHA
        } = req.body

        let querySetan = `SELECT pic.EmailPekerja, mf.NamaSub, L.JudulLHA
        FROM tblt_lha L LEFT JOIN tblt_temuan T ON L.ID_LHA = T.ID_LHA 
        LEFT JOIN tblt_rekomendasi r ON r.ID_TEMUAN = T.ID_TEMUAN 
        LEFT JOIN tblt_rekomendasi_fungsi rf ON r.ID_REKOMENDASI = rf.ID_REKOMENDASI 
        LEFT JOIN tblm_pic pic ON rf.ID_SUBFUNGSI = pic.ID_SUBFUNGSI AND pic.Status = '1' 
        LEFT JOIN tblm_sub_fungsi mf ON pic.ID_SUBFUNGSI = mf.ID_SUBFUNGSI 
        WHERE L.ID_LHA = '` + idLHA + `' GROUP BY pic.EmailPekerja, mf.NamaSub, L.JudulLHA`
        console.log(querySetan)
        let receiverData    = await LHAModel.QueryCustom(querySetan)
        
        let emailPenerima = ""
        let judulLha = receiverData.rows[0].JudulLHA 

        for(let x =0; x< receiverData.rows.length; x++){
            if(x == 0){
                emailPenerima += receiverData.rows[x].EmailPekerja 
            } else {
                emailPenerima += "," + receiverData.rows[x].EmailPekerja 
            }
        }
        console.log(emailPenerima)
        req.EmailPekerja     = emailPenerima

        req.emailPengirim       = partnerapis.email.mailSender
        req.namaPengirim        = partnerapis.email.nameSender
        req.judulTemuan         = judulLha

        next()

    } catch(error) {
        let resp = parseResponse(false, null, '99', error)
        next({
            resp,
            status: 500
        })
    }
}

EmailController.sendData = async (req, res, next) => {
    console.log(`├── ${log} :: Send Email Unirest`);

    try {
        let {
            subjectMessage
        } = req.body
        
        const file = path.join(__dirname, `../templates/submitLHA.ejs`)
        
        if (!file) {
            throw new Error(`Could not find the SubmitlHA in path ${file}`)
        }

        let dateTimeNow = moment(new Date()).format('DD-MMMM-YYYY')

        let params = {
            tanggalNow          : dateTimeNow,
            JudulLHA            : req.judulTemuan
        }
        console.log(params)
        let messages
        //messages = await ejs.renderFile(, {})
        ejs.renderFile(file, params, {}, (err, str) => {
            // str => Rendered HTML string
            if (err) {
                let resp = parseResponse(false, null, '99', err)
                next({
                    resp,
                    status: 500
                })

                return
            } else {
                messages = str
            }
        })

        let payloadMail = {
            'description'       : subjectMessage,
            'recipient'         : req.EmailPekerja,
            //'recipient'         : 'rezaalkhoeri2403@gmail.com',
            'recipientCC'       : partnerapis.email.mailSender,
            'recipientBC'       : '',
            'subject'           : subjectMessage,
            'body'              : messages
        }

        console.log("payloadMail")

        var sendEmail = unirest.post(partnerapis.email.url)
        .headers({
            'Content-Type': 'application/x-www-form-urlencoded'
            })
        .send(
            payloadMail
        )
        .timeout(req.timeout)
        .end(function (response) {
            if (!response.ok){
                if (response.error){
                    console.log(response.error);
                    res.status(500).send({"responseCode":"99","responseMessage": "Timeout. Transaction Can't be Processed"});
                }
                else{
                    res.status(response.status).send(response.body);
                }
            }else{
                res.status(response.status).send("Sent sukses");
            }
        });

    } catch(error) {
        console.log('Error exception :' + error)
        let resp = parseResponse(false, null, '99', error)
        next({
            resp,
            status: 500
        })
    }
}

module.exports = EmailController