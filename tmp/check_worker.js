try {
    const workerPath = require.resolve("pdfjs-dist/legacy/build/pdf.worker.mjs");
    console.log("Worker Path:", workerPath);
} catch (err) {
    console.error("Resolve failed:", err.message);
}
