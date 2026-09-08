import express from "express";
import QRCode from "qrcode";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

app.get("/", async (_, res) => {
  res.sendFile("index.html");
});

app.get("/api/qr", async (req, res) => {
  // Destructure query parameters with defaults in mind
  const {
    text,
    size = 300,
    dark = "000000",
    light = "ffffff",
    ecLevel = "M",
  } = req.query;

  // The text parameter is mandatory
  if (!text) {
    return res.status(400).json({
      error: 'The "text" query parameter is required.',
    });
  }

  // Configure QRCode generation options
  const options = {
    width: parseInt(size, 10),
    errorCorrectionLevel: ecLevel.toUpperCase(), // Accepts L, M, Q, H
    margin: 2, // Padding around the QR code
    color: {
      // Prepend '#' since URLs strip it as an anchor hash
      dark: `#${dark}`,
      light: `#${light}`,
    },
  };

  try {
    // Generate the QR code as a PNG buffer
    const buffer = await QRCode.toBuffer(text, options);

    // Set headers so the client knows it's receiving an image
    res.setHeader("Content-Type", "image/png");
    res.send(buffer);
  } catch (error) {
    console.error("QR Generation Error:", error);
    res.status(500).json({ error: "Failed to generate QR code." });
  }
});

app.listen(PORT, () => {
  console.log(`QR Code API is running at http://localhost:${PORT}`);
});
