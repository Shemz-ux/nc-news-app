const { lookUpByUsername } = require("../db/seeds/utils")
const { fetchCommentsByArticleId, insertCommentByArticleId } = require("../models/comments.models")
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

exports.postCommentByArticleId = (req, res, next) => {
    const {article_id} = req.params
    const comment = req.body
    checkArticleExists(article_id).then(()=>{
        lookUpByUsername(article_id).then((rows)=>{
            const {author} = rows[0]
            comment.article_id = article_id
            comment.author = author
            delete comment.username
            insertCommentByArticleId(comment)
            .then((newComment)=>{
                res.status(201).send({newComment: newComment} )
            })
        })
    }).catch((err)=>{
        next(err)
    })
}

