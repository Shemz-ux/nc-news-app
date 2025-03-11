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

exports.insertCommentByArticleId = (comment) => {
    const {article_id, body, author} = comment
    return db.query(`INSERT INTO comments (article_id, body, author)
VALUES ($1, $2, $3) RETURNING *`, [article_id, body, author]).then(({rows})=>{
    return rows[0]
})
}

