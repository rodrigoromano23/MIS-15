import express from "express";
import { mostrarFormulario, confirmarAsistencia } from "../controllers/invitacion.mjs"

const router = express.Router();

// Ruta del formulario
router.get("/", mostrarFormulario);

// Confirmar asistencia
router.post("/confirmar", confirmarAsistencia);

export default router;




