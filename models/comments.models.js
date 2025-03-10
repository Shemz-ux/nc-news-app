const db = require('../db/connection')

exports.fetchCommentsByArticleId = (id) => {
    return db.query(`select * from comments where article_id = $1 order by created_at desc`, [id])
    .then(({rows})=>{
        return rows
    }).catch((err)=>{
        next(err)
    })
}