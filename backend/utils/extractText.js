const mammoth = require("mammoth");

let pdfjsLib = null;

async function loadPDFLib() {
  if (!pdfjsLib) {
    pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
  }
}

async function extractText(fileBuffer, mimeType) {
  try {
    console.log("Extracting text from:", mimeType);

    // ✅ PDF extraction
    if (mimeType === "application/pdf") {
      await loadPDFLib();

      const uint8Array = new Uint8Array(fileBuffer);
const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
      const pdf = await loadingTask.promise;

      let fullText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();

        const pageText = content.items.map(item => item.str).join(" ");
        fullText += pageText + "\n";
      }

      console.log("🔥 PDF text length:", fullText.length);
      console.log("Preview:", fullText.slice(0,200));

      return fullText;
    }

    // ✅ DOCX
    if (
      mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      return result.value;
    }

    throw new Error(`Unsupported file type: ${mimeType}`);
  } catch (err) {
    console.error("Extraction error:", err);
    throw err;
  }
}

module.exports = { extractText };
