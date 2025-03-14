const db = require("../db/connection")

exports.fetchTopics = () => {
    return db.query(`select slug, description from topics`).then(({rows})=>{
        return rows
    })
}

exports.fetchArticleById = (id) => {
    return db.query(`select * from articles where article_id = $1`, [id])
    .then(({rows})=>{
        if (rows.length === 0){
            return Promise.reject({status: 404, msg: 'Not found'})
        }
        return rows[0]
    })
}

exports.insertTopic = (newTopic) => {
    const {slug, description, img_url} = newTopic
    return db.query(`INSERT INTO topics (slug, description, img_url)
        VALUES ($1, $2, $3) RETURNING *`, [slug, description, img_url]).then(({rows})=>{
            return rows[0]
        })
}