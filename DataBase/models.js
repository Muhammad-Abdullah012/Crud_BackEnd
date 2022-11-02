const { DataTypes } = require("sequelize");
const { USER_TABLE } = require("./constants");

const createUserModel = async (sequelize) => {
  return sequelize.define(USER_TABLE, {
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        max: 200,
        min: 1,
      },
    },
    profession: DataTypes.TEXT,
  });
};

const createModels = async (sequelize) => {
  const UserModel = await createUserModel(sequelize);
  await UserModel.sync();
  return { UserModel };
};

module.exports = { createModels };
