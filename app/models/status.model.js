const CoreDB            = require('../lib/Coredb');
const StatusModel         = {}

StatusModel.save = async (data, condition = []) => {
    let result  = null;

    CoreDB.setTable('tblm_status');
    if (condition.length > 0) {
        result  = await CoreDB.update(data, condition);
    } else {
        result  = await CoreDB.create(data);
    }

    return result;
}

StatusModel.delete = async (condition) => {
    CoreDB.setTable('tblm_status');

    return await CoreDB.delete(condition);
}

StatusModel.getBy = async (fields = '*', condition, join = [], group = []) => {
    CoreDB.setTable('tblm_status');

    return await CoreDB.getBy(fields, condition, join, group);
}

StatusModel.getAll = async (fields = '*', condition = [], join = [], group = [], sort = []) => {
    CoreDB.setTable('tblm_status');

    return await CoreDB.getAll(fields, condition, join, group, sort);
}

StatusModel.getPaging = async (fields = '*', condition = [], join = [], group = [], sort = [], page = 1) => {
    CoreDB.setTable('tblm_status');

    return await CoreDB.getPaging(fields, condition, join, group, sort, page, 2);
}

StatusModel.QueryCustom = async (query, value = []) => {
    return await CoreDB.query(query, value);
}


module.exports  = StatusModel;
