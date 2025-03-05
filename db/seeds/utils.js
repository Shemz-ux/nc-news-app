const db = require("../../db/connection");

const convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};
  
const formatTopics = (data) => {
  const format = data.map(({description, slug, img_url})=> {
    return [description, slug, img_url]
  })
  return format
}

const formatUsers = (data) => {
  const format = data.map(({username, name, avatar_url})=> {
    return [username, name, avatar_url]
  })
  return format
}

const formatArticles = (data) => {
  return data.map((object) => {
    const { title, topic, author, body, created_at, votes, article_img_url } = convertTimestampToDate(object);
    return [title, topic, author, body, created_at, votes, article_img_url];
  });
}

const formatComments = (commentData, articleData) => {
  const lookObj = {}
  articleData.forEach((article)=> {
    lookObj[article.title] = article.article_id
  })
  return commentData.map((commentObject) => {
    const formatTime = convertTimestampToDate(commentObject);
    formatTime.article_id = lookObj[formatTime.article_title]
    delete formatTime.article_title
    const {article_id, body, votes, author, created_at} = formatTime
    return [ article_id, body, votes, author, created_at]
  });
}

module.exports = { convertTimestampToDate, formatTopics, formatUsers, formatArticles , formatComments }

