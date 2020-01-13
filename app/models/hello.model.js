const CoreDB            = require('../lib/Coredb');
const HelloModel         = {}

HelloModel.save = async (data, condition = []) => {
    let result  = null;

    CoreDB.setTable('hello');
    if (condition.length > 0) {
        result  = await CoreDB.update(data, condition);
    } else {
        result  = await CoreDB.create(data);
    }

    return result;
}

HelloModel.delete = async (condition) => {
    CoreDB.setTable('hello');

    return await CoreDB.delete(condition);
}

HelloModel.getBy = async (fields = '*', condition, join = [], group = []) => {
    CoreDB.setTable('hello');

    return await CoreDB.getBy(fields, condition, join, group);
}

HelloModel.getAll = async (fields = '*', condition = [], join = [], group = [], sort = []) => {
    CoreDB.setTable('hello');

    return await CoreDB.getAll(fields, condition, join, group, sort);
}

HelloModel.getPaging = async (fields = '*', condition = [], join = [], group = [], sort = [], page = 1) => {
    CoreDB.setTable('hello');

    return await CoreDB.getPaging(fields, condition, join, group, sort, page, 2);
}

HelloModel.QueryCustom = async (query, value = []) => {
    return await CoreDB.query(query, value);
}


module.exports  = HelloModel;
