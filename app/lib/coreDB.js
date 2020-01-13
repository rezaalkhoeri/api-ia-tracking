const mysql     = require('mysql')
const DB        = mysql.createPool({
    connectionLimit: CONFIG.CONNECTION_LIMIT,
    host: CONFIG.DB_HOST,
    user: CONFIG.DB_USER,
    password: CONFIG.DB_PASS,
    database: CONFIG.DB_NAME
})

DB.on('acquire', (connection) => {
    console.log('│  ├── DB :: connection %d acquired', connection.threadId);
});

DB.on('connection', (connection) => {
    console.log('│  ├── DB :: connection created %d', connection.threadId);
});

DB.on('enqueue', (connection) => {
    console.log('│  ├── DB :: queued to wait for an available connection %d', connection.threadId);
});

DB.on('release', (connection) => {
    console.log('│  ├── DB :: connection %d released', connection.threadId);
});

const CoreDB    = {};

/* Set Table
 * @param tbl          : string
 */
let table       = '';
CoreDB.setTable = (tbl) => { table  = tbl; };

/* Query
 * @param query        : string
 * @param values       : array -> [{ key: fieldName, value: value }, ...]
 */
CoreDB.query = (query, values = []) => {
    return new Promise((resolve, reject) => {
        try {
            DB.getConnection((err, connection) => {
                if(err) {
                    console.log(`│  ├── Database connection :: error`);
                    reject(err)
                } else  {
                    connection.query(query, values, (error, result, fields) => {
                        connection.release();

                        if (error) {
                            console.log(`│  ├── query -> ${error.sqlMessage}`)
                            console.log(`│  ├── query -> ${query}`)
                            reject(error);
                        } else {
                            console.log(`│  ├── query -> success`)
                            let res = { success: true, rows: result };
                            resolve(res);
                        }
                    });
                }
            })
        } catch (error) {
            reject(error);
        }
    })
}

/* Create Single Data
 * @param data         : array -> [{ key: fieldName, value: value }, ...]
 */
CoreDB.create = (data) => {
    return new Promise((resolve, reject) => {
        let fields  = [];
        let vals    = [];
        let values  = [];
        let field   = [];
        let val     = [];
        let log     = `DB :: ${table} :: create`;

        // generate insert query
        if (data.length > 0) {
            data.map(function(val, key) {
                fields.push(`${val.key}`);
                vals.push('?');
                values.push(val.value);
            });
            field  = fields.join(', ');
            val    = vals.join(', ');
        } else {
            const error = { code: 400, message: 'Invalid data' }
            reject(error);
        }

        let query   = `INSERT INTO ${table} (${field}) VALUES (${val})`;
        try {
            DB.getConnection((err, connection) => {
                if(err) {
                    console.log(`│  ├── Database connection :: error`);
                    reject(err)
                } else  {
                    connection.query(query, values, (error, result, fields) => {
                        connection.release();

                        if (error) {
                            console.log(`│  ├── ${log} -> ${error.sqlMessage}`)
                            console.log(`│  ├── ${log} -> ${query}`)
                            reject(error);
                        } else {
                            console.log(`│  ├── ${log} -> success`)
                            let res = { success: true, rows: result.affectedRows };
                            resolve(res);
                        }
                    });
                }
            })
        } catch (error) {
            reject(error);
        }
    })
}

/* Update Data
 * @param data         : array -> [{ key: fieldName, value: value }, ...]
 * @param condition    : array -> [{ key: fieldName, value: value }, ...]
 */
