import * as pdfjsLib from "pdfjs-dist/webpack";
import jsQR from "jsqr"; // Import jsQR for QR code decoding

const decodeQrCode = (imageDataUrl) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const decoded = jsQR(imageData.data, canvas.width, canvas.height);
      if (decoded) {
        resolve(decoded.data);
      } else {
        resolve(null);
      }
    };
    img.onerror = () => reject("Error loading image");
    img.src = imageDataUrl;
  });
};

export const pdfToQrData = async (file) => {
  try {
    const pdfData = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
    let qrData;

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 2.0 }); // Increase scale for better quality
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      await page.render(renderContext).promise;
      const dataURL = canvas.toDataURL("image/png");
      qrData = await decodeQrCode(dataURL);

      if (qrData) {
        break; // Exit loop if QR code is found
      }
    }

    return qrData;
  } catch (err) {
    console.error("Error processing PDF:", err);
    throw new Error("Failed to process PDF file.");
  }
};
