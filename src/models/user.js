const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const user = new Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    apellido: {
      type: String,
      required: true,
    },
    correo: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles:[{
      ref:'Role',
      type: Schema.Types.ObjectId
    }]
  },
  { timestamps: true, versionKey:false }
);

user.methods.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

user.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = model("User", user);
