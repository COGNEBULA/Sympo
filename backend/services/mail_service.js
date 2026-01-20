const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

async function sendWelcomeMail(receipt) {
  const {
    receipt_id,
    participant,
    events,
    food,
  } = receipt;

  const { name, email } = participant;

  /* 🎯 Event cards (simple list now) */
  const eventsHtml = events
    .map(
      (eventName) => `
        <div class="event-card">
          <h4>${eventName}</h4>
        </div>
      `
    )
    .join("");

  await transporter.sendMail({
    from: `"COGNEBULA 26 🚀" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "🎉 Registration Confirmed – COGNEBULA 26",
    html: `
<!DOCTYPE html>
<html>
<head>
<style>
  body {
    margin: 0;
    background: #0b0b14;
    font-family: 'Segoe UI', Arial, sans-serif;
  }

  .wrapper {
    padding: 30px 15px;
  }

  .card {
    max-width: 650px;
    margin: auto;
    background: linear-gradient(145deg, #1a1a2e, #0f3460);
    border-radius: 18px;
    padding: 30px;
    color: #ffffff;
    box-shadow: 0 0 40px rgba(138,43,226,0.35);
  }

  .hero {
    text-align: center;
  }

  .hero h1 {
    font-size: 32px;
    margin-bottom: 6px;
    color: #d6b4ff;
  }

  .hero p {
    font-size: 15px;
    color: #cfcfe6;
    margin: 0;
  }

  .badge {
    margin-top: 10px;
    display: inline-block;
    padding: 6px 14px;
    background: linear-gradient(90deg, #8e2de2, #4a00e0);
    border-radius: 20px;
    font-size: 13px;
    letter-spacing: 1px;
  }

  .receipt-id {
    margin-top: 14px;
    padding: 8px 16px;
    display: inline-block;
    background: rgba(255,255,255,0.12);
    border-radius: 12px;
    font-size: 14px;
    letter-spacing: 1px;
    color: #f0e6ff;
  }

  .content-text {
    margin-top: 22px;
    font-size: 15px;
    color: #e8e8ff;
    line-height: 1.6;
  }

  h3 {
    margin-top: 30px;
    color: #f0e6ff;
  }

  .event-card {
    background: rgba(255,255,255,0.07);
    border-radius: 12px;
    padding: 14px;
    margin-bottom: 12px;
  }

  .event-card h4 {
    margin: 0;
    color: #e0c3ff;
  }

  .rules {
    margin-top: 30px;
    padding: 18px;
    background: rgba(255, 87, 87, 0.12);
    border-left: 4px solid #ff6b6b;
    border-radius: 12px;
  }

  .rules h3 {
    margin-top: 0;
    color: #ffb3b3;
  }

  .rules ul {
    padding-left: 18px;
    margin: 0;
  }

  .rules li {
    margin-bottom: 10px;
    color: #ffecec;
    line-height: 1.5;
  }

  .food {
    text-align: center;
    margin-top: 30px;
    padding: 20px;
    background: rgba(0,0,0,0.25);
    border-radius: 14px;
  }

  .footer {
    margin-top: 30px;
    font-size: 13px;
    color: #b8b8d4;
    text-align: center;
  }
</style>
</head>

<body>
  <div class="wrapper">
    <div class="card">

      <div class="hero">
        <h1>COGNEBULA 26</h1>
        <p>Where Innovation Meets Intelligence 🌌</p>
        <div class="badge">REGISTRATION CONFIRMED</div>
        ${
          receipt_id
            ? `<div class="receipt-id">🎫 Receipt ID: <b>${receipt_id}</b></div>`
            : ""
        }
      </div>

      <div class="content-text">
        Hey <b>${name}</b>,<br/>
        You’re officially part of <b>COGNEBULA 26</b> 🚀  
        Get ready for an electrifying symposium experience!
      </div>

      <h3>📌 Your Registered Events</h3>
      ${eventsHtml}

      <div class="rules">
        <h3>⚠️ Important Instructions</h3>
        <ul>
          <li>🪪 <b>College ID Card is mandatory.</b></li>
          <li>⏳ <b>Second event participation is subject to time availability.</b></li>
          <li>
            📝 <b>
            This confirmation is provisional and subject to manual payment verification.
            In case of any discrepancy, the registration team will contact you.
            </b>
          </li>
        </ul>
      </div>

      <div class="food">
        <h3>🍽️ Food Pass</h3>
        <div><b>${food.toUpperCase()}</b></div>
        <div>(Show this at the food counter)</div>
      </div>

      <div class="footer">
        📍 Velammal Engineering College<br/>
        📅 Feb 7, 2026<br/>
        <b>See you at COGNEBULA 26 ✨</b>
      </div>

    </div>
  </div>
</body>
</html>
`,
  });
}

module.exports = { sendWelcomeMail };
