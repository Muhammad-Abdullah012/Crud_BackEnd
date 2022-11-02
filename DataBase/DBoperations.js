const getAllUsers = async (userModel) => {
  return await userModel.findAll();
};

const getUserById = async (userModel, id) => {
  if (id) return await userModel.findOne({ where: { id } });
  else {
    return null;
  }
};

const addUser = async (userModel, user) => {
  if (!user.name || !user.address || !user.age) {
    return null;
  }
  console.log("User obj : ", user);
  return await userModel.create(user);
};

const updateUser = async (userModel, user) => {
  const userInDb = await getUserById(userModel, user.id);
  if (userInDb) {
    await userInDb.update(user);
    return userInDb;
  } else {
    return null;
  }
};

const deleteUser = async (userModel, id) => {
  const userInDb = await getUserById(userModel, id);
  if (userInDb) {
    await userInDb.destroy();
    return "Success";
  } else {
    return null;
  }
};

module.exports = {
  getAllUsers,
  addUser,
  getUserById,
  updateUser,
  deleteUser,
};
