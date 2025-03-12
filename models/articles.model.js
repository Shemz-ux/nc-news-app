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
 
exports.fetchArticles = (query) => {
    let queryStr = `
        SELECT articles.*, COUNT(comments.comment_id)::INT AS comment_count 
        FROM articles 
        LEFT JOIN comments ON articles.article_id = comments.article_id 
        GROUP BY articles.article_id
    `;

    const validSortColumns = ["created_at", "article_id", "votes"]
    const validOrderOptions = ["asc", "desc"]

    let sortBy = "created_at"
    let order = "desc"

    if (query.sort_by) {
        if (!validSortColumns.includes(query.sort_by)) {
            return Promise.reject({ status: 400, msg: "Invalid query" });
        }
        sortBy = query.sort_by;
    }

    if (query.order) {
        if (!validOrderOptions.includes(query.order.toLowerCase())) {
            return Promise.reject({ status: 400, msg: "Invalid query" });
        }
        order = query.order.toLowerCase();
    }

    queryStr += ` ORDER BY articles.${sortBy} ${order}`;

    return db.query(queryStr).then(({ rows }) => {
        return rows
    })
}

exports.updateArticle = (id, inc_votes) => {
    return db.query(`UPDATE articles
    SET votes = votes + $1 WHERE article_id = $2 RETURNING *`, [inc_votes, id])
    .then(({rows})=>{
        if (rows.length === 0){
            return Promise.reject({status: 404, msg: 'Not found'})
        }
        return rows[0]
    })
}

