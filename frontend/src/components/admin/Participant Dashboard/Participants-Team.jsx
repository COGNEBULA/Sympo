import React, { useState, useEffect } from 'react';
import styles from './Participants.module.css';
import api from '../../../api/axios';
import Swal from 'sweetalert2';

const ParticipantsTeam = ({ participants, event }) => {
  const [isButtonEnabled, setButtonEnabled] = useState(false);
  const [buttonText, setButtonText] = useState('Send Certificates');
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [certificatesSent, setCertificatesSent] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [showModal, setShowModal] = useState(false);

  const [teamForm, setTeamForm] = useState({
    leaderId: '',
    teamName: '',
    member2: '',
    member3: '',
    member4: '',
    member5: ''
  });

  const [selectedIds, setSelectedIds] = useState([]);

  
  const participantsPerPage = 20;
  
  const normalizedParticipants = React.useMemo(() => {
    if (!participants) return [];
    
    return Object.entries(participants).map(([teamId, members]) => ({
      teamId,
      teamName: members[0]?.teamName ?? '-',
      members,
      leader: members[0], // optional
      memberCount: members.length
    }));
  }, [participants]);
    
  // useEffect(() => {
  //   if (normalizedParticipants?.length) {
  //     setSelectedIds(normalizedParticipants.members.map(p => p.registration_id));
  //   }
  // }, [normalizedParticipants]);

  useEffect(() => {
    const symposiumDate = new Date('2026-01-07T00:00:00');
    const now = new Date();
    if (now >= symposiumDate && !certificatesSent) {
      setButtonEnabled(true);
    }
  }, [certificatesSent]);

  const handleButtonClick = async () => {
    if (!isButtonEnabled || certificatesSent) return;

    if (!showCheckboxes) {
      setShowCheckboxes(true);
      setButtonText('Send');
    } else {
      const confirmSend = window.confirm(
        `Send certificates to ${selectedIds.length} participants?`
      );

      if (confirmSend) {
        await api.post('/certificates/coordinator', { registrationIds: selectedIds, eventName: event })
        setCertificatesSent(true);
        setButtonEnabled(false);
        setShowCheckboxes(false);
        setButtonText('Send Certificates');

        Swal.fire({
          icon: 'success',
          title: 'Certificates sent',
          text: `Sent to ${selectedIds.length} participant(s).`,
          timer: 1800,
          showConfirmButton: false
        });
          
      }
    }
  };

  const handleNewParticipantSubmit = async () => {
    const {
      leaderId,
      teamName,
      member2,
      member3,
      member4,
      member5
    } = teamForm;

    // Build participant_ids array (leader first)
    const participant_ids = [
      leaderId,
      member2,
      member3,
      member4,
      member5
    ]
      .map(id => Number(id))
      .filter(Boolean); 

    if (participant_ids.length === 0) {
      alert('At least a leader ID is required');
      return;
    }

    try {
      // Loop through each participant and register them individually
      for (let i = 0; i < participant_ids.length; i++) {
        const participantId = participant_ids[i];
        const response = await api.post(
          '/event/insert',
          {
            participant_ids: participantId.toString(), // endpoint expects string
            team_name: teamName || null
          }
        );

        if (!response.data.success) {
          throw new Error(`Failed to add participant ID: ${participantId}`);
        }
      }

      Swal.fire({
        icon: 'success',
        title: 'Team added',
        text: `Added ${participant_ids.length} member(s).`,
        timer: 1700,
        showConfirmButton: false
      });
  
      setShowModal(false);
      setTeamForm({
        leaderId: '',
        teamName: '',
        member2: '',
        member3: '',
        member4: '',
        member5: ''
      });
    } catch (err) {
      console.log(err);
      
      alert(err.message || 'Failed to add team');
    }
  };

  const toggleSelection = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const filteredParticipants = normalizedParticipants.filter(part =>
    part.members.filter(part => 
      part.registration_id.toString().includes(searchTerm) ||
      part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (part.teamName ?? '').toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const dataToDisplay = searchTerm ? filteredParticipants : normalizedParticipants;

  const indexOfLast = currentPage * participantsPerPage;
  const indexOfFirst = indexOfLast - participantsPerPage;
  const currentParticipants = dataToDisplay.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(dataToDisplay.length / participantsPerPage);

  // Flatten the current participants and group by team
  const flattenedWithTeamInfo = currentParticipants.flatMap(team =>
    team.members.map((member, idx) => ({
      ...member,
      teamId: team.teamId,
      isFirstMemberOfTeam: idx === 0,
      memberCountInTeam: team.members.length
    }))
  );

  return (
    <div className={styles.container}>
      <div className={showModal ? styles.blurBackground : ''}>
        <h2>Participants</h2>

        <div className={styles.topBar}>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchBox}
          />

          <div className={styles.buttonGroup}>
            <button onClick={handleButtonClick} disabled={!isButtonEnabled || certificatesSent} className={styles.button}>
              {buttonText}
            </button>

            <button className={`${styles.button} ${styles.newParticipantBtn}`} onClick={() => setShowModal(true)}>
              New Team
            </button>
          </div>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              {showCheckboxes && <th>Select</th>}
              <th>ID</th>
              <th>Name</th>
              <th>Mobile</th>
              <th>Team Name</th>
              <th>Email</th>
              <th>College</th>
              <th>Year</th>
            </tr>
          </thead>
          <tbody>
            {flattenedWithTeamInfo.map((member, idx) => (
              <tr key={member.registration_id} className={member.isFirstMemberOfTeam ? styles.teamGroupStart : styles.teamGroupContinue}>
                {showCheckboxes && (
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(member.registration_id)}
                      onChange={() => toggleSelection(member.registration_id)}
                    />
                  </td>
                )}
                <td>{member.registration_id}</td>
                <td>{member.name}</td>
                <td>{member.mobile}</td>
                {member.isFirstMemberOfTeam && (
                  <td rowSpan={member.memberCountInTeam} className={styles.teamNameCell}>
                    {member.teamName}
                  </td>
                )}
                <td>{member.email}</td>
                <td>{member.college}</td>
                <td>{member.year}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {!searchTerm && totalPages > 1 && (
          <div className={styles.pagination}>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setCurrentPage(i + 1)}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <h3>Add Team</h3>

            <input placeholder="Team Leader ID" value={teamForm.leaderId} onChange={(e)=>setTeamForm(p=>({...p,leaderId:e.target.value}))}/>
            <input placeholder="Team Name" value={teamForm.teamName} onChange={(e)=>setTeamForm(p=>({...p,teamName:e.target.value}))}/>
            <input placeholder="Team Member 2 ID" value={teamForm.member2} onChange={(e)=>setTeamForm(p=>({...p,member2:e.target.value}))}/>
            <input placeholder="Team Member 3 ID" value={teamForm.member3} onChange={(e)=>setTeamForm(p=>({...p,member3:e.target.value}))}/>
            <input placeholder="Team Member 4 ID" value={teamForm.member4} onChange={(e)=>setTeamForm(p=>({...p,member4:e.target.value}))}/>
            <input placeholder="Team Member 5 ID" value={teamForm.member5} onChange={(e)=>setTeamForm(p=>({...p,member5:e.target.value}))}/>

            <div className={styles.modalButtons}>
              <button onClick={handleNewParticipantSubmit}>Submit</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParticipantsTeam;
