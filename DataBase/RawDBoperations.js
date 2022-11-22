const {
  USER_TABLE,
  ORG_TABLE,
  SUCCESS,
  ORG_TO_USERS,
  ORDERS_TABLE,
  ORDERS_VIEW,
  USERS_VIEW,
} = require("./constants");


const createUsersView = async (sequelize) => {
  await sequelize.query(`DROP VIEW IF EXISTS users_view`);
  const [results, metadata] = await sequelize.query(
    `CREATE VIEW users_view AS SELECT ${USER_TABLE}.id, ${USER_TABLE}.name, age, ${USER_TABLE}.address, ${USER_TABLE}.profession, ${ORG_TABLE}.id AS org_id, ${ORG_TABLE}.name AS org_name FROM ${USER_TABLE},${ORG_TABLE},${ORG_TO_USERS} WHERE ${ORG_TABLE}.id = ${ORG_TO_USERS}.org_id AND ${USER_TABLE}.id = ${ORG_TO_USERS}.user_id`
  );
};
const createOrdersView = async (sequelize) => {
  await sequelize.query(`DROP VIEW IF EXISTS orders_view`);
  const [results, metadata] = await sequelize.query(
    `CREATE VIEW orders_view AS SELECT ${USER_TABLE}.name AS user_name, ${USER_TABLE}.id AS user_id, ${ORDERS_TABLE}.name, ${ORDERS_TABLE}.quantity, ${ORDERS_TABLE}.id FROM ${ORDERS_TABLE}, ${USER_TABLE} WHERE ${ORDERS_TABLE}.user_id = ${USER_TABLE}.id`
  );
};

const getAllUsers = async (sequelize, searchString) => {
  const query = ` WHERE LOWER(u.name) LIKE LOWER(:searchString) OR LOWER(u.address) LIKE LOWER(:searchString) OR LOWER(profession) LIKE LOWER(:searchString) OR CAST(age AS TEXT) LIKE :searchString OR LOWER(org.name) LIKE LOWER(:searchString)`;
  
  const [results, metadata] = await sequelize.query(
    `SELECT u.id, u.name, u.address, u.profession, u.age, o_to_u.org_id, org.name AS org_name FROM ${USER_TABLE} AS u INNER JOIN organizations_to_users AS o_to_u ON o_to_u.user_id = u.id INNER JOIN ${ORG_TABLE} AS org ON org.id = o_to_u.org_id ${
      searchString ? query : ``
    };`,
    {
      replacements: {
        searchString: `%${searchString}%`,
      },
    }
  );

  return results;
};

const getAllOrganizations = async (sequelize, searchString) => {
  const query = ` WHERE LOWER(name) LIKE LOWER(:searchString) OR LOWER(address) LIKE LOWER(:searchString)`;
  const [results, metadata] = await sequelize.query(
    `SELECT * FROM ${ORG_TABLE}${searchString ? query : ``}`,
    {
      replacements: {
        searchString: `%${searchString}%`,
      },
    }
  );
  return results;
};
const getAllOrders = async (sequelize, searchString) => {
  const query = ` WHERE LOWER(u.name) LIKE LOWER(:searchString) OR LOWER(ord.name) LIKE LOWER(:searchString) OR CAST(quantity AS TEXT) LIKE :searchString`;
  
  const [results, metadata] = await sequelize.query(
    `SELECT ord.id, ord.name, ord.quantity, ord.user_id, u.name AS user_name FROM ${ORDERS_TABLE} AS ord INNER JOIN ${USER_TABLE} AS u ON u.id = ord.user_id ${
      searchString ? query : ``
    };`,
    {
      replacements: {
        searchString: `%${searchString}%`,
      },
    }
  );
  return results;
};

const getOrgById = async (sequelize, id) => {
  console.log("id: ", id);
  if (!id) return null;
  const [results, metadata] = await sequelize.query(
    `SELECT * FROM ${ORG_TABLE} WHERE id=:id`,
    {
      replacements: {
        id,
      },
    }
  );
  return results.length > 0 ? results[0] : null;
};

const getUserById = async (sequelize, id) => {
  if (!id) return null;
  const [results, metadata] = await sequelize.query(
    `SELECT * FROM ${USERS_VIEW} WHERE id=:id`,
    {
      replacements: {
        id,
      },
    }
  );
  return results.length > 0 ? results[0] : null;
};

const getOrderById = async (sequelize, id) => {
  if (!id) return null;
  const [results, metadata] = await sequelize.query(
    `SELECT * FROM ${ORDERS_VIEW} WHERE id=:id`,
    {
      replacements: {
        id,
      },
    }
  );
  return results.length > 0 ? results[0] : null;
};

const addUser = async (sequelize, user) => {
  if (!user.name || !user.address || !user.age || !user.org_id) {
    return null;
  }
  try {
    const result = await sequelize.transaction(async (t) => {
      const [results, metadata] = await sequelize.query(
        `INSERT INTO ${USER_TABLE} (name, age, address, profession) VALUES(:name, :age, :address, :profession) RETURNING *`,
        {
          transaction: t,
          replacements: {
            name: user.name,
            age: user.age,
            address: user.address,
            profession: user.profession ?? null,
          },
        }
      );
      await sequelize.query(
        `INSERT INTO ${ORG_TO_USERS} (user_id, org_id) VALUES (:user_id, :org_id)`,
        {
          transaction: t,
          replacements: {
            user_id: results[0].id,
            org_id: user.org_id,
          },
        }
      );
      const org = await getOrgById(sequelize, user.org_id);
      const userInDb = { ...results[0], org_name: org.name };
      return userInDb;
    });
    return result;
  } catch (err) {
    console.log("Error: ", err);
    return null;
  }
};

