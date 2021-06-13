require('dotenv').config()

const knex = require('knex')({
  client: 'mysql2',
  connection: {
    host : process.env.MYSQL_DB_HOST,
    user : process.env.MYSQL_DB_USER,
    password : process.env.MYSQL_DB_PASS,
    database : process.env.MYSQL_DB_NAME
  }
});

module.exports = knex