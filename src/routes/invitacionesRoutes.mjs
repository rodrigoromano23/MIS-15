import express from 'express';
import { confirmarInvitacion } from './controllers/invitacionesController.mjs'; // ✅ sin "src/"

const router = express.Router();

router.get('/', (req, res) => {
  res.render('formulario'); // Asegúrate que tengas views/formulario.ejs
});

router.post('/confirmar', confirmarInvitacion);

export default router;



