-- VoteX Database Schema
-- Run this file against your PostgreSQL database to create the schema

-- Users table: stores registered accounts
CREATE TABLE IF NOT EXISTS users (
  id        SERIAL PRIMARY KEY,
  name      VARCHAR(50) NOT NULL,
  email     VARCHAR(255) UNIQUE NOT NULL,
  password  TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Polls table: each poll belongs to a creator
CREATE TABLE IF NOT EXISTS polls (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(500) NOT NULL,
  created_by  INTEGER REFERENCES users(id) ON DELETE CASCADE,
  anonymous   BOOLEAN DEFAULT FALSE,          -- anonymous voting toggle
  expires_at  TIMESTAMPTZ,                    -- NULL = no expiry
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Options table: each option belongs to a poll
CREATE TABLE IF NOT EXISTS options (
  id       SERIAL PRIMARY KEY,
  poll_id  INTEGER REFERENCES polls(id) ON DELETE CASCADE,
  text     VARCHAR(500) NOT NULL
);

-- Votes table: each user may vote ONCE per poll (enforced by UNIQUE constraint)
CREATE TABLE IF NOT EXISTS votes (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
  poll_id    INTEGER REFERENCES polls(id) ON DELETE CASCADE,
  option_id  INTEGER REFERENCES options(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, poll_id)   -- prevents duplicate votes
);
