const { fetchArticleById, fetchArticles, updateArticle } = require("../models/articles.model.js")


exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params
    fetchArticleById(article_id).then((article) => {
        res.status(200).send({article: article})
    }).catch((err)=>{
        next(err)
    })
}

exports.getArticles = (req, res, next) => {
    const query = req.query
    fetchArticles(query).then((articles) => {
        res.status(200).send({articles: articles})
    }).catch((err)=>{
        next(err)
    })
}

exports.patchArticleById = (req, res, next) => {
    const {inc_votes} = req.body
    const {article_id} = req.params
    updateArticle(article_id, inc_votes).then((article) => {
        res.status(201).send({article: article})
    }).catch((err)=>{
        next(err)
    })
}