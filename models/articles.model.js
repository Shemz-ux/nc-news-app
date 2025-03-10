const db = require("../db/connection")

exports.fetchArticleById = (id) => {
    return db.query(`select * from articles where article_id = $1`, [id])
    .then(({rows})=>{
        if (rows.length === 0){
            return Promise.reject({status: 404, msg: 'Not found'})
        }
        return rows[0]
    })
}