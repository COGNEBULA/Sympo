CREATE TABLE IF NOT EXISTS registrations (
    id SERIAL PRIMARY KEY,

    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,

    college VARCHAR(150) NOT NULL,
    student_year INTEGER NOT NULL,

    events TEXT[] NOT NULL,   -- array of events
    teamname TEXT[] NOT NULL,
    food VARCHAR(50) NOT NULL,

    transaction_id BIGINT,

    screenshot_path TEXT UNIQUE NOT NULL,

    second_email VARCHAR(150) UNIQUE,

    checkin BOOLEAN DEFAULT FALSE,
    blacklist BOOLEAN DEFAULT FALSE
);