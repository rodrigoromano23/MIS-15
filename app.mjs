import express from "express";
import bodyParser from "body-parser";
import { google } from "googleapis";
import { createCanvas, loadImage } from "canvas";
import { writeFileSync } from "fs";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));

const auth = new google.auth.GoogleAuth({
  keyFile: "invitaciones-15-b5f1d613e10f.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const spreadsheetId = "17GRE_9YBjctp9M1lmxqIehXK9FwZ_RY0hpyrwOKCEBQ";

// Vista principal
app.get("/", (req, res) => {
  res.render("index");
});

// Confirmación
app.post("/confirmar", async (req, res) => {
  try {
    const { nombre, cantidad } = req.body;

    // Guardar en Google Sheet
    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "A:B",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[nombre, cantidad]],
      },
    });

    // Generar invitación personalizada
    const width = 800;
    const height = 600;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Cargar fondo (imagen que pongas en /public)
    const fondo = await loadImage("./public/x.jpg");
    ctx.drawImage(fondo, 0, 0, width, height);

    // Texto título
    ctx.fillStyle = "#fff";
    ctx.font = "bold 40px serif";
    ctx.textAlign = "center";
    ctx.fillText("🎉 Invitación de 15 Años 🎉", width / 2, 80);

    // Texto invitado
    ctx.fillStyle = "#000";
    ctx.font = "30px serif";
    ctx.fillText(`Invitado: ${nombre}`, width / 2, 300);
    ctx.fillText(`Personas confirmadas: ${cantidad}`, width / 2, 360);

    // Guardar imagen en public/
    const fileName = `invitacion-${Date.now()}.png`;
    writeFileSync(`./public/${fileName}`, canvas.toBuffer("image/png"));

    // Mostrar al usuario
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
