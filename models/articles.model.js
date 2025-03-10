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
 
exports.fetchArticles = () => {
    return db.query(`SELECT articles.*, COUNT(comments.comment_id)::INT AS comment_count 
        FROM articles 
        LEFT JOIN comments ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC;`).then(({rows})=>{
        return rows
    })
}
