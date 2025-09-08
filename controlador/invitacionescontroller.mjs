import { google } from "googleapis";
import { createCanvas, loadImage } from "canvas";
import { writeFileSync } from "fs";

const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
const auth = new google.auth.GoogleAuth({
  credentials: serviceAccount,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const spreadsheetId = process.env.SPREADSHEET_ID;

export const mostrarFormulario = (req, res) => {
  res.render("index");
};

export const confirmarAsistencia = async (req, res) => {
  try {
    const { nombre, cantidad } = req.body;

    if (!nombre || !cantidad) {
      return res.status(400).send("Debes ingresar un nombre y seleccionar cantidad");
    }

    const client = await auth.getClient();
    const sheetsApi = google.sheets({ version: "v4", auth: client });

    await sheetsApi.spreadsheets.values.append({
      spreadsheetId,
      range: "Hoja1!A:B",
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [[nombre, cantidad]] },
    });

    // Crear invitación
    const width = 800, height = 600;
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

    res.render("confirmacion", { nombre, cantidad, fileName });
  } catch (err) {
    console.error("❌ Error al confirmar asistencia:", err);
    res.status(500).send("Hubo un error al confirmar tu asistencia.");
  }
};

// controllers/invitacionesController.mjs
export const confirmarInvitacion = (req, res) => {
  const { nombre, cantidad } = req.body;

  // Si falta algún dato
  if (!nombre || !cantidad) {
    return res.status(400).send("Faltan datos para confirmar la invitación.");
  }

  // Renderizamos la vista de confirmación
  res.render("confirmacion", {
    nombre,
    cantidad,
    fileName: "ejemplo.png" // en el futuro podés generar la invitación personalizada
  });
};

