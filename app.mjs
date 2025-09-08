import express from "express";
import bodyParser from "body-parser";
import invitacionesRoutes from "routes/invitacionesRoutes.mjs";

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

app.use("/", invitacionesRoutes);

// Puerto dinámico para Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));



