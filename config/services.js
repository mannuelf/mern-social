module.exports = {
  "mongoURI": process.env.MONGO_URI,
  "jwtSecret": process.env.JWT_SECRET,
  "github": {
    "clientId": process.env.GITHUB_CLIENT_ID,
    "clientSecret": process.env.GITHUB_CLIENT_SECRET
  }
};
