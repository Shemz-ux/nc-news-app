const db = require("../connection")
const { formatData, formatDataTwo } = require("./utils")
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
  }).then(()=>{
    return comments(commentData)
  })
};

function topics(data){
  return db.query(`
    CREATE TABLE topics (
    slug VARCHAR(255) NOT NULL PRIMARY KEY,
    description VARCHAR(255),
    img_url VARCHAR(1000)
    );`)
    .then(()=>{
      const formattingData = formatData(data)
      const query = format(`
        INSERT INTO topics
        (slug, description, img_url)
        VALUES %L`, formattingData)
      return db.query(query)
    })
}

function users(data){
  return db.query(`
    CREATE TABLE users (
    username VARCHAR(255) NOT NULL PRIMARY KEY,
    name VARCHAR(100),
    avatar_url VARCHAR(1000)
    );`)
    .then(()=>{
      const formattingData = formatData(data)
      const query = format(`
        INSERT INTO users
        (username, name, avatar_url)
         VALUES %L`, formattingData)
      return db.query(query)
    })
}

function articles(data){
  return db.query(`
    CREATE TABLE articles (
    article_id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    topic VARCHAR(255),
    author VARCHAR(255),
    body TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    votes INT DEFAULT 0,
    article_img_url VARCHAR(1000),
    FOREIGN KEY (author) REFERENCES users(username)
    );`).then(()=>{
      // ISSUE WITH ONE OF MY FOREIGN KEY (topic) REFERENCES topics(slug)
      const formattingArticles = formatDataTwo(data)
      const query = format(`
        INSERT INTO articles
        (created_at, title, topic, author, body, article_img_url, votes)
        VALUES %L`, formattingArticles)
      return db.query(query)
    })
}

function comments(data){
  return db.query(`
    CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    article_id INT NOT NULL,
    body TEXT,
    votes INT NOT NULL DEFAULT 0,
    author VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (article_id) REFERENCES articles(article_id),
    FOREIGN KEY (author) REFERENCES users(username)
    );`).then(()=>{
      console.log(data)
    })
}

module.exports = seed;
