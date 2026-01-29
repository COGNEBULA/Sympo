const { getClient } = require("../config/db");
const { AuthError } = require("../errors/error");

exports.loginUser = async (email, dob) => {
  const client = await getClient();

  const result = await client.query(
    `SELECT id, name, email, role
     FROM users
     WHERE email = $1 AND dob = $2`,
    [email, dob]
  );

  if (result.rowCount === 0) {
    throw new AuthError("Invalid credentials");
  }

  return result.rows[0];
};
