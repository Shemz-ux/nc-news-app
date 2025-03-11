const { fetchCommentsByArticleId } = require("../models/comments.models")
const { checkArticleExists } = require("../models/filter.articles")

exports.getCommentsByArticleId = (req, res, next) => {
    const {article_id} = req.params
    const promises = [fetchCommentsByArticleId(article_id)]
    
    if (article_id){
        promises.push(checkArticleExists(article_id))
    }

    Promise.all(promises).then((resolvedPromises)=>{
        res.status(200).send({comments: resolvedPromises[0]})
    }).catch((err)=>{
        next(err)
    })

}