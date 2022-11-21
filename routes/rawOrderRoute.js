const { SUCCESS } = require("../DataBase/constants");
const {
  getAllOrders,
  getOrderById,
  addOrder,
  updateOrder,
  deleteOrder,
} = require("../DataBase/RawDBoperations");

const router = require("express").Router();

router.get("/", async (req, res) => {
  try {
    const orders = await getAllOrders(
      req.locals.sequelize,
      req.query.searchString
    );
    return orders ? res.json(orders) : res.status(400).json({});
  } catch (err) {
    console.log("Error occured: ", err);
    res.status(400).json({});
  }
});

router.get("/:id", async (req, res) => {
  try {
    const order = await getOrderById(req.locals.sequelize, req.params.id);
    return order ? res.json(order) : res.status(400).json({});
  } catch (err) {
    console.log("Error occured: ", err);
    res.status(400).json({});
  }
});

router.post("/", async (req, res) => {
  try {
    const { quantity, name, user_id } = req.body;
    const order = await addOrder(req.locals.sequelize, {
      quantity,
      name,
      user_id,
    });
    return order ? res.json(order) : res.status(400).json({});
  } catch (err) {
    console.log("Error occured: ", err);
    res.status(400).json({});
  }
});

router.put("/", async (req, res) => {
  try {
    const { id, name, quantity, user_id } = req.body;
    console.log("req.body: ", req.body);
    const order = await updateOrder(req.locals.sequelize, {
      id,
      name,
      quantity,
      user_id,
    });
    return order ? res.json(order) : res.status(400).json({});
  } catch (err) {
    console.log("Error occured: ", err);
    res.status(400).json({});
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const status = await deleteOrder(req.locals.sequelize, req.params.id);
    console.log("Status: ", status);
    return status === SUCCESS ? res.json(status) : res.status(400).json({});
  } catch (err) {
    console.log("Error occured: ", err);
    res.status(400).json({});
  }
});

module.exports = router;
