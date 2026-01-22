// services/certificate_pdf_service.js

const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");

exports.generateCertificate = ({ name, college, event }) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                size: "A4",
                layout: "landscape",
                margin: 0
            });

            const buffers = [];
            doc.on("data", buffers.push.bind(buffers));
            doc.on("end", () => resolve(Buffer.concat(buffers)));

            /* =========================
               BACKGROUND IMAGE
            ========================= */
            const bgPath = path.join(__dirname, "../assets/ecertificate.png");


            const imageBuffer = fs.readFileSync(bgPath);

            doc.image(imageBuffer, 0, 0, {
                width: doc.page.width,
                height: doc.page.height
            });

            /* =========================
               NAME (CENTER)
            ========================= */
            doc
                .fontSize(32)
                .fillColor("#0F172A")
                .text(name, 0, 300, {
                    align: "center"
                });

           
          
            /* =========================
               SIGNATURE & DATE
            ========================= */
            doc
                .fontSize(14)
                .fillColor("#000")
                .text("Coordinator", 120, doc.page.height - 150);

            doc.text(
                new Date().toLocaleDateString(),
                doc.page.width - 240,
                doc.page.height - 150
            )

            doc.end();
        } catch (err) {
            reject(err);
        }
    });
};
