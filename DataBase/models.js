const { DataTypes, Sequelize } = require("sequelize");
const {
  USER_TABLE,
  ORDERS_TABLE,
  ORG_TABLE,
  ORG_TO_USERS,
} = require("./constants");

const createUserModel = async (sequelize) => {
  return sequelize.define(
    USER_TABLE,
    {
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
      created_at: {
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
      updated_at: {
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
};

const createOrdersModel = async (sequelize) => {
  return sequelize.define(
    ORDERS_TABLE,
    {
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      created_at: {
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
      updated_at: {
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
};

const createOrgModel = async (sequelize) => {
  return sequelize.define(
    ORG_TABLE,
    {
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      created_at: {
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
      updated_at: {
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
};

const createModels = async (sequelize) => {
  const UserModel = await createUserModel(sequelize);
  const OrdersModel = await createOrdersModel(sequelize);
  const OrgMOdel = await createOrgModel(sequelize);

  OrgMOdel.belongsToMany(UserModel, {
    through: ORG_TO_USERS,
  });
  UserModel.belongsToMany(OrgMOdel, {
    through: ORG_TO_USERS,
  });

  UserModel.hasMany(OrdersModel);
  OrdersModel.belongsTo(UserModel);

  await UserModel.sync();
  await OrdersModel.sync();
  await OrgMOdel.sync();
  return { UserModel, OrdersModel, OrgMOdel };
};

module.exports = { createModels };
