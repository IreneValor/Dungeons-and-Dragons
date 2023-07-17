const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { isAuthenticated } = require("../middlewares/Token.middleware");
const User = require("../models/User.model");

const saltRounds = 10;

router.post("/signup", async (req, res, next) => {
  try {
    const { email, password, username } = req.body;

    if (password.length < 2) {
      res
        .status(400)
        .json({ message: "Password must have at least 2 characters" });
      return;
    }

    const foundUser = await User.findOne({ email });

    if (foundUser) {
      res.status(400).json({ message: "User already exists." });
      return;
    }

    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const createdUser = await User.create({
      email,
      password: hashedPassword,
      username,
    });

    const { _id } = createdUser;
    const user = { email, username, _id };

    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
});


router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.status(400).json({ message: "Provide email and password." });
    return;
  }

  User.findOne({ email })
    .then((foundUser) => {
      if (!foundUser) {
        res.status(401).json({ message: "User not found." });
        return;
      }

      if (bcrypt.compareSync(password, foundUser.password)) {
        const { _id, email, username } = foundUser;

        const payload = { _id, email, username };

        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        });

        // req.session.currentUser = foundUser;

        res.json({ authToken });
      } else {
        res.status(401).json({ message: "Unable to authenticate the user" });
      }
    })
    .catch((err) => next(err));
});

router.get("/verify", isAuthenticated, (req, res, next) => {
  console.log("Authenticated user data: ", req.payload);

  res.status(200).json(req.payload);
});

router.get("/:userId", isAuthenticated, async (req, res, next) => {
  try {
    const { userId } = req.params;

    const User = await User.find({}).populate("characters");

    {
    }
    console.log(userId);
    return res.status(200).json(characters);
  } catch (error) {
    return res.status(500).json({ error: "Error al obtener los personajes" });
  }
});

// router.get("/characters", isAuthenticated, async (req, res, next) => {
//   try {
//     const { userId } = req.body;
//     const characters = await Character.find({ user: userId });
//     return res.status(200).json(characters);
//   } catch (error) {
//     return res.status(500).json({ error: "Error al obtener los personajes" });
//   }
// });

module.exports = router;
