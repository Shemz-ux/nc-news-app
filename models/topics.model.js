const db = require("../db/connection")

exports.fetchTopics = () => {
    return db.query(`select slug, description from topics`).then(({rows})=>{
        return rows
    })
}

exports.fetchTopicById = (id) => {
    return db.query(`select * from articles where article_id = $1`, [id])
    .then(({rows})=>{
        if (rows.length === 0){
            return Promise.reject({status: 404, msg: 'Not found'})
        }
        return rows[0]
    })
}