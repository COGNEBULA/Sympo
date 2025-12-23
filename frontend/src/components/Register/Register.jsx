import React, { useState, useEffect } from "react";
import styles from "./register.module.css";

/* 🔹 Events */
const EVENT_MAP = {
  tech: [
    "AI Developer Hackathon",
    "Web Development Challenge",
    "ML Sprint"
  ],
  nontech: [
    "Photography",
    "Quiz",
    "Treasure Hunt"
  ],
  workshop: [
    "AI Workshop",
  ]
};

const BASE_FEE = 150;
const WORKSHOP_FEE = 150;

const RegistrationForm = () => {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    college: "",
    dept: "",
    year: "",
    food: "",
    categories: [],
    role: "",
    teamCode: ""
  });

  const [selectedEvents, setSelectedEvents] = useState({});
  const [amount, setAmount] = useState(0);

  /* 🔹 Team Code */
  const generateCode = () =>
    "TEAM-" + Math.random().toString(36).substring(2, 8).toUpperCase();

  /* 🔹 Input */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* 🔹 Category Select */
  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      categories: checked
        ? [...prev.categories, value]
        : prev.categories.filter((c) => c !== value)
    }));

    if (!checked) {
      setSelectedEvents((prev) => {
        const updated = { ...prev };
        delete updated[value];
        return updated;
      });
    }
  };

  /* 🔹 Event Select */
  const handleEventSelect = (category, event) => {
    setSelectedEvents((prev) => {
      const exists = prev[category]?.includes(event);
      return {
        ...prev,
        [category]: exists
          ? prev[category].filter((e) => e !== event)
          : [...(prev[category] || []), event]
      };
    });
  };

  /* 🔹 Role */
  const handleRole = (e) => {
    const role = e.target.value;
    setForm({
      ...form,
      role,
      teamCode: role === "leader" ? generateCode() : ""
    });
  };

  /* 🔹 AMOUNT CALCULATION LOGIC */
  useEffect(() => {
    let total = 0;

    const hasTechOrNonTech =
      form.categories.includes("tech") ||
      form.categories.includes("nontech");

    const hasWorkshop = form.categories.includes("workshop");

    if (hasTechOrNonTech) {
      total += BASE_FEE;
    }

    if (hasWorkshop) {
      total += WORKSHOP_FEE;
    }

    setAmount(total);
  }, [form.categories]);

  /* 🔹 Submit */
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      selectedEvents,
      amount
    };

    console.log("Final Registration:", payload);
    alert(`Proceed to Payment: ₹${amount}`);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.title}>Event Registration</h2>

      <input name="name" placeholder="Full Name" onChange={handleChange} required />
      <input name="mobile" placeholder="Mobile Number" onChange={handleChange} required />
      <input name="email" placeholder="Email" onChange={handleChange} required />
      <input name="college" placeholder="College Name" onChange={handleChange} />
      <input name="dept" placeholder="Department" onChange={handleChange} />
      <select name="year" onChange={handleChange} required>
        <option value="">Select your year</option>
        <option value="I-year">I-year</option>
        <option value="II-year">II-year</option>
        <option value="III-year">III-year</option>
        <option value="IV-year">IV-year</option>
      </select>

      <select name="food" onChange={handleChange} required>
        <option value="">Food Preference</option>
        <option value="veg">Veg</option>
        <option value="nonveg">Non-Veg</option>
      </select>

      {/* Categories */}
      <div className={styles.section}>
        <p className={styles.label}>Select Categories</p>

        {["tech", "nontech", "workshop"].map((cat) => (
          <label key={cat} className={styles.checkbox}>
            <input
              type="checkbox"
              value={cat}
              onChange={handleCategoryChange}
            />
            {cat.toUpperCase()}
          </label>
        ))}
      </div>

      {/* Events */}
      {form.categories.map((category) => (
        <div key={category} className={styles.subEvents}>
          <p className={styles.subTitle}>{category.toUpperCase()} Events</p>

          {EVENT_MAP[category].map((event) => (
            <label key={event} className={styles.checkbox}>
              <input
                type="checkbox"
                onChange={() => handleEventSelect(category, event)}
              />
              {event}
            </label>
          ))}
        </div>
      ))}

      {/* Participation */}
      <select onChange={handleRole} required>
        <option value="">Participation Type</option>
        <option value="leader">Team Leader</option>
        <option value="member">Team Member</option>
      </select>

      {form.role === "leader" && (
        <p className={styles.code}>Team Code: {form.teamCode}</p>
      )}

      {form.role === "member" && (
        <input
          name="teamCode"
          placeholder="Enter Team Code"
          onChange={handleChange}
          required
        />
      )}

      {/* 💰 Amount */}
      <div className={styles.amountBox}>
        <p>Total Amount:</p>
        <h3>₹{amount}</h3>
      </div>

      <button className={styles.submit} disabled={amount === 0}>
        Proceed to Pay ₹{amount}
      </button>
    </form>
  );
};

export default RegistrationForm;
