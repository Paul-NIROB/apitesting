require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  bcrypt: {
    rounds: parseInt(process.env.BCRYPT_ROUNDS) || 10
  },
  database: {
    url: process.env.DATABASE_URL
  }
};
