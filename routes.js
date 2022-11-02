"use strict";

module.exports = async (app, opts) => {
  // require("./DataBase/DBoperations");
  const { createModels } = require("./DataBase/models");
  const userRoute = require("./routes/userRoute");
  const rawUserRoutes = require("./routes/rawUserRoute");

  const { sequelize: seq } = opts;
  const sequelize = await seq;

  const { UserModel } = await createModels(sequelize);
  console.log("userMOdel is: ", UserModel);

  app.use(
    "/",
    (req, res, next) => {
      req.locals = { UserModel };
      next();
    },
    userRoute
  );

  app.use(
    "/raw",
    (req, res, next) => {
      req.locals = { sequelize };
      next();
    },
    rawUserRoutes
  );
};
