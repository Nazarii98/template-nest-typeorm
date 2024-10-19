Template Backend

## Description

Backend for application for inserting/transfering products.

## Local Project Setup

```bash
$ npm install
```

```bash
$ docker compose up
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Migrations

### Generate migration based on entities

```
npm run migration:generate ./src/migrations/<migration name>
```
