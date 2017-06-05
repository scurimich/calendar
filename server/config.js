const config = {
  database: 'mongodb://localhost/calendar',
  secret: 'somesecret',
  jwtSession: {
    session: false
  },
  port: process.env.PORT || 3000
};

export default config;