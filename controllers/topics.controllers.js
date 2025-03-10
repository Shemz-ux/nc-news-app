// const express = require("express")
const { fetchTopics, fetchTopicById } = require("../models/topics.model.js")


exports.getTopics = (req, res) => {
    fetchTopics().then((topics) => {
        res.status(200).send({topics: topics})
    })
}

exports.getTopicById = (req, res, next) => {
    const {article_id} = req.params
    fetchTopicById(article_id).then((topic) => {
        res.status(200).send({topic: topic})
    }).catch((err)=>{
        next(err)
    })
}
