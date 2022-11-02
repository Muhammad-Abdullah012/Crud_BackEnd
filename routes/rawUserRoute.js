const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
} = require("../DataBase/RawDBoperations");

router.get("/user", async (req, res) => {
  const allUsers = await getAllUsers(
    req.locals.sequelize,
    req.query.searchString
  );
  // res.status(200);
  // res.json(allUsers);
  return allUsers ? res.json(allUsers) : res.status(400).json({});
});

// router.get("/user/:searchString", async (req, res) => {
//   console.log("request parameters: ", req.params.searchString);
//   const allUsers = await getAllUsers(
//     req.locals.sequelize,
//     req.params.searchString
//   );
//   return allUsers ? res.json(allUsers) : res.status(400).json({});
// });

router.get("/user/:id", async (req, res) => {
  const user = await getUserById(req.locals.sequelize, req.params.id);
  return user ? res.json(user) : res.json({});
});

router.post("/user", async (req, res) => {
  const { name, age, address, profession } = req.body;
  const userInfo = {
    name,
    age,
    address,
    profession,
  };
  const user = await addUser(req.locals.sequelize, userInfo);
  return user ? res.json(user) : res.status(400).json("Something went wrong");
});

router.put("/user", async (req, res) => {
  const { name, age, address, profession, id } = req.body;

  const userInfo = {
    id,
    name,
    age,
    address,
    profession,
  };
  const user = await updateUser(req.locals.sequelize, userInfo);
  console.log("user after update is: ", user);
  return user ? res.json(user) : res.status(400).json("Something went wrong");
});

router.delete("/user/:id", async (req, res) => {
  const status = await deleteUser(req.locals.sequelize, req.params.id);
  return status === "Success"
    ? res.json(status)
    : res.status(400).json("Something went wrong");
});

module.exports = router;
