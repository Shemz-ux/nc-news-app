const db = require("../db/connection")

exports.fetchTopics = () => {
    return db.query(`select slug, description from topics`).then(({rows})=>{
        return rows
    })
}