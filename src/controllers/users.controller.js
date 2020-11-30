const User = require("../models/user");
const Role = require("../models/role");
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function getUsers(req, res) {
  try {
    const users = await User.find({}, { password: 0 });
    res.status(200).json({
      message: "Usuarios encontrados",
      data: users,
    });
  } catch (error) {}
}

async function createUser(req, res) {

  try {
  const { nombre, apellido, correo, password, role } = req.body;
    const newUser = new User({
      nombre,
      apellido,
      correo,
      password,
      role
    });

    const userRole = role ? await Role.findOne({name: role}) : await Role.findOne({ name: "user" });
    newUser.roles = [userRole._id];
    newUser.password = await newUser.encryptPassword(password);
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: 60 * 60 * 24,
    });

    res.status(200).json({
      message: `Usuario ${nombre} creado satisfactoriamente`,
      data: { newUser },
      token,
    });
  } catch (error) {
    console.log(error);
  }
}

async function getUserById(req, res) {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (user) {
      res.status(200).json({
        message: "Usuario encontrado",
        status: 200,
        data: {
          nombre: user.nombre,
          apellido: user.apellido,
          correo: user.correo,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
}

async function deleteUser(req, res) {
  const { id } = req.params;
  try {
    const userToDelete = await User.findByIdAndDelete(id);
    if (userToDelete) {
      res.status(200).json({
        message: `Usuario ${userToDelete.nombre} eliminado con exito`,
        status: 200,
        data: userToDelete,
      });
    } else
      res.status(404).json({
        message: "No se ha encontrado un usuario con ese id",
        status: 404,
      });
  } catch (error) {}
}

async function updateUser(req, res) {
  const { id } = req.params;
  const { nombre, apellido, correo } = req.body;
  console.log(req.body);
  try {
    const userToUpdate = await User.findByIdAndUpdate(
      id,
      {
        nombre,
        apellido,
        correo,
      },
      { options: (omitUndefined = true) }
    );
    res.status(200).json({
      message: "Usuario actualizado",
      status: 200,
      data: userToUpdate,
    });
  } catch (error) {
    console.log(error);
  }
}

async function profileUser(req, res) {
  try {
    const token = req.headers["x-access-token"];
    if (!token) {
      return res.status(401).json({
        message: "No token provided",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id, { password: 0 });
    if (!user) {
      return res.status(404).send("Usuario no encontrado");
    }
    res.status(200).json({
      message: "Usuario encontrado",
      status: 200,
      data: user,
    });
  } catch (error) {
    console.log(error);
  }
}

async function loginUser(req, res) {
  try {
    const { correo, password } = req.body;
    if (!correo || !password) {
      return res.status(403).send({ message: "Datos requeridos" });
    }
    const user = await User.findOne({ correo });
    console.log(user);
    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado",
        status: 404,
        data: req.body,
      });
    }
    const role = await Role.findById(user.roles)
    const roleName = role.name
    const isValid = await user.validatePassword(password);
    if (isValid) {
      const token = jwt.sign(
        { id: user._id, roles: user.roles },
        process.env.JWT_SECRET,
        {
          expiresIn: 60 * 60 * 24,
        }
      );
      return res.status(200).json({
        message: "Logeado satisfactoriamente",
        token,
        roleName
      });
    } else
      return res.status(401).json({
        message: "Correo o contraseña incorrectas",
      });
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getUsers,
  createUser,
  getUserById,
  deleteUser,
  updateUser,
  profileUser,
  loginUser,
};

// {
//     "id":"5faf2dafd823672c58ff7b77"
// }

// {
//     "nombre":"Anderson",
//     "apellido":"Holmquist",
//     "correo":"anderholmquist@gmail.com",
//     "password":"051994"
// }
