# NC News Seeding

Basic setup
- install all depencies by typing 'npm install' in your terminal

- create two files within the repo at the parent level:
    - .env.development
    - .env.test
note: these files, will connect you to a specific data base [test/dev], based on what environment you are running in.

- inside the .env.test file create a statement to connect to the test database, PGDATABASE = nc_news_test (no semi colons)

- inside the .env.development file create a statement to connect to the development database, PGDATABASE = nc_news (no semi colons)

Running tests using jest:
- Once files have been created and set up, run the test file script, npm run test-seed, and you should see that you are connected to nc_news_test database. You can then use the jest command npm test or npm t, to run your test suites

Making requests in developments (client simulation):
- typing 'npm run seed-dev' in your terminal to seed the databases with data. 
- then type the command `npm run start` which will allow you to make various requests to the db using a client simulator like insomnia or postman


