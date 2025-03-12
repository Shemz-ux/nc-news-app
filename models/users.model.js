const db = require('../db/connection')

exports.fetchUsers = (res, req) => {
    return db.query(`SELECT * FROM users`).then(({rows})=>{
        return rows
    })
}