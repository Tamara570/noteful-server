  module.exports = {
    PORT: process.env.PORT || 9090,
    NODE_ENV: process.env.NODE_ENV || 'development',
    //DATABASE_URL: process.env.DATABASE_URL || "postgresql://postgres@localhost/noteful",
    DATABASE_URL: process.env.DATABASE_URL || 'postgres://xdocalzoojefrp:f55478e54cd86036952944dd19549f157afc8b80cd1eac2d31de44f029c953ae@ec2-54-237-135-248.compute-1.amazonaws.com:5432/d3d6s5oips4ahr',
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://postgres@localhost/noteful-test',
    CLIENT_ORIGIN: '*'
  }