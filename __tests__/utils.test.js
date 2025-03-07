const {
  convertTimestampToDate, formatTopics, formatUsers, formatArticles
} = require("../db/seeds/utils");

describe("convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts a created_at property to a date", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no created_at property", () => {
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    expect(result).toEqual(expected);
  });
});

describe("formatTopics", ()=>{
  test("when given an array of objects, it returns an array of its values", () => {
    const input = [
      { description: "Code is love, code is life", slug: "coding", img_url: "" },
      {
        description: "FOOTIE!",
        slug: "football",
        img_url:
          "https://images.pexels.com/photos/209841/pexels-photo-209841.jpeg?w=700&h=700",
      }]
    const result = formatTopics(input);
    const expected = [
    ["Code is love, code is life", "coding", "" ],
    [ "FOOTIE!", "football", "https://images.pexels.com/photos/209841/pexels-photo-209841.jpeg?w=700&h=700"]
    ];
    expect(result).toEqual(expected)
  })
})

describe("formatUsers", ()=>{
  test("when given an array of objects, it returns an array of its values", () => {
    const input = [
      { 
        username: "butter_bridge",
        name: "jonny",
        avatar_url:
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg", 
      },
      {
        username: "icellusedkars",
        name: "sam",
        avatar_url: "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
      }]
    const result = formatUsers(input);
    const expected = 
    [
    ["butter_bridge", "jonny", "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"],
    [ "icellusedkars", "sam", "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4"]
    ];
    expect(result).toEqual(expected)
  })
})

describe("formatArticles", ()=>{
  test("when given an array of objects, it returns an array of its values", () => {
    const input = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1594329060000,
        votes: 100,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      },
      {
        title: "Sony Vaio; or, The Laptop",
        topic: "mitch",
        author: "icellusedkars",
        body: "Call me Mitchell. Some years ago..",
        created_at: 1602828180000,
        votes: 0,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      }
    ]
    const result = formatArticles(input);
    // console.log(result)
    const expected = 
    [
      ["Living in the shadow of a great man", "mitch", "butter_bridge", "I find this existence challenging", new Date("2020-07-09T21:11:00.000Z"), 100,
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
      ],
      ["Sony Vaio; or, The Laptop", "mitch", "icellusedkars", "Call me Mitchell. Some years ago..", new Date("2020-10-16T06:03:00.000Z"), 0,  
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
      ]
    ];
    expect(result).toEqual(expected)
  })
})


