const CoreDB            = require('../lib/Coredb');
const AppDataModel         = {}

AppDataModel.save = async (data, condition = []) => {
    let result  = null;

    CoreDB.setTable('ms_apps');
    if (condition.length > 0) {
        result  = await CoreDB.update(data, condition);
    } else {
        result  = await CoreDB.create(data);
    }

    return result;
}

AppDataModel.delete = async (condition) => {
    CoreDB.setTable('ms_apps');

    return await CoreDB.delete(condition);
}

AppDataModel.getBy = async (fields = '*', condition, join = [], group = []) => {
    CoreDB.setTable('ms_apps');

    return await CoreDB.getBy(fields, condition, join, group);
}

AppDataModel.getAll = async (fields = '*', condition = [], join = [], group = [], sort = []) => {
    CoreDB.setTable('ms_apps');

    return await CoreDB.getAll(fields, condition, join, group, sort);
}

AppDataModel.getPaging = async (fields = '*', condition = [], join = [], group = [], sort = [], page = 1) => {
    CoreDB.setTable('ms_apps');

    return await CoreDB.getPaging(fields, condition, join, group, sort, page, 2);
}

AppDataModel.QueryCustom = async (query, value = []) => {
    return await CoreDB.query(query, value);
}


module.exports  = AppDataModel;
