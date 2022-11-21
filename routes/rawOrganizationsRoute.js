const router = require("express").Router();
const { SUCCESS } = require("../DataBase/constants");

const {
  getAllOrganizations,
  addOrganization,
  updateOrganization,
  deleteOrganization,
  getOrgById,
} = require("../DataBase/RawDBoperations");

router.get("/", async (req, res) => {
  try {
    const allOrganizations = await getAllOrganizations(
      req.locals.sequelize,
      req.query.searchString
    );
    return allOrganizations
      ? res.json(allOrganizations)
      : res.status(400).json({});
  } catch (err) {
    console.log("Error occured: ", err);
    res.status(400).json({});
  }
});

router.get("/:id", async (req, res) => {
  try {
    const org = await getOrgById(req.locals.sequelize, req.params.id);
    console.log("org: ", org);
    return org ? res.json(org) : res.json({});
  } catch (err) {
    console.log("Error occured: ", err);
    res.status(400).json({});
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, address } = req.body;
    const org = await addOrganization(req.locals.sequelize, { name, address });
    org ? res.json(org) : res.json({});
  } catch (err) {
    console.log("Error occured: ", err);
    res.status(400).json({});
  }
});

router.put("/", async (req, res) => {
  try {
    const { name, address, id } = req.body;
    const org = await updateOrganization(req.locals.sequelize, {
      id,
      name,
      address,
    });
    org ? res.json(org) : res.json({});
  } catch (err) {
    console.log("Error occured: ", err);
    res.status(400).json({});
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const status = await deleteOrganization(req.locals.sequelize, id);
    console.log("status: ", status);
    return status === SUCCESS ? res.json(status) : res.json({});
  } catch (err) {
    console.log("Error occured: ", err);
    res.status(400).json({});
  }
});

module.exports = router;
