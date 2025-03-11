const db = require('../db/connection')

exports.fetchCommentsByArticleId = (id) => {
    return db.query(`SELECT * FROM comments 
        JOIN articles ON comments.article_id = articles.article_id
        WHERE articles.article_id = $1
        ORDER BY articles.created_at DESC`, [id])
    .then(({rows})=>{
        return rows
    })
}