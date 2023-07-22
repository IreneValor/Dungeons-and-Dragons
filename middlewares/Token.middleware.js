const { expressjwt } = require("express-jwt");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); //carpeta Cloudinary
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const isAuthenticated = expressjwt({
  secret: process.env.TOKEN_SECRET,
  algorithms: ["HS256"],
  requestProperty: "payload",
  getToken: getTokenFromHeaders,
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

const uploadMiddleware = upload.single("image");
module.exports = { isAuthenticated, uploadMiddleware };


