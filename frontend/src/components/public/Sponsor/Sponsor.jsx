// components/Sponsors/sponsor.jsx
import React from "react";
import styles from "./sponsor.module.css";

const sponsors = [
  { name: "Atlanwa", img: "/images/Sponsors/atlanva.png" },
  { name: "Coat Park", img: "/images/Sponsors/coatpark.png" },
  { name: "JD Robot Dog", img: "/images/Sponsors/dogrobot.webp" },
  { name: "Square Brothers", img: "/images/Sponsors/squarebrothers.png" },
  { name: "Imarticus Learnimg", img: "/images/Sponsors/IL.jpeg" },
  { name: "Sk events & catering", img: "/images/Sponsors/sk.jpeg" },
  { name: "SSI Computer Education", img: "/images/Sponsors/ssi.png" },
  { name: "Heliostrom", img: "/images/Sponsors/heliostrom.png" },
  { name: "KHEM Study Abord Agency", img: "/images/Sponsors/khem.jpeg" },
  { name: "Chennai mobiles", img: "/images/Sponsors/cm.jpg" },
  { name: "Poorvika", img: "/images/Sponsors/poorvika.png" },
];

export default function Sponsor() {
  return (
    <section >
      <header className={styles.header}>
        <h1 className={styles.title}>OUR SPONSORS</h1>
      </header>

      <div className={styles.wrapper}>
        {/* LEFT: Bubble with floating logos */}
        <div className={styles.bubbleContainer}>
          {sponsors.map((s, i) => (
            <div
              key={s.name}
              className={styles.floatingLogo}
              style={{ "--i": i }}
            >
              <img src={s.img} alt={s.name} />
              <span className={styles.sponsorName}>{s.name}</span>
            </div>
          ))}
        </div>

        {/* RIGHT: Message */}
        <div className={styles.messageContainer}>
          <div className={styles.glassBox}>
            <h2>Our Sponsors</h2>
            <p>
              We are deeply thankful to our sponsors for their continued support
              and belief in our vision. Their partnership makes this symposium
              possible and empowers innovation, collaboration, and shared growth.
            </p>
            <p className={styles.quote}>
              “Together, we build experiences that matter.”
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
