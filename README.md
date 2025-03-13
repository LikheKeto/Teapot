## Day 1
### Setting up Backend
1. Install express and other essential packages

```
npm install express bcryptjs jsonwebtoken cors dotenv validate.js
```

We install `express` as Node.js framework, `bcryptjs` for encryption/decryption of password and `jsonwebtoken` for working with JWTs for authentication system. `cors` package is used to handle CORS configurations and `dotenv` is used for easy use of environment variables using `.env` file. `validate.js` is used for user input validation.

2. Install Node.js client of PostgreSQL i.e. `pg` and `pg-migrate`, tool for managing migrations. Edit pacakge.js to add scripts for migration.
```
npm install pg pg-migrate
```

3. Install Winston for logging
```
npm install winston
```

4. Install Jest for testing API and SuperTest for testing HTTP
```
npm install --save-dev jest supertest
```

## Day 3
### Setting up frontend
I decided to setup React using the React Router framework, for easy setup of React