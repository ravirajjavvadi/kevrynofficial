import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";

async function test() {
    try {
        console.log("PDFJS loaded");
        const buffer = Buffer.from("%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << >> >>\nendobj\n4 0 obj\n<< /Length 44 >>\nstream\nBT /F1 12 Tf 100 700 Td (Hello World) Tj ET\nendstream\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF");
        
        const loadingTask = pdfjs.getDocument({
            data: new Uint8Array(buffer),
            disableWorker: true,
            verbosity: 0
        });
        const doc = await loadingTask.promise;
        console.log("Document loaded, pages:", doc.numPages);
        
        const page = await doc.getPage(1);
        const content = await page.getTextContent();
        const text = content.items.map(item => item.str).join(" ");
        console.log("Extracted Text:", text);
    } catch (err) {
        console.error("Test failed:", err);
    }
}

test();
