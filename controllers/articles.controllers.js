const { fetchArticleById } = require("../models/articles.model.js")


exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params
    fetchArticleById(article_id).then((topic) => {
        res.status(200).send({topic: topic})
    }).catch((err)=>{
        next(err)
    })
}