const CoreDB = require('../lib/Coredb');
const DueDateModel = {}

DueDateModel.save = async (data, condition = []) => {
    let result = null;

    CoreDB.setTable('tblt_duedate');
    if (condition.length > 0) {
        result = await CoreDB.update(data, condition);
    } else {
        result = await CoreDB.create(data);
    }

    return result;
}

DueDateModel.delete = async (condition) => {
    CoreDB.setTable('tblt_duedate');

    return await CoreDB.delete(condition);
}

DueDateModel.getBy = async (fields = '*', condition, join = [], group = []) => {
    CoreDB.setTable('tblt_duedate');

    return await CoreDB.getBy(fields, condition, join, group);
}

DueDateModel.getAll = async (fields = '*', condition = [], join = [], group = [], sort = []) => {
    CoreDB.setTable('tblt_duedate');

    return await CoreDB.getAll(fields, condition, join, group, sort);
}

DueDateModel.getPaging = async (fields = '*', condition = [], join = [], group = [], sort = [], page = 1) => {
    CoreDB.setTable('tblt_duedate');

    return await CoreDB.getPaging(fields, condition, join, group, sort, page, 2);
}

DueDateModel.QueryCustom = async (query, value = []) => {
    return await CoreDB.query(query, value);
}


module.exports = DueDateModel;
