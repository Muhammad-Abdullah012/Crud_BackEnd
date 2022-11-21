const router = require("express").Router();
const { SUCCESS } = require("../DataBase/constants");
const {
  getAllUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
} = require("../DataBase/RawDBoperations");

router.get("/", async (req, res) => {
  try {
    const allUsers = await getAllUsers(
      req.locals.sequelize,
      req.query.searchString
    );
    return allUsers ? res.json(allUsers) : res.status(400).json({});
  } catch (err) {
    console.log("Error occured: ", err);
    res.status(400).json({});
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await getUserById(req.locals.sequelize, req.params.id);
    return user ? res.json(user) : res.json({});
  } catch (err) {
    console.log("Error occured: ", err);
    res.status(400).json({});
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, age, address, profession, org_id } = req.body;
    const userInfo = {
      name,
      age,
      address,
      profession,
      org_id,
    };
    const user = await addUser(req.locals.sequelize, userInfo);
    return user ? res.json(user) : res.status(400).json("Something went wrong");
  } catch (err) {
    console.log("Error occured: ", err);
    res.status(400).json({});
  }
});

router.put("/", async (req, res) => {
  try {
    const { name, age, address, profession, id, org_id } = req.body;
    console.log("req: ", req.body);
    const userInfo = {
      id,
      name,
      age,
      address,
      profession,
      org_id,
    };
    const user = await updateUser(req.locals.sequelize, userInfo);
    return user ? res.json(user) : res.status(400).json("Something went wrong");
  } catch (err) {
    console.log("Error occured: ", err);
    res.status(400).json({});
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const status = await deleteUser(req.locals.sequelize, req.params.id);
    return status === SUCCESS
      ? res.json(status)
      : res.status(400).json("Something went wrong");
  } catch (err) {
    console.log("Error occured: ", err);
    res.status(400).json({});
  }
});

module.exports = router;
