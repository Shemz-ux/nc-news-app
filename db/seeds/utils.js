const db = require("../../db/connection");

const convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};
  
const formatData = (data) => {
  const formatted = data.map((object)=> Object.values(object))
  return formatted
}

const formatDataTwo = (data) => {
  const formatted = data.map((object)=> {
    if (!object.hasOwnProperty('votes')) {
      object.votes = 0;
    }
    const objectFormat = convertTimestampToDate(object)
    return Object.values(objectFormat)
  })
  return formatted
}

const createId = (data) => {
  let idNumber = 1
  data.map((object) => {
    if(!object.hasOwnProperty("article_id")){
      object.article_id = idNumber++
    }
  })
  return data
}

module.exports = { convertTimestampToDate, formatData, formatDataTwo, createId }

//I could refactor this to be able to take any key name and do the same, by allowing the function to take two


