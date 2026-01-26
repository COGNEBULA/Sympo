exports.buildReceiptData = async (row) => {
  return {
    participant: {
      name: row.name,
      email: row.email,
      second_email: row.second_email,
      college: row.college,
      student_year: row.student_year
    },
    events: row.events,
    food: row.food,
    transaction_id: row.transaction_id,
    receipt_id:`COG26-${row.id}`
  };
};
