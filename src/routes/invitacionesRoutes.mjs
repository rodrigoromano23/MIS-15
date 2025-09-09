import express from "express";
import { mostrarFormulario, confirmarAsistencia } from "../controllers/invitacionesController.mjs";

const router = express.Router();

// Ruta del formulario
router.get("/", mostrarFormulario);

// Confirmar asistencia
router.post("/confirmar", confirmarAsistencia);

export default router;




