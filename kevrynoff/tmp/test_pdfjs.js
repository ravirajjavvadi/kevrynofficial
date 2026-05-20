const pdfjs = require("pdfjs-dist/legacy/build/pdf.js");

async function test() {
    try {
        console.log("PDFJS loaded");
        // Using a tiny valid PDF header to test loading
        const buffer = Buffer.from("%PDF-1.4\n1 0 obj\n<< /Length 2 >>\nstream\n\nendstream\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF");
        const loadingTask = pdfjs.getDocument({
            data: new Uint8Array(buffer),
            disableWorker: true,
            verbosity: 0
        });
        const doc = await loadingTask.promise;
        console.log("Document loaded, pages:", doc.numPages);
    } catch (err) {
        console.error("Test failed:", err);
    }
}

test();
