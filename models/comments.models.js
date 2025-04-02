const db = require('../db/connection')

exports.fetchCommentsByArticleId = (id) => {
    return db.query(`SELECT * FROM comments 
        JOIN articles ON comments.article_id = articles.article_id
        WHERE articles.article_id = $1
        ORDER BY articles.created_at DESC`, [id])
    .then(({rows})=>{
        console.log(rows)
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

exports.removeCommentById = (id) => {
    return db.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [id])
    .then(({rows})=>{
        if (rows.length === 0){
            return Promise.reject({status: 404, msg: 'Not found'})
        }
        return rows
    })
}

exports.updateComment = (id, inc_votes) => {
    return db.query(`UPDATE comments
    SET votes = votes + $1 WHERE comment_id = $2 RETURNING *`, [inc_votes, id])
    .then(({rows})=>{
        if (rows.length === 0){
            return Promise.reject({status: 404, msg: 'Not found'})
        }
        return rows[0]
    })
}