CoreDB.update = (data, condition) => {
    return new Promise((resolve, reject) => {
        let fields      = [];
        let values      = [];
        let cond_fields = [];
        let field       = [];
        let cond_field  = [];
        let log         = `DB :: ${table} :: update`;

        // generate update query
        if (data.length > 0) {
            data.map(function(val, key) {
                if (val.value == 'NOW()') {
                    fields.push(`${val.key} = NOW()`);
                } else {
                    fields.push(`${val.key} = ?`);
                    values.push(val.value);
                }
            });
            field   = fields.join(', ');
        } else {
            const error = { code: 400, message: 'Invalid data' }
            reject(error);
        }

        // generate condition query
        if (condition.length > 0) {
            condition.map(function(val, key) {
                cond_fields.push(`${val.key} = ?`);
                values.push(val.value);
            });
            cond_field  = cond_fields.join(' AND ');
            cond_field  = ` AND ${cond_field}`;
        } else {
            cond_fields  = '';
        }

        let query   = `UPDATE ${table} SET ${field} WHERE 1 ${cond_field}`;
        try {
            DB.getConnection((err, connection) => {
                if(err) {
                    console.log(`│  ├── Database connection :: error`);
                    reject(err)
                } else  {
                    connection.query(query, values, (error, result, fields) => {
                        connection.release();

                        if (error) {
                            console.log(`│  ├── ${log} -> ${error.sqlMessage}`)
                            console.log(`│  ├── ${log} -> ${query}`)
                            reject(error);
                        } else {
                            console.log(`│  ├── ${log} -> success`)
                            let res = { success: true, rows: result.affectedRows };
                            resolve(res);
                        }
                    });
                }
            })
        } catch (error) {
            reject(error);
        }
    })
}

/* Delete Data
 * @param conditions   : array -> [{ key: fieldName, value: value }, ...]
 */
CoreDB.delete = (condition) => {
    return new Promise((resolve, reject) => {
        let fields  = [];
        let values  = [];
        let log     = `DB :: ${table} :: delete`;
        
        // generate condition query
        if (condition.length > 0) {
            condition.map(function(val, key) {
                fields.push(`${val.key} = ?`);
                values.push(val.value);
            });
            field  = fields.join(' AND ');
            field  = ` AND ${field}`;
        } else {
            field  = '';
        }
        
        let query   = `DELETE FROM ${table} WHERE 1 ${field}`;
        try {
            DB.getConnection((err, connection) => {
                if(err) {
                    console.log(`│  ├── Database connection :: error`);
                    reject(err)
                } else  {
                    connection.query(query, values, (error, result, fields) => {
                        connection.release();

                        if (error) {
                            console.log(`│  ├── ${log} -> ${error.sqlMessage}`)
                            console.log(`│  ├── ${log} -> ${query}`)
                            reject(error);
                        } else {
                            console.log(`│  ├── ${log} -> success`)
                            let res = { success: true, rows: result.affectedRows };
                            resolve(res);
                        }
                    });
                }
            })
        } catch (error) {
            reject(error);
        }
    })
}

/* Get Single Data
 * @param select       : string
 * @param conditions   : array -> [{ key: fieldName, value: value }, ...]
 * @param join         : array
 * @param group        : array
 */
CoreDB.getBy = (select = '*', condition, join = [], group = []) => {
    return new Promise((resolve, reject) => {
        let fields  = [];
        let values  = [];
        let joins   = '';
        let groups  = '';
        let log     = `DB :: ${table} :: getBy`;
        
        // generate condition query
        if (condition.length > 0) {
            condition.map(function(val, key) {
                fields.push(`${val.key} = ?`);
                values.push(val.value);
            });
            field  = fields.join(' AND ');
            field  = ` AND ${field}`;
        } else {
            field  = '';
        }

        // generate joins and groups query
        joins   = join.length > 0 ? join.join(' ') : '';
        groups  = group.length > 0 ? group.join(' ') : '';
        
        let query   = `SELECT ${select} FROM ${table} ${joins} WHERE 1 ${field} ${groups} LIMIT 1`;
        try {
            DB.getConnection((err, connection) => {
                if(err) {
                    console.log(`│  ├── Database connection :: error`);
                    reject(err)
                } else  {
                    connection.query(query, values, (error, result, fields) => {
                        connection.release();

                        if (error) {
                            console.log(`│  ├── ${log} -> ${error.sqlMessage}`)
                            console.log(`│  ├── ${log} -> ${query}`)
                            reject(error);
                        } else {
                            console.log(`│  ├── ${log} -> success`)
                            resolve(result.length > 0 ? result[0] : {});
                        }
                    });
                }
            })
        } catch (error) {
            reject(error);
        }
    })
}

