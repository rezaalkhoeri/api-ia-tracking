const CoreDB            = require('../lib/Coredb');
const PICModel         = {}

PICModel.save = async (data, condition = []) => {
    let result  = null;

    CoreDB.setTable('tblm_pic');
    if (condition.length > 0) {
        result  = await CoreDB.update(data, condition);
    } else {
        result  = await CoreDB.create(data);
    }

    return result;
}

PICModel.delete = async (condition) => {
    CoreDB.setTable('tblm_pic');

    return await CoreDB.delete(condition);
}

PICModel.getBy = async (fields = '*', condition, join = [], group = []) => {
    CoreDB.setTable('tblm_pic');

    return await CoreDB.getBy(fields, condition, join, group);
}

PICModel.getAll = async (fields = '*', condition = [], join = [], group = [], sort = []) => {
    CoreDB.setTable('tblm_pic');

    return await CoreDB.getAll(fields, condition, join, group, sort);
}

PICModel.getPaging = async (fields = '*', condition = [], join = [], group = [], sort = [], page = 1) => {
    CoreDB.setTable('tblm_pic');

    return await CoreDB.getPaging(fields, condition, join, group, sort, page, 2);
}

PICModel.QueryCustom = async (query, value = []) => {
    return await CoreDB.query(query, value);
}


module.exports  = PICModel;
