import express from "express";
import { mostrarFormulario, confirmarAsistencia } from "../controllers/invitacionesController.mjs";

const router = express.Router();

router.get("/", mostrarFormulario);
router.post("/confirmar", confirmarAsistencia);

export default router;


