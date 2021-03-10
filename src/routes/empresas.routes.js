const { Router } = require("express");
const {
  getEmpresas,
  createEmpresa,
  getEmpresasById,
  deleteEmpresa,
} = require("../controllers/empresas.controller");
const router = Router();

const { verifyToken, moderatorMiddleware } = require("../middlewares/authjwt");

router.get("/", [verifyToken, moderatorMiddleware], getEmpresas);
router.get("/:id", [verifyToken, moderatorMiddleware], getEmpresasById);
router.post("/", [verifyToken, moderatorMiddleware], createEmpresa);
router.delete("/:id", [verifyToken, moderatorMiddleware], deleteEmpresa);


module.exports = router;
