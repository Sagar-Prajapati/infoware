const dotenv = require('dotenv');

dotenv.config();

// Update with your config settings.

module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      database: 'infoware-test',
      host: process.env.DB_HOST_DEV,
      port: process.env.DB_PORT_DEV,
      user: process.env.DB_USER_DEV,
      password: process.env.DB_PASS_DEV
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'infoware-test-prod',
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      port: process.env.DB_PORT,
      password: process.env.DB_PASS
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};
