const {
  convertTimestampToDate, formatData, createId
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
    console.log(result)
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

describe("formatData", ()=>{
  test("when given an array of objects, it returns an array of its values", () => {
    const input = [
      { description: "Code is love, code is life", slug: "coding", img_url: "" },
      {
        description: "FOOTIE!",
        slug: "football",
        img_url:
          "https://images.pexels.com/photos/209841/pexels-photo-209841.jpeg?w=700&h=700",
      }]
    const result = formatData(input);
    const expected = [
    ["Code is love, code is life", "coding", "" ],
    [ "FOOTIE!", "football", "https://images.pexels.com/photos/209841/pexels-photo-209841.jpeg?w=700&h=700"]
    ];
    expect(result).toEqual(expected)
  })
})

describe("adds a new ID key for each object", () => {
  test("When passed an array of objects, it adds an article key to each object", () => {
    const input = [
      {
        title: "Running a Node App",
        topic: "coding",
        author: "jessjelly",
        body: "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
        created_at: 1604728980000,
        votes: 0,
        article_img_url:
          "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?w=700&h=700",
      },
      {
        title: "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
        topic: "coding",
        author: "jessjelly",
        body: "Many people know Watson as the IBM-developed cognitive super computer that won the Jeopardy! gameshow in 2011. In truth, Watson is not actually a computer but a set of algorithms and APIs, and since winning TV fame (and a $1 million prize) IBM has put it to use tackling tough problems in every industry from healthcare to finance. Most recently, IBM has announced several new partnerships which aim to take things even further, and put its cognitive capabilities to use solving a whole new range of problems around the world.",
        created_at: 1589418120000,
        votes: 0,
        article_img_url:
          "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?w=700&h=700",
      }]

    const result = createId(input);
    const expected = [
      {
        article_id: 1,
        title: "Running a Node App",
        topic: "coding",
        author: "jessjelly",
        body: "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
        created_at: 1604728980000,
        votes: 0,
        article_img_url:
          "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?w=700&h=700",
      },
      {
        article_id: 2,
        title: "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
        topic: "coding",
        author: "jessjelly",
        body: "Many people know Watson as the IBM-developed cognitive super computer that won the Jeopardy! gameshow in 2011. In truth, Watson is not actually a computer but a set of algorithms and APIs, and since winning TV fame (and a $1 million prize) IBM has put it to use tackling tough problems in every industry from healthcare to finance. Most recently, IBM has announced several new partnerships which aim to take things even further, and put its cognitive capabilities to use solving a whole new range of problems around the world.",
        created_at: 1589418120000,
        votes: 0,
        article_img_url:
          "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?w=700&h=700",
      }]

    expect(result).toEqual(expected)
  })
})
