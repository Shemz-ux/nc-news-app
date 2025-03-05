const db = require("../connection")
const { formatTopics, formatUsers, formatArticles, formatComments } = require("./utils")
const format = require('pg-format')

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db.query('DROP TABLE IF EXISTS comments')
  .then(()=>{
    return db.query('DROP TABLE IF EXISTS articles')
  }).then(()=>{
    return db.query('DROP TABLE IF EXISTS users')
  }).then(()=>{
    return db.query('DROP TABLE IF EXISTS topics')
  }).then(()=>{
    return topics(topicData)
  }).then(()=>{
    return users(userData)
  }).then(()=>{
    return articles(articleData)
  }).then(({rows})=>{
    // console.log(rows)
    return comments(commentData,rows)
  })
};
// take the response from articles 


function topics(data){
  return db.query(`
    CREATE TABLE topics (
    slug VARCHAR(255) NOT NULL PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    img_url VARCHAR(1000)
    );`)
    .then(()=>{
      const formatData = formatTopics(data)
      const query = format(`
        INSERT INTO topics
        (description, slug, img_url)
        VALUES %L RETURNING *`, formatData)
      return db.query(query)
    })
}

function users(data){
  return db.query(`
    CREATE TABLE users (
    username VARCHAR(255) NOT NULL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(1000)
    );`)
    .then(()=>{
      const formatData = formatUsers(data)
      const query = format(`
        INSERT INTO users
        (username, name, avatar_url)
         VALUES %L`, formatData)
      return db.query(query)
    })
}

function articles(data){
  return db.query(`
    CREATE TABLE articles (
    article_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    topic VARCHAR(255) NOT NULL REFERENCES topics(slug),
    author VARCHAR(255) NOT NULL REFERENCES users(username),
    body TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    votes INT DEFAULT 0,
    article_img_url VARCHAR(1000)
    );`).then(()=>{
      const formatData = formatArticles(data)
      const query = format(`
        INSERT INTO articles
        (title, topic, author, body, created_at, votes, article_img_url)
        VALUES %L RETURNING *`, formatData)
      return db.query(query)
    })
}

function comments(commentData, articleData){
  return db.query(`
    CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    article_id INT REFERENCES articles(article_id),
    body TEXT,
    votes INT NOT NULL DEFAULT 0,
    author VARCHAR(255) NOT NULL REFERENCES users(username),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`).then(()=>{
        const formatData = formatComments(commentData, articleData)
        console.log(formatData)
        const query = format(`
          INSERT INTO comments
          (article_id, body, votes, author, created_at)
          VALUES %L`, formatData)
        return db.query(query)
      })
  }


module.exports = seed;
