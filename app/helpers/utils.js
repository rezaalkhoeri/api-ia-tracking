/**
 * Utils use for reused functions 
 * or global function
 */

const moment = require('moment')
const utils = {}

utils.setEndOfDay = (date) => {
    if (date) {
        return moment(date).add(23, 'h').add(59, 'm').add(59, 's')
    }
    return date
}

utils.dateDiffIndays  = (dateStart, dateEnd) => {
    dt1 = new Date(dateStart);
    dt2 = new Date(dateEnd);

    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
}

utils.daysInMonth = (iMonth, iYear) => {
    return new Date(iYear, iMonth, 0).getDate();
}

module.exports = utils