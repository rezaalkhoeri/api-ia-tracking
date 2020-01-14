const CoreDB            = require('../lib/Coredb');
const LHAModel         = {}

LHAModel.save = async (data, condition = []) => {
    let result  = null;

    CoreDB.setTable('tblt_lha');
    if (condition.length > 0) {
        result  = await CoreDB.update(data, condition);
    } else {
        result  = await CoreDB.create(data);
    }

    return result;
}

LHAModel.delete = async (condition) => {
    CoreDB.setTable('tblt_lha');

    return await CoreDB.delete(condition);
}

LHAModel.getBy = async (fields = '*', condition, join = [], group = []) => {
    CoreDB.setTable('tblt_lha');

    return await CoreDB.getBy(fields, condition, join, group);
}

LHAModel.getAll = async (fields = '*', condition = [], join = [], group = [], sort = []) => {
    CoreDB.setTable('tblt_lha');

    return await CoreDB.getAll(fields, condition, join, group, sort);
}

LHAModel.getPaging = async (fields = '*', condition = [], join = [], group = [], sort = [], page = 1) => {
    CoreDB.setTable('tblt_lha');

    return await CoreDB.getPaging(fields, condition, join, group, sort, page, 2);
}

LHAModel.QueryCustom = async (query, value = []) => {
    return await CoreDB.query(query, value);
}


module.exports  = LHAModel;
