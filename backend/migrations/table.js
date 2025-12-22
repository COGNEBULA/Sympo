const fs = require("fs");
const path = require("path");
const { db } = require("../config/db");

async function tablecreation() {
    const migrationsDir = __dirname;

  // Read all .sql files
  const files = fs
    .readdirSync(migrationsDir)
    .filter(file => file.endsWith(".sql"))
    .sort(); // IMPORTANT: 001, 002, 003 order

  console.log("📦 Running migrations...");
    
  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, "utf8");

    try {
      await db.query(sql);
      console.log(`✅ Executed: ${file}`);
    } catch (err) {
      console.error(`❌ Migration failed: ${file}`);
      throw err;
    }
  }

  console.log("🎉 All migrations completed");
}

module.exports = {tablecreation};
