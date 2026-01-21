const { getClient } = require("../config/db");

async function getAdminAnalytics(date) {
  const client = await getClient();

  try {
    await client.query("BEGIN");

    /* =====================================================
       🏠 HOME ANALYTICS (registrations only)
    ===================================================== */

    const totalRegistrations = await client.query(`
      SELECT COUNT(*)::INT AS count
      FROM registrations
    `);

    const vegCount = await client.query(`
      SELECT COUNT(*)::INT AS count
      FROM registrations
      WHERE food = 'veg'
    `);

    const nonVegCount = await client.query(`
      SELECT COUNT(*)::INT AS count
      FROM registrations
      WHERE food = 'non-veg'
    `);

    const topColleges = await client.query(`
      SELECT college, COUNT(*)::INT AS count
      FROM registrations
      GROUP BY college
      ORDER BY count DESC
      LIMIT 5
    `);

    const yearWise = await client.query(`
      SELECT student_year, COUNT(*)::INT AS count
      FROM registrations
      GROUP BY student_year
      ORDER BY student_year
    `);

    /* =====================================================
       📍 ON-DAY ANALYTICS
    ===================================================== */

    const checkInCount = await client.query(`
      SELECT COUNT(*)::INT AS count
      FROM registrations
      WHERE checkin = true
    `);

    /* =====================================================
       🚫 BLACKLISTED PARTICIPANTS (registrations only)
    ===================================================== */

    const blacklistResult = await client.query(`
      SELECT
        id AS participant_id,
        name,
        phone AS mobile,
        college,
        student_year AS year,
        email
      FROM registrations
      WHERE blacklist = true
      ORDER BY name
    `);

    await client.query("COMMIT");
    /* =====================================================
       🎯 EVENTS & WORKSHOP ANALYTICS (registrations only)
    ===================================================== */

    const eventWorkshopCount = await client.query(`
      SELECT
       COUNT(*) FILTER (
      WHERE EXISTS (
        SELECT 1 FROM unnest(events) e
        WHERE e ILIKE '%workshop%'
      )
    )::INT AS workshop_count,

    COUNT(*) FILTER (
      WHERE NOT EXISTS (
        SELECT 1 FROM unnest(events) e
        WHERE e ILIKE '%workshop%'
      )
    )::INT AS event_count
  FROM registrations
`);

    /* =====================================================
       🔁 DATA TRANSFORMATION (UNCHANGED)
    ===================================================== */

    const totalFoodCount =
      Number(vegCount.rows[0].count) +
      Number(nonVegCount.rows[0].count);

    const yearWiseCount = {
      firstYear: 0,
      secondYear: 0,
      thirdYear: 0,
      fourthYear: 0
    };

    yearWise.rows.forEach(row => {
      if (row.student_year === 1) yearWiseCount.firstYear = row.count;
      if (row.student_year === 2) yearWiseCount.secondYear = row.count;
      if (row.student_year === 3) yearWiseCount.thirdYear = row.count;
      if (row.student_year === 4) yearWiseCount.fourthYear = row.count;
    });

    const formattedTopColleges = topColleges.rows.map(row => ({
      name: row.college,
      count: row.count
    }));


    /* =====================================================
       ✅ FINAL RESPONSE (LOGIC UNCHANGED)
    ===================================================== */

    return {
      home: {
        totalRegistrations: totalRegistrations.rows[0].count,
        totalFoodCount,
        vegCount: vegCount.rows[0].count,
        nonVegCount: nonVegCount.rows[0].count,
        topColleges: formattedTopColleges,
        yearWiseCount
      },

      events: {
        modeCounts: {
          events: eventWorkshopCount.rows[0].event_count,
          workshop: eventWorkshopCount.rows[0].workshop_count
        }
      },

      onDay: {
        checkInCount: checkInCount.rows[0].count
      }
    };

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { getAdminAnalytics };
