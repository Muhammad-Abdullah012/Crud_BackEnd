const { USER_TABLE } = require("./constants");

// OR address LIKE :searchString OR profession LIKE :searchString`,

const getAllUsers = async (sequelize, searchString) => {
  const query = ` WHERE LOWER(name) LIKE LOWER(:searchString) OR LOWER(address) LIKE LOWER(:searchString) OR LOWER(profession) LIKE LOWER(:searchString) OR CAST(age AS TEXT) LIKE :searchString`;
  const [results, metadata] = await sequelize.query(
    `SELECT * FROM ${USER_TABLE}${searchString ? query : ``}`,
    {
      replacements: {
        searchString: `%${searchString}%`,
      },
    }
  );
  console.log("Results: ", results);
  return results;
};

const getUserById = async (sequelize, id) => {
  if (id) {
    const [results, metadata] = await sequelize.query(
      `SELECT * FROM ${USER_TABLE} WHERE id=:id`,
      {
        replacements: {
          id,
        },
      }
    );
    if (results.length > 0) return results[0];
    else return null;
  } else {
    return null;
  }
};

const addUser = async (sequelize, user) => {
  if (!user.name || !user.address || !user.age) {
    return null;
  }
  const date = new Date();
  const [results, metadata] = await sequelize.query(
    `INSERT INTO ${USER_TABLE} (name, age, address, profession) VALUES(:name, :age, :address, :profession) RETURNING *`,
    {
      replacements: {
        name: user.name,
        age: user.age,
        address: user.address,
        profession: user.profession ?? null,
      },
    }
  );
  return results[0];
};

//name=:name, age=:age, address=:address, profession=:profession
const updateUser = async (sequelize, user) => {
  let query = "";
  for (const key in user) {
    user[key] && key !== "id" ? (query += `${key}=:${key}, `) : "";
  }
  const length = query.length;
  query = query.substring(0, length - 2);
  console.log(query);

  const [results, metadata] = await sequelize.query(
    `UPDATE ${USER_TABLE} SET ${query} WHERE id=:id RETURNING *`,
    {
      replacements: {
        id: user.id,
        name: user.name,
        age: user.age,
        address: user.address,
        profession: user.profession,
      },
    }
  );
  return results[0];
};

const deleteUser = async (sequelize, id) => {
  if (!id) {
    return null;
  }
  await sequelize.query(`DELETE FROM ${USER_TABLE} WHERE id=:id`, {
    replacements: {
      id,
    },
  });
  return "Success";
};

module.exports = {
  getAllUsers,
  addUser,
  getUserById,
  updateUser,
  deleteUser,
};
