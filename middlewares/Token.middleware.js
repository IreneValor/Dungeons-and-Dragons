const { expressjwt } = require("express-jwt");

const isAuthenticated = expressjwt({
  secret: process.env.TOKEN_SECRET,
  algorithms: ["HS256"],
  requestProperty: "payload",
  getToken: getTokenFromHeaders
});


function getTokenFromHeaders(req) {
  const authorizationHeader = req.get("Authorization");
  if (authorizationHeader) {
    const [bearer, token] = authorizationHeader.split(" ");
    if (bearer === "Bearer") {
      console.log("Token: ", token);
      return token;
    }
  }

  return null;
} 
module.exports = { isAuthenticated };