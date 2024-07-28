# Prerequisites
- Docker
- Node.js >= 20
- npm >= 6

# Environment
- Create a `.env` file in the root directory, use .env.example as template
- JWT_SECRET: Provide a strong secret key for JWT token generation

# Installation
- `npm install`
- `npm run db:build`

# Booting up the server
- `npm run db:up`
- `npm run start:dev`

App is running on http://localhost:3000

# API
@see swagger http://localhost:3000/swagger
First register an user and then login to get an access token
Use the access token from `auth/login` to access other secure endpoints

# Testing
Setting up database for testing
- `npm run db:build:test`
- `npm run db:up:test`
- `npm run test`

For VSCode you can use [node:test runner|https://marketplace.visualstudio.com/items?itemName=connor4312.nodejs-testing] to run tests

# Considerations
- If OpenApi specs are not required, use zod.infer types for request validation instead of classes (nest-zod is deprecated)

# Notes
- ORM synchrnoization has been turned off on purpose, bad experience with databases when migrating large tables.
- By default all endpoints are secure (closed to open strategy)
- It's required to provide an access token to access secure endpoints unless they are marked as `@Public()`
- Prefer to use node native test runner instead of jest for better performance