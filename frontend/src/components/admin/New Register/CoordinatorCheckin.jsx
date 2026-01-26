import React, { useState, useEffect } from "react";
import styles from "./CoordinatorCheckin.module.css";
import api from "../../../api/axios";
import Swal from "sweetalert2";

const symposiumDate = new Date("2026-01-07T00:00:00");

const CoordinatorCheckin = () => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState("overall"); // overall | blacklist
  const [totalRegistration, setTotalRegistration] = useState(0);
  const [totalCheckedIn, setTotalCheckedIn] = useState(0);

  const [confirmEnterId, setConfirmEnterId] = useState(null);

  const [isLocked, setIsLocked] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/get');
        console.log("API Response:", res.data);
        
        if (res.data.success && res.data.registrationData?.registrationData) {
          const transformedData = res.data.registrationData.registrationData.map((participant) => ({
            id: `COG-${participant.id}`,
            name: participant.name,
            events: Array.isArray(participant.events) ? participant.events : [participant.events],
            year: participant.student_year?.toString() || "",
            college: participant.college,
            mobile: participant.phone,
            email: participant.email,
            blacklist: participant.blacklist || false,
            entered: false,
            checkedIn: participant.checkin || false,
            secondaryMail: participant.second_email || "",
            registrationId: participant.id,
            teamname: participant.teamname
          }));
          
          setParticipants(transformedData);
        }
      } catch (error) {
        console.error("Error fetching the Registered participant Details", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [])

  useEffect(() => {
    const now = new Date();
    if (now >= symposiumDate) {
      setIsLocked(false);
    }
  }, []);

  useEffect(() => {
    setTotalRegistration(participants.length);
    setTotalCheckedIn(participants.filter(p => p.checkedIn).length);
  }, [participants]);

  const filteredParticipants = participants.filter((p) => {
    const keyword = searchTerm.toLowerCase();
    const idMatch = p.id.toLowerCase().includes(keyword) || p.id.split("-")[1]?.includes(keyword);
    const nameMatch = p.name.toLowerCase().includes(keyword);
    const mobileMatch = p.mobile.includes(keyword);
    const emailMatch = p.email.toLowerCase().includes(keyword);

    const baseMatch = idMatch || nameMatch || mobileMatch || emailMatch;

    if (!baseMatch) return false;

    if (filterMode === "blacklist") return p.blacklist;
    return true;
  });

  const handleCheckin = async (id) => {
    const participant = participants.find(p => p.id === id);
    const registrationId = participant?.registrationId;
    const secondaryMail = participant?.secondaryMail;

    setParticipants(prev =>
      prev.map(p =>
        p.id === id ? { ...p, checkedIn: true } : p
      )
    );

    try {
      if (!secondaryMail || secondaryMail.trim() === '') {
        // No secondary mail, just checkin
        await api.post('/checkin/coordinator', { registration_id: registrationId });
      } else {
        // Has secondary mail, update it first then checkin
        await api.post('/second_email/coordinator', { 
          registration_id: registrationId,
          second_email: secondaryMail 
        });
      }

      // Show success alert
      await Swal.fire({
        icon: 'success',
        title: 'Check-in Successful!',
        text: `${participant?.name} has been checked in.`,
        confirmButtonColor: '#22c55e',
        timer: 2000,
        showConfirmButton: false
      });

    } catch (error) {
      console.error("Error during checkin:", error);
      
      // Revert the state if the API call fails
      setParticipants(prev =>
        prev.map(p =>
          p.id === id ? { ...p, checkedIn: false } : p
        )
      );

      // Show error alert
      await Swal.fire({
        icon: 'error',
        title: 'Check-in Failed!',
        text: error.response?.data?.message || 'An error occurred during check-in. Please try again.',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  const handleEnterConfirm = () => {
    setParticipants(prev =>
      prev.map(p =>
        p.id === confirmEnterId ? { ...p, entered: true } : p
      )
    );

    const registrationId = participants.find(p => p.id === confirmEnterId)?.registrationId;
    fetch("http://localhost:5000/api/mark_entered", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ participantId: registrationId })
    });

    setConfirmEnterId(null);
  };

  const handleSecondaryMailChange = (id, value) => {
    setParticipants(prev =>
      prev.map(p =>
        p.id === id ? { ...p, secondaryMail: value } : p
      )
    );
  };

  return (
    <div className={styles.container}>
      
      {/* 🔥 TOP BAR */}
      <div className={styles.topRow}>
        
        {/* LEFT SIDE */}
        <div className={styles.leftControls}>
          <input
            type="text"
            placeholder="Search participant..."
            className={styles.searchBar}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className={styles.filterBox}>
            <label>
              <input
                type="radio"
                checked={filterMode === "overall"}
                onChange={() => setFilterMode("overall")}
              />
              Overall
            </label>

            <label>
              <input
                type="radio"
                checked={filterMode === "blacklist"}
                onChange={() => setFilterMode("blacklist")}
              />
              Blacklist
            </label>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className={styles.rightControls}>
          <div className={styles.countCard}>
            Total Registration: {totalRegistration}
          </div>

          <div
            className={styles.countCard}
            style={{ opacity: isLocked ? 0.4 : 1 }}
          >
            Total Checked In: {totalCheckedIn}
          </div>

          <button className={styles.newBtn} disabled={isLocked}>
            New Registration
          </button>
        </div>
      </div>


      {/* 🔥 TABLE */}
      <div className={styles.tableWrapper}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>PART ID</th>
              <th>NAME</th>
              <th>EVENTS</th>
              <th>YEAR</th>
              <th>COLLEGE</th>
              <th>MOBILE</th>
              <th>MAIL</th>
              <th>SECONDARY MAIL</th>
              <th>CHECK IN</th>
              {/* <th>ENTER</th> */}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="10" className={styles.loadingMessage}>
                  Loading participants...
                </td>
              </tr>
            ) : filteredParticipants.length === 0 ? (
              <tr>
                <td colSpan="10" className={styles.emptyMessage}>
                  No participants found
                </td>
              </tr>
            ) : (
              filteredParticipants.map((p) => (
                <tr
                  key={p.id}
                  className={p.entered ? styles.disabledRow : ""}
                >
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.events.join(", ")}</td>
                  <td>{p.year}</td>
                  <td>{p.college}</td>
                  <td>{p.mobile}</td>
                  <td>{p.email}</td>
                  <td>
                    <input
                      type="text"
                      value={p.secondaryMail}
                      onChange={(e) => handleSecondaryMailChange(p.id, e.target.value)}
                      disabled={isLocked || p.entered || p.secondaryMail}
                      className={styles.secondaryMailInput}
                    />
                  </td>
                  <td>
                    <button
                      className={styles.checkinBtn}
                      disabled={isLocked || p.entered || p.checkedIn}
                      onClick={() => handleCheckin(p.id)}
                    >
                      Checkin
                    </button>
                  </td>
                  {/* <td>
                    <button
                      className={styles.entryBtn}
                      disabled={isLocked || p.entered}
                      onClick={() => setConfirmEnterId(p.id)}
                    >
                      ✔
                    </button>
                  </td> */}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>


      {/* 🔥 MODAL */}
      {confirmEnterId && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <p>Mark participant {confirmEnterId} as entered?</p>
            <button onClick={handleEnterConfirm}>OK</button>
            <button onClick={() => setConfirmEnterId(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoordinatorCheckin;
