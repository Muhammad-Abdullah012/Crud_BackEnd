const router = require("express").Router();
const {
  getAllUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
} = require("../DataBase/DBoperations");
router.get("/users", async (req, res) => {
  const allUsers = await getAllUsers(req.locals.UserModel);
  res.status(200);
  res.json(allUsers);
});

router.get("/user/:id", async (req, res) => {
  const user = await getUserById(req.locals.UserModel, req.params.id);
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
  const user = await addUser(req.locals.UserModel, userInfo);
  return user ? res.json(user) : res.status(400).json("Something Went wrong!");
});

router.put("/user", async (req, res) => {
  const { name, age, address, profession, id } = req.body;

  const userInfo = {
    id,
    name: name,
    age: age,
    address: address,
    profession: profession,
  };
  const user = await updateUser(req.locals.UserModel, userInfo);
  return user ? res.json(user) : res.status(400).json("Something Went wrong!");
});

router.delete("/user/:id", async (req, res) => {
  const { id } = req.params;

  const status = await deleteUser(req.locals.UserModel, id);
  return status === "Success"
    ? res.json(status)
    : res.status(400).json("Something Went wrong!");
});

module.exports = router;
