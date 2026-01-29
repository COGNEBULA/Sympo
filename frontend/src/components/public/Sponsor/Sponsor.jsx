// components/Sponsors/sponsor.jsx
import React from "react";
import styles from "./sponsor.module.css";

const sponsors = [
  { name: "Atlanwa", img: "/images/Sponsors/atlanva.png" },
  { name: "Coat Park", img: "/images/Sponsors/coatpark.png" },
  { name: "JD Dog Robot", img: "/images/Sponsors/dogrobot.webp" },
  { name: "Square Brothers", img: "/images/Sponsors/squarebrothers.png" }
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
