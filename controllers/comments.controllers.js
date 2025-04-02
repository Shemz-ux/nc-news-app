const { lookUpByUsername } = require("../db/seeds/utils")
const { fetchCommentsByArticleId, insertCommentByArticleId, removeCommentById, updateComment } = require("../models/comments.models")
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
    const {body, username} = req.body
    // checkArticleExists(article_id).then(()=>{
    //     lookUpByUsername(article_id).then((rows)=>{
    //         const {author} = rows[0]
    //         comment.article_id = article_id
    //         comment.author = author
    //         delete comment.username
    //         insertCommentByArticleId(comment)
    //         .then((newComment)=>{
    //             res.status(201).send({newComment: newComment} )
    //         })
    //     })
    // }).catch((err)=>{
    //     next(err)
    // })
    checkArticleExists(article_id)
        .then(() => {
            const newComment = {
                article_id,
                author: username,
                body: body,
            };
            return insertCommentByArticleId(newComment);
        })
        .then((newComment) => {
            res.status(201).json({ newComment });
        })
        .catch((err) => {
            next(err);
        }); 
}

exports.deleteCommentById = (req, res, next) => {
    const {comment_id} = req.params
    removeCommentById(comment_id).then((response)=>{
        res.status(204).send()
    }).catch((err)=>{
        next(err)
    })
}

exports.patchCommentById = (req, res, next) => {
    const {inc_votes} = req.body
    const {comment_id} = req.params
    updateComment(comment_id, inc_votes).then((comment) => {
        res.status(201).send({comment: comment})
    }).catch((err)=>{
        next(err)
    })
}
