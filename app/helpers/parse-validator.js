const _         = require('lodash');
const Validator = {}

Validator.parseValidator = (error) => {
    let result    = {};
    let transform = [];
    let message   = [];
    
    // transform array object to object and grouping by param
    transform = _.transform(error, function(res, value, key) {
        if (typeof res[`${value.location}`] == 'undefined') {
            res[`${value.location}`] = [];
        }

        if (typeof res[`${value.location}`][`${value.param}`] == 'undefined') {
            res[`${value.location}`][`${value.param}`] = [];
        }

        res[`${value.location}`][`${value.param}`].push(value.msg);
    }, {});

    // transform result to array message
    for (var key in transform) {
        if (typeof result[`${key}`] == 'undefined') {
            result[`${key}`] = [];
        }
        for (var k in transform[key]) {
            result[`${key}`].push({ param: k, messages: transform[key][k] });

            if (transform.hasOwnProperty(key) && key == 'body') {
                message.push(k);
            }
        }
    }

    let messages = 'Invalid param ' + message.join(', ');
    
    return { result, messages };
}

module.exports  = Validator