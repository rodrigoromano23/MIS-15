import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import invitacionesRoutes from './routes/invitacionesRoutes.mjs'; // ✅ ojo, sin "src/"

dotenv.config();

const app = express();

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

// Rutas
app.use('/', invitacionesRoutes);

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});



