const db = require("../db/connection")

exports.fetchArticleById = (id) => {
    return db.query(`SELECT articles.*, COUNT(comments.comment_id)::INT AS comment_count 
                    FROM articles 
                    LEFT JOIN comments ON articles.article_id = comments.article_id
                    WHERE articles.article_id = $1
                    GROUP BY articles.article_id`, [id])
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
        LEFT JOIN comments ON articles.article_id = comments.article_id`;

    const validSortColumns = ["created_at", "article_id", "votes"];
    const validOrderOptions = ["asc", "desc"];
    const queryValues = [];

    let sortBy = "created_at";
    let order = "desc";

    if (query.topic) {
        queryStr += ` WHERE articles.topic = $1`;
        queryValues.push(query.topic);
    }

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

    queryStr += ` GROUP BY articles.article_id ORDER BY articles.${sortBy} ${order}`;

    if(query.limit) {
        console.log(query.limit)
        queryStr += ` LIMIT 10`
    }


    return db.query(queryStr, queryValues).then(({ rows }) => {
        if (rows.length === 0){
            return Promise.reject({status: 400, msg: 'Invalid query'})
        }
        return rows;
    });
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

exports.insertArticle = (newArticle) => {
    const {title, topic, author, body} = newArticle
    let {article_img_url} = newArticle

    if (!article_img_url){
        article_img_url = "https://default-image-url.com/default.jpg"
    }

    return db.query(
        `INSERT INTO articles (title, topic, author, body, article_img_url)
         VALUES ($1, $2, $3, $4, $5) RETURNING article_id;`,
        [title, topic, author, body, article_img_url]
    )
    .then(({ rows }) => {
        const { article_id } = rows[0];
        return db.query(
            `SELECT articles.*, COUNT(comments.comment_id)::INT AS comment_count
             FROM articles
             LEFT JOIN comments ON articles.article_id = comments.article_id
             WHERE articles.article_id = $1
             GROUP BY articles.article_id;`,
            [article_id]
        );
    })
    .then(({ rows }) => {
        return rows[0]}) 
}

