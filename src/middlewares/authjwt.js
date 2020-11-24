const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/user");
const Role = require("../models/role");

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    if (!token)
      return res.status(403).json({ message: "Se necesita logearse" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    const user = await User.findById(req.userId, { password: 0 });

    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    next();
  } catch (error) {
    res.status(401).json({ message: "No autorizado" });
  }
};

const moderatorMiddleware = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const roles = await Role.find({ _id: { $in: user.roles } });
  console.log(roles);

  for (let i = 0; i < roles.length; i++) {
    const element = roles[i];
    if (element.name === "moderator" || element.name === 'admin') {
      next();
      return;
    }
  }
  return res.status(403).json({message: 'Se requiere minimo rol de moderador'})
};

const adminMiddleware = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const roles = await Role.find({ _id: { $in: user.roles } });
  console.log(roles);

  for (let i = 0; i < roles.length; i++) {
    const element = roles[i];
    if (element.name === "admin") {
      next();
      return;
    }
  }
  return res.status(403).json({message: 'Se requiere rol de administrador'})

};

module.exports = { verifyToken, moderatorMiddleware, adminMiddleware };
