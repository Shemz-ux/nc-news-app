# NC News Seeding

- ONCE you have cloned the repo, create two files within the repo:
    - .env.development
    - .env.test
    these files, will connect you to a specific data base [test/dev], based on what environment you are running in

- inside the .env.test file create a statement to connect to the test database, PGDATABASE = nc_news_test

- inside the .env.development file create a statement to connect to the development database, PGDATABASE = nc_news (no semi colons)

- Once files have been created and set up, run the test file script, npm run test-seed, and you should see that you are connected to new_news_test

- similarly do the same for the development script npm run seed-dev
