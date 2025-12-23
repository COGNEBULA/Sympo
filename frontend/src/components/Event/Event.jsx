import React, { useEffect, useRef, useState } from "react";
import styles from "./event.module.css";
import cap from "../../assets/cap.png";
import iron from "../../assets/iron.png";
import spydi from "../../assets/spydi.png";
import { useNavigate } from "react-router-dom";
import Techimg from "../../Assets/eventimg/tech.png";
import Nontechimg from "../../Assets/eventimg/nontech.png";
import Workshopimg from "../../Assets/eventimg/workshop.png";


const data = [
  {
    date: "20 NOV 2025",
    title: "Technical Events",
    desc: "Explore cutting-edge technical challenges and competitions.",
    events: [
      { name: "AI Workshop"},
      { name: "Machine Learning Hackathon"},
      { name: "Web Development Challenge"},
      { name: "Cyber Security CTF" },
      { name: "Data Science Sprint" }
    ],
    color: "neonred",
    type: "tech",
    icon: iron,
    img : Techimg,
  },
  {
    date: "28 DEC 2025",
    title: "Non-Technical Events",
    desc: "Fun, creative, and engaging non-technical events for everyone.",
    events: [
      { name: "Photography Contest"},
      { name: "Treasure Hunt" },
      { name: "Quiz"},
      { name: "Debate"},
      { name: "Short Film Contest"}
    ],
    color: "neonblue",
    type: "nontech",
    icon: cap,
    img : Nontechimg,
  },
    {
    date: "Comming soon..",
    title: "Work Shop",
    desc: "Gain our knowlege and experience with our workshop.",
    events: [],
    color: "neonred",
    type: "workshop",
    icon: spydi,
    img: Workshopimg,
  }
];

export default function Event() {

  const wrapRef = useRef(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const [eventType, setEventType] = useState(null);
  const navigate = useNavigate();

  // Toggle card expansion
  const toggleCard = (index) => {
    if (expandedCard === index) {
      setExpandedCard(null);
      setExpandedEvent(null);
    } else {
      setExpandedCard(index);
    }
  };

  // Toggle individual event expansion
  const toggleEvent = (eventIndex, cardIndex) => {
    if (expandedEvent === `${cardIndex}-${eventIndex}`) {
      setExpandedEvent(null);
    } else {
      setExpandedEvent(`${cardIndex}-${eventIndex}`);
    }
  };

  // Handle event redirection
  const handleRedirect = (link) => {
    window.location.href = link;
  };

  // optional reveal-on-scroll for cards
  useEffect(() => {
    const opts = { threshold: 0.12 };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add(styles.reveal);
      });
    }, opts);

    const items = wrapRef.current?.querySelectorAll(`.${styles.row}`);
    items?.forEach((it) => io.observe(it));
    return () => io.disconnect();
  }, []);

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>OUR EVENTS</h1>
        <div className={styles.underline} />
        <p className={styles.subtitle}>// These are our events</p>
      </header>

      <div className={styles.timelineWrap} ref={wrapRef}>
        <div className={styles.centerLine} />

        {data.map((item, i) => {
          const side = i % 2 === 0 ? styles.left : styles.right;
          const markerClass =
            item.color === "neonred"
              ? styles.red
              : item.color === "neonblue"
              ? styles.magenta
              : item.color === "neonspyred"
              ? styles.spyred
              : styles.purple;

          return (
            <div key={i} className={`${styles.row} ${side}`}>
              {/* floating image for this row */}
                <div
                  className={`${styles.floatImg} ${
                    item.type === "tech"
                      ? styles.techImg
                      : item.type === "nontech"
                      ? styles.nonTechImg
                      : styles.workshopImg
                  }`}
                  aria-hidden="true"
                >

                <img src={item.icon} alt={`${item.title} icon`} />
              </div>

              {/* card */}
<article 
  className={`${styles.card} ${expandedCard === i ? styles.cardExpanded : ''} ${styles.cardGlow}`} 
  tabIndex={0}
  onClick={() => toggleCard(i)}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleCard(i);
    }
  }}
  role="button"
  aria-expanded={expandedCard === i}
  aria-label={`${expandedCard === i ? 'Collapse' : 'Expand'} ${item.title}`}
  data-expanded={expandedCard === i}
>
  {/* Gradient background overlay */}
  <div className={styles.cardGradient}></div>
  
  {/* Glow effect */}
  <div className={styles.cardGlowEffect}></div>
  
  {/* Date badge with improved styling */}
  <span className={`${styles.badge} ${styles[item.color]} ${styles.badgeGlow}`}>
    <span className={styles.badgeText}>{item.date}</span>
    <span className={styles.badgeDeco}></span>
  </span>
  
  {/* Image with overlay effect */}
  <div className={styles.imageContainer}>
    <img
      src={item.img}
      alt={item.title || "event image"}
      className={styles.cardimg}
      loading="lazy"
    />
    <div className={styles.imageOverlay}></div>
    <div className={styles.imageShine}></div>
  </div>
  
  {/* Content */}
  <div className={styles.cardContent}>
    <h3 className={styles.cardTitle}>
      <span className={styles.titleText}>{item.title}</span>
      <span className={styles.titleUnderline}></span>
    </h3>
    
    <div className={styles.cardDescWrapper}>
      <p className={styles.cardDesc}>{item.desc}</p>

    </div>
    
  </div>
  
</article>

              
            </div>
          );
        })}
      </div>
    </section>
  );
}