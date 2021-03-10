const User = require("../models/user");
const Role = require("../models/role");
const jwt = require("jsonwebtoken");
const Empresa = require("../models/empresa");
require("dotenv").config();

async function getEmpresas(req, res) {
  try {
    const empresas = await Empresa.find({});
    res.status(200).json({
      message: "Empresas encontradas",
      data: empresas,
    });
  } catch (error) {}
}

async function getEmpresasById(req, res) {
  try {
    const id = req.params.id;
    const empresa = await Empresa.findById(id);
    res.status(200).json({
      message: "Empresa encontrada",
      data: empresa,
    });
  } catch (error) {
    console.log(error);
  }
}

async function createEmpresa(req, res) {
  try {
    const {
      nombre,
      rif,
      tipo_contribuyente,
      estado,
      ciudad,
      telefono,
      correo,
    } = req.body;
    const newEmpresa = new Empresa({
      nombre,
      rif,
      tipo_contribuyente,
      estado,
      ciudad,
      telefono,
      correo,
      moderador: req.userId,
    });

    await newEmpresa.save();

    res.status(200).json({
      message: `Empresa ${nombre} creada satisfactoriamente`,
      data: { newEmpresa },
    });
  } catch (error) {
    console.log(error);
  }
}

async function deleteEmpresa (req, res) {
  try {
    const id = req.params.id;
    await Empresa.findByIdAndDelete(id);
    res.status(200).json({
      message: "Empresa eliminada",
    });
  } catch (error) {
    console.log(error);
  }
}


module.exports = {
  getEmpresas,
  createEmpresa,
  getEmpresasById,
  deleteEmpresa,
  // updateUser,
  // profileUser,
  // loginUser,
};
