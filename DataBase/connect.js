const { Sequelize } = require("sequelize");
const { logger } = require("pino");

module.exports = async () => {
  const sequelize = new Sequelize(
    process.env.DATABASE_NAME, // database name
    process.env.DATABASE_USERNAME, // username
    process.env.DATABASE_PASSWORD, // password
    {
      host: "localhost",
      dialect: "postgres",
      port: process.env.DATABASE_PORT,
    }
  );
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully\n");
    return sequelize;
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
