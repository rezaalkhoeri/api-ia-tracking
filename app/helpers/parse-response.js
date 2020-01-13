module.exports = parseResponse = (acknowledge, data, code, message = 'Something went wrong') => {
    const response = 
        {
            "acknowledge": acknowledge,
            "responseCode": code,
            "responseMessage": message,
            "responseData": data,
        }
    
    return response
}