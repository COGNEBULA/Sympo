import React from 'react';
import styles from './Contact.module.css';
import panther from '../../../Assets/panther.png';
import alien from '../../../Assets/alien.png';
import { Card } from './Card';

const contactGroups = [
  {
    title: "Staff Co-ordinators",
    side: "center",
    style: "grid grid-cols-2 gap-4 sm:gap-6 md:flex md:flex-row md:justify-center md:gap-x-12",
    members: [
      {
        role: "Staff Co-ordinator",
        name: "Mrs. A.Prema",
        phone: "9994428780",
        email: "prema@velammal.edu.in",
        big: true
      },
      {
        role: "Staff Co-ordinator",
        name: "Mrs. Priya M",
        phone: "9841170770",
        email: "priya.m@velammal.edu.in",
        big: true
      },
      {
        role: "Staff Co-ordinator",
        name: "Mrs. S. Mythili",
        phone: "9626901493",
        email: "mythili@velammal.edu.in",
        big: true
      }
    ]
  },
  {
    title: "President & Vice President",
    img: alien,
    side: "left",
    style: "flex md:justify-center md:gap-x-8",
    members: [
      {
        role: "President",
        name: "Aaron Ebinezer Arun A",
        phone: "7358752876",
        email: "aaaronebinezerarun@gmail.com"
      },
      {
        role: "Vice President",
        name: "Niharika B",
        phone: "8925469498",
        email: "niharikab200904@gmail.com"
      }
    ]
  },
  {
    title: "Secretary & Joint Secretary",
    img: panther,
    side: "right",
    style: "flex md:justify-center md:gap-x-8",
    members: [
      {
        role: "Secretary",
        name: "Mohamed Hajee J",
        phone: "9094111907",
        email: "mohammedhajee909@gmail.com"
      },
      {
        role: "Joint Secretary",
        name: "Pragati Sangari S R",
        phone: "9600082752",
        email: "pragatisangari@gmail.com"
      }
    ]
  }
];

export default function ContactTeam() {
  return (
    <section className={styles.page} aria-label="Contact section" id='contact'>
      <div className={styles.headerWrap}>
        <h2 className={styles.title}>Contact</h2>
        <p className={styles.subtitle}>Reach out to our coordinators for any Enquiries</p>
      </div>

      <Card contactGroups={contactGroups} />

    </section>
  );
}
