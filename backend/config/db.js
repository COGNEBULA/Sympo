const { Pool } = require("pg");
require("dotenv").config();
/**
 * Create main pool
 */
const db = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.on("connect",()=>{
    console.log("🚀 Postgres DB is connected")
})
db.on("error",(error)=>{
    console.error("❌ Postgres DB connection error",error)
})

module.exports = {
  query: (text, params) => db.query(text, params),
  db,
};