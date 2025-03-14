// const express = require("express")
const { fetchTopics, insertTopic } = require("../models/topics.model.js")


exports.getTopics = (req, res) => {
    fetchTopics().then((topics) => {
        res.status(200).send({topics: topics})
    })
}

exports.postTopic = (req, res, next) => {
    const newTopic = req.body
    insertTopic(newTopic).then((topic)=>{
        res.status(201).send({newTopic: topic})
    }).catch((err)=>{
        next(err)
    })
}