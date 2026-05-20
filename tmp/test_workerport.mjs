import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";
import * as pdfjsWorker from "pdfjs-dist/legacy/build/pdf.worker.mjs";

async function test() {
    try {
        console.log("PDFJS and Worker loaded");
        pdfjs.GlobalWorkerOptions.workerPort = pdfjsWorker;
        
        const buffer = Buffer.from("%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << >> >>\nendobj\n4 0 obj\n<< /Length 44 >>\nstream\nBT /F1 12 Tf 100 700 Td (Hello World) Tj ET\nendstream\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF");
        
        const loadingTask = pdfjs.getDocument({
            data: new Uint8Array(buffer),
            verbosity: 0
        });
        const doc = await loadingTask.promise;
        console.log("Document loaded, pages:", doc.numPages);
        const page = await doc.getPage(1);
        const content = await page.getTextContent();
        console.log("Text content extracted");
    } catch (err) {
        console.error("Test failed:", err);
    }
}

test();
