document.getElementById("qrForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const text = document.getElementById("text").value;
  const size = document.getElementById("size").value;
  const ecLevel = document.getElementById("ecLevel").value;
  const colorDark = document.getElementById("colorDark").value.substring(1);

  const apiUrl = `/api/qr?text=${encodeURIComponent(text)}&size=${size}&dark=${colorDark}&ecLevel=${ecLevel}`;

  const qrImage = document.getElementById("qrImage");
  const resultContainer = document.getElementById("resultContainer");

  qrImage.src = apiUrl;
  resultContainer.style.display = "block";
});

// New logic to handle the download
document.getElementById("downloadBtn").addEventListener("click", function () {
  // Get the current URL of the generated image
  const imageSrc = document.getElementById("qrImage").src;

  // Create a temporary, invisible link element
  const link = document.createElement("a");
  link.href = imageSrc;

  // The 'download' attribute tells the browser to save it as a file
  link.download = "qrcode.png";

  // Append it to the document, click it programmatically, then remove it
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});
