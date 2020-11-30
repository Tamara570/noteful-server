  module.exports = {
    PORT: process.env.PORT || 9090,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL || "postgresql://postgres@localhost/noteful",
    TEST_DB_URL: process.env.TEST_DB_URL || 'postgresql://postgres@localhost/noteful-test',
    CLIENT_ORIGIN: '*'
  }