const db = require('../db/connection')

exports.checkArticleExists = (id) =>{
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then(({ rows })=>{
        if (rows.length === 0){
            return Promise.reject({status: 404, msg: 'Not found'})
        }

    })
}