/* Get All Data
 * @param select       : string
 * @param conditions   : array -> [{ key: fieldName, value: value }, ...]
 * @param join         : array
 * @param group        : array
 * @param sort         : array
 */
CoreDB.getAll = (select, condition = [], join = [], group = [], sort = []) => {
    return new Promise((resolve, reject) => {
        let fields  = [];
        let values  = [];
        let field   = '';
        let joins   = '';
        let groups  = '';
        let orders  = '';
        let log     = `DB :: ${table} :: getAll`;

        // generate condition query
        if (condition.length > 0) {
            condition.map(function(val, key) {
                fields.push(`${val.key} = ?`);
                values.push(val.value);
            });
            field  = fields.join(' AND ');
            field  = `AND ${field}`;
        } else {
            field  = '';
        }

        // generate joins, groups, and ordering query
        joins   = join.length > 0 ? join.join(' ') : '';
        groups  = group.length > 0 ? group.join(' ') : '';
        orders  = sort.length > 0 ? sort.join(', ') : '';
        orders  = sort.length > 0 ? `ORDER BY ${orders}` : '';
        
        let query   = `SELECT ${select} FROM ${table} ${joins} WHERE 1 ${field} ${groups} ${orders}`;
        try {
            DB.getConnection((err, connection) => {
                if(err) {
                    console.log(`│  ├── Database connection :: error`);
                    reject(err)
                } else  {
                    connection.query(query, values, (error, result, fields) => {
                        connection.release();

                        if (error) {
                            console.log(`│  ├── ${log} -> ${error.sqlMessage}`)
                            console.log(`│  ├── ${log} -> ${query}`)
                            reject(error);
                        } else {
                            console.log(`│  ├── ${log} -> success`)
                            resolve(result);
                        }
                    });
                }
            })
        } catch (error) {
            reject(error);
        }
    })
}

/* Get Paging Data
 * @param select       : string
 * @param conditions   : array -> [{ key: fieldName, value: value }, ...]
 * @param join         : array
 * @param group        : array
 * @param sort         : array
 */
CoreDB.getPaging = (select, condition = [], join = [], group = [], sort = [], page = 1, dataLimit = 12) => {
    return new Promise((resolve, reject) => {
        let fields      = [];
        let values      = [];
        let field       = '';
        let joins       = '';
        let groups      = '';
        let orders      = '';
        let log         = `DB :: ${table} :: getPaging`;

        // paging calculation
        let limitStart  = page == 1 ? 0 : (dataLimit * (page - 1));
        let limitEnd    = dataLimit;

        // generate condition query
        if (condition.length > 0) {
            condition.map(function(val, key) {
                fields.push(`${val.key} = ?`);
                values.push(val.value);
            });
            field  = fields.join(' AND ');
            field  = `AND ${field}`;
        } else {
            field  = '';
        }

        // generate joins, groups, and ordering query
        joins   = join.length > 0 ? join.join(' ') : '';
        groups  = group.length > 0 ? group.join(' ') : '';
        orders  = sort.length > 0 ? sort.join(', ') : '';
        orders  = sort.length > 0 ? `ORDER BY ${orders}` : '';
        
        let query   = `SELECT ${select} FROM ${table} ${joins} WHERE 1 ${field} ${groups} ${orders} LIMIT ${limitStart}, ${limitEnd}`;
        console.log(query)
        try {
            DB.getConnection((err, connection) => {
                if(err) {
                    console.log(`│  ├── Database connection :: error`);
                    reject(err)
                } else  {
                    connection.query(query, values, (error, result, fields) => {
                        connection.release();

                        if (error) {
                            console.log(`│  ├── ${log} -> ${error.sqlMessage}`)
                            console.log(`│  ├── ${log} -> ${query}`)
                            reject(error);
                        } else {
                            console.log(`│  ├── ${log} -> success`)
                            resolve(result);
                        }
                    });
                }
            })
        } catch (error) {
            reject(error);
        }
    })
}

module.exports  = CoreDB;