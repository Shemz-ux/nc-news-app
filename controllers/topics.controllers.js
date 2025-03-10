// const express = require("express")
const { fetchTopics } = require("../models/topics.model.js")


exports.getTopics = (req, res) => {
    fetchTopics().then((topics) => {
        res.status(200).send({topics: topics})
    })
}