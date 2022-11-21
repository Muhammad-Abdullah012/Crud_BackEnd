const router = require("express").Router();

const rawUserRoutes = require("./rawUserRoute");
const rawOrgRoutes = require("./rawOrganizationsRoute");
const rawOrderRoutes = require("./rawOrderRoute");

router.use(
  "/users",
  (req, res, next) => {
    next();
  },
  rawUserRoutes
);

router.use(
  "/organizations",
  (req, res, next) => {
    next();
  },
  rawOrgRoutes
);

router.use(
  "/orders",
  (req, res, next) => {
    next();
  },
  rawOrderRoutes
);

module.exports = router;