const addOrder = async (sequelize, order) => {
  if (!order.user_id || !order.quantity || !order.name) return null;
  try {
    const { name, quantity, user_id } = order;
    const [result1, metadata1] = await sequelize.query(
      `INSERT INTO ${ORDERS_TABLE} (name, quantity, user_id) VALUES (:name, :quantity, :user_id) RETURNING *`,
      {
        replacements: {
          name,
          quantity,
          user_id,
        },
      }
    );
    const user = await getUserById(sequelize, user_id);
    return { ...result1[0], user_name: user.name };
  } catch (err) {
    console.error(err);
    return null;
  }
};
const addOrganization = async (sequelize, org) => {
  if (!org.name || !org.address) {
    return null;
  }
  const [results, metadata] = await sequelize.query(
    `INSERT INTO ${ORG_TABLE} (name, address) VALUES(:name, :address) RETURNING *`,
    {
      replacements: {
        name: org.name,
        address: org.address,
      },
    }
  );
  return results[0];
};

const updateUser = async (sequelize, user) => {
  try {
    const res = await sequelize.transaction(async (t) => {
      const [r1, m1] = await sequelize.query(
        `UPDATE ${ORG_TO_USERS} SET org_id=:org_id WHERE user_id=:user_id RETURNING org_id`,
        {
          transaction: t,
          replacements: {
            org_id: user.org_id,
            user_id: user.id,
          },
        }
      );
      delete user.org_id;
      let query = "";
      for (const key in user) {
        user[key] && key !== "id" ? (query += `${key}=:${key}, `) : "";
      }
      const length = query.length;
      query = query.substring(0, length - 2);
      console.log(query);

      const [r2, m2] = await sequelize.query(
        `UPDATE ${USER_TABLE} SET ${query} WHERE id=:id RETURNING *`,
        {
          transaction: t,
          replacements: {
            id: user.id,
            name: user.name,
            age: user.age,
            address: user.address,
            profession: user.profession,
          },
        }
      );
      const org_name = (await getOrgById(sequelize, r1[0].org_id)).name;
      return { ...r2[0], ...r1[0], org_name };
    });
    return res;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const updateOrder = async (sequelize, order) => {
  let query = "";
  for (const key in order) {
    order[key] && key !== "id" ? (query += `${key}=:${key}, `) : "";
  }
  const length = query.length;
  query = query.substring(0, length - 2);
  console.log(query);

  const [results, metadata] = await sequelize.query(
    `UPDATE ${ORDERS_TABLE} SET ${query} WHERE id=:id RETURNING *`,
    {
      replacements: {
        id: order.id,
        name: order.name,
        quantity: order.quantity,
        user_id: order.user_id,
      },
    }
  );
  const user_name = (await getUserById(sequelize, results[0].user_id)).name;
  return { ...results[0], user_name };
};

const updateOrganization = async (sequelize, org) => {
  let query = "";
  for (const key in org) {
    org[key] && key !== "id" ? (query += `${key}=:${key}, `) : "";
  }
  const length = query.length;
  query = query.substring(0, length - 2);
  console.log(query);

  const [results, metadata] = await sequelize.query(
    `UPDATE ${ORG_TABLE} SET ${query} WHERE id=:id RETURNING *`,
    {
      replacements: {
        id: org.id,
        name: org.name,
        address: org.address,
      },
    }
  );
  return results[0];
};

const deleteUser = async (sequelize, id) => {
  if (!id) return null;

  await sequelize.query(`DELETE FROM ${USER_TABLE} WHERE id=:id`, {
    replacements: {
      id,
    },
  });
  return SUCCESS;
};

const deleteOrganization = async (sequelize, id) => {
  if (!id) return null;
  try {
    // First delete users from this organization, then delete organization
    const result = await sequelize.transaction(async (t) => {
      await sequelize.query(
        `DELETE FROM users WHERE id IN (SELECT user_id FROM ${ORG_TO_USERS} WHERE org_id=:id)`,
        {
          transaction: t,
          replacements: {
            id,
          },
        }
      );
      await sequelize.query(`DELETE FROM ${ORG_TABLE} WHERE id=:id`, {
        transaction: t,
        replacements: {
          id,
        },
      });
      return SUCCESS;
    });
    return result;
  } catch (err) {
    console.error(err);
    return null;
  }
};
const deleteOrder = async (sequelize, id) => {
  if (!id) return null;
  console.log("Deleting order: ", id);
  const [result, metadata] = await sequelize.query(
    `DELETE FROM ${ORDERS_TABLE} WHERE id=:id`,
    {
      replacements: {
        id,
      },
    }
  );
  console.log("Deleting result: ", result);
  return SUCCESS;
};

module.exports = {
  getAllUsers,
  addUser,
  getUserById,
  updateUser,
  deleteUser,
  getAllOrganizations,
  addOrganization,
  updateOrganization,
  deleteOrganization,
  getOrgById,
  getAllOrders,
  getOrderById,
  addOrder,
  updateOrder,
  deleteOrder,
};
