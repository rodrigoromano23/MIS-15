import express from "express";
import bodyParser from "body-parser";
import { google } from "googleapis";
import { createCanvas, loadImage } from "canvas";
import { writeFileSync } from "fs";

const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);

const auth = new google.auth.GoogleAuth({
  credentials: serviceAccount,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });
const spreadsheetId = "TU_ID_DE_SPREADSHEET";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));

// Rutas
app.get("/", (req, res) => {
  res.render("index");
});

app.post("/confirmar", async (req, res) => {
  try {
    const { nombre, cantidad } = req.body;
    const client = await auth.getClient();
    const sheetsApi = google.sheets({ version: "v4", auth: client });

    await sheetsApi.spreadsheets.values.append({
      spreadsheetId,
      range: "A:B",
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [[nombre, cantidad]] },
    });

    // Crear tarjeta con canvas
    const width = 800;
    const height = 600;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    const fondo = await loadImage("./public/x.jpg");
    ctx.drawImage(fondo, 0, 0, width, height);

    ctx.fillStyle = "#fff";
    ctx.font = "bold 40px serif";
    ctx.textAlign = "center";
    ctx.fillText("🎉 Invitación de 15 Años 🎉", width / 2, 80);

    ctx.fillStyle = "#000";
    ctx.font = "30px serif";
    ctx.fillText(`Invitado: ${nombre}`, width / 2, 300);
    ctx.fillText(`Personas confirmadas: ${cantidad}`, width / 2, 360);

    const fileName = `invitacion-${Date.now()}.png`;
    writeFileSync(`./public/${fileName}`, canvas.toBuffer("image/png"));

    res.send(`
      <h2>¡Gracias ${nombre}! 🎉</h2>
      <p>Has confirmado ${cantidad} persona(s).</p>
      <p>Tu invitación personalizada:</p>
      <img src="/${fileName}" width="400">
      <br><br>
      <a href="/${fileName}" download="invitacion.png">📥 Descargar Invitación</a>
      <br><br>
      <a href="/">⬅ Volver al inicio</a>
    `);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Hubo un error al confirmar tu asistencia.");
  }
});

app.listen(3000, () => console.log("Servidor en http://localhost:3000"));
