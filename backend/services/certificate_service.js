const pool = require("../config/db");
const queue = require("./queue_service");
const sendMail = require("./email_service").sendCertificateMail;
const { generateCertificate } = require("./certificate_pdf_service");


exports.sendCertificatesForCoordinatorEvent = async (
  registrationIds,
  eventName
) => {
  const { rows } = await pool.query(
    `
  SELECT
    r.id AS registration_id,
    r.name,
    r.email,
    r.second_email,
    r.college,
    r.student_year,
    $2::TEXT AS event_name
  FROM registrations r
  WHERE r.id = ANY($1::int[])
    AND $2::TEXT = ANY(r.events)
  ORDER BY r.id ASC
  `,
    [registrationIds, eventName]
  );


  if (rows.length === 0) {
    console.log(`⚠️ No matching registrations for event: ${eventName}`);
    return;
  }

  rows.forEach((data) => {
    queue.enqueue(async () => {

      const pdfBuffer = await generateCertificate({
        name: data.name,
        college: data.college,
        event: data.event_name
      });

      // ✅ SEND AS OBJECT (IMPORTANT)

      console.log("🎯 CERT MAIL DATA →", {
        email: data.email,
        secondmail: data.second_email
      });

      await sendMail({
        email: data.email,
        secondmail: data.second_email, // will be undefined if not selected
        subject: `Certificate for ${data.event_name}`,
        html: "<p>Please find your certificate attached.</p>",
        pdfBuffer
      });
    

      console.log(
        `✅ Sent → ${data.email} | ${data.event_name}`
      );
    });
  });

};