const { Sequelize } = require("sequelize");
const pino = require("pino");

module.exports = async () => {
  const logger = pino();
  const sequelize = new Sequelize(
    process.env.TEST_DATABASE_NAME ?? process.env.DATABASE_NAME, // database name
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
    logger.info("Connection has been established successfully");
    return sequelize;
  } catch (error) {
    logger.info("Cannot connect to Database because of error: ");
    logger.error(error);
  }
};
