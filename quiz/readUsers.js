const express = require("express");
const router = express.Router();

router.get("/usernames", (req, res) => {
  let usernames = req.users.map(function (user) {
    return { id: user.id, username: user.username };
  });
  res.send(usernames);
});

router.get("/username/:input", (req, res) => {
  let name = req.params.input;
  let user_name = req.users.filter(function (user) {
    return user.username === name;
  });
  console.log(user_name);
  if (user_name.length === 0) {
    res.send({
      error: { message: `${name} not found`, status: 400 },
    });
  } else {
    res.send(user_name);
  }
});

module.exports = router;
