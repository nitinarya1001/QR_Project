import express from "express";
import QRCode from "qrcode";
import dotenv from "dotenv";
dotenv.config({ quiet: true });

const PORT = process.env.PORT;
const app = express();

app.use(express.static("public"));

app.get("/", async (_, res) => {
  res.sendFile("index.html");
});

app.get("/api/qr", async (req, res) => {
  const { text, size = 300, dark = "000000", ecLevel = "M" } = req.query;

  // The text parameter is mandatory
  if (!text) {
    return res.status(400).json({
      error: 'The "text" query parameter is required.',
    });
  }
  const options = {
    width: parseInt(size, 10),
    errorCorrectionLevel: ecLevel.toUpperCase(),
    margin: 2,
    color: {
      dark: `#${dark}`,
    },
  };
  try {
    // Generate the QR code as a PNG buffer
    const buffer = await QRCode.toBuffer(text, options);
    res.setHeader("Content-Type", "image/png");
    res.status(200).send(buffer);
  } catch (error) {
    console.error("QR Generation Error:", error);
    res.status(500).json({ error: "Failed to generate QR code." });
  }
});

app.listen(PORT, () => {
  console.log("server is running...");
});
