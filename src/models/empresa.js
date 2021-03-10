const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const empresa = new Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    rif: {
      type: Number,
      required: true,
      unique: true,
    },
    tipo_contribuyente: {
      type: String,
      required: true,
    },
    estado: {
      type: String,
      required: true,
    },
    ciudad: {
      type: String,
      required: true,
    },
    telefono: {
      type: Number,
    },
    correo: {
      type: String,
      required: true,
    },
    moderador: [
      {
        ref: "User",
        type: Schema.Types.ObjectId,
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

module.exports = model("Empresa", empresa);
