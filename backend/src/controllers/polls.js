// Polls controller: CRUD, voting, and results
const pool = require('../config/db');

/**
 * GET /polls
 * Returns all polls with creator email and option count
 */
const getAllPolls = async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id,
        p.title,
        p.anonymous,
        p.expires_at,
        p.created_at,
        u.name AS created_by_name,
        u.email AS created_by_email,
        COUNT(DISTINCT o.id) AS option_count,
        COUNT(DISTINCT v.id) AS vote_count
      FROM polls p
      JOIN users u ON u.id = p.created_by
      LEFT JOIN options o ON o.poll_id = p.id
      LEFT JOIN votes v ON v.poll_id = p.id
      GROUP BY p.id, u.name, u.email
      ORDER BY p.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /polls
 * Body: { title, options: string[], expires_at?: ISO string, anonymous?: boolean }
 * Protected route — req.user is set by auth middleware
 */
const createPoll = async (req, res, next) => {
  const client = await pool.connect();
  try {
    const { title, options, expires_at, anonymous } = req.body;

    if (!title || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ error: 'Title and at least 2 options are required.' });
    }
    if (options.length > 10) {
      return res.status(400).json({ error: 'A poll may have at most 10 options.' });
    }

    await client.query('BEGIN');

    // Default 30-minute expiration if none provided
    const finalExpiresAt = expires_at 
      ? new Date(expires_at) 
      : new Date(Date.now() + 30 * 60 * 1000); // 30 mins from now

    // Insert the poll
    const pollResult = await client.query(
      `INSERT INTO polls (title, created_by, anonymous, expires_at)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [title.trim(), req.user.id, anonymous || false, finalExpiresAt]
    );
    const poll = pollResult.rows[0];

    // Insert options
    const insertedOptions = [];
    for (const text of options) {
      if (!text || !text.trim()) continue;
      const optResult = await client.query(
        'INSERT INTO options (poll_id, text) VALUES ($1, $2) RETURNING *',
        [poll.id, text.trim()]
      );
      insertedOptions.push(optResult.rows[0]);
    }

    await client.query('COMMIT');
    res.status(201).json({ ...poll, options: insertedOptions });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
};

/**
 * GET /polls/:id
 * Returns a single poll with its options and whether the current user voted
 */
const getPollById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const pollResult = await pool.query(
      `SELECT p.*, u.name AS created_by_name, u.email AS created_by_email
       FROM polls p
       JOIN users u ON u.id = p.created_by
       WHERE p.id = $1`,
      [id]
    );
    if (pollResult.rows.length === 0) {
      return res.status(404).json({ error: 'Poll not found.' });
    }
    const poll = pollResult.rows[0];

    // Get options
    const optionsResult = await pool.query(
      'SELECT * FROM options WHERE poll_id = $1 ORDER BY id',
      [id]
    );

    // Check if current user already voted
    const votedResult = await pool.query(
      'SELECT option_id FROM votes WHERE user_id = $1 AND poll_id = $2',
      [req.user.id, id]
    );
    const userVote = votedResult.rows[0] || null;

    res.json({
      ...poll,
      options: optionsResult.rows,
      userVote: userVote ? userVote.option_id : null,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /polls/:id/vote
 * Body: { option_id }
 * One vote per user per poll — enforced by DB UNIQUE constraint and backend check
 */
const voteOnPoll = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { option_id } = req.body;

    if (!option_id) {
      return res.status(400).json({ error: 'option_id is required.' });
    }

    // Verify poll exists and is not expired
    const pollResult = await pool.query('SELECT * FROM polls WHERE id = $1', [id]);
    if (pollResult.rows.length === 0) {
      return res.status(404).json({ error: 'Poll not found.' });
    }
    const poll = pollResult.rows[0];

    if (poll.expires_at && new Date(poll.expires_at) < new Date()) {
      return res.status(403).json({ error: 'This poll has expired and is no longer accepting votes.' });
    }

    // Verify the option belongs to the poll
    const optResult = await pool.query(
      'SELECT id FROM options WHERE id = $1 AND poll_id = $2',
      [option_id, id]
    );
    if (optResult.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid option for this poll.' });
    }

    // Backend duplicate-vote check (DB UNIQUE constraint is the final enforcement)
    const existingVote = await pool.query(
      'SELECT id FROM votes WHERE user_id = $1 AND poll_id = $2',
      [req.user.id, id]
    );
    if (existingVote.rows.length > 0) {
      return res.status(409).json({ error: 'You have already voted on this poll.' });
    }

    // Insert vote (DB UNIQUE constraint also protects against race conditions)
    await pool.query(
      'INSERT INTO votes (user_id, poll_id, option_id) VALUES ($1, $2, $3)',
      [req.user.id, id, option_id]
    );

    res.status(201).json({ message: 'Vote cast successfully.' });
  } catch (err) {
    next(err); // errorHandler handles code 23505 (unique violation)
  }
};

/**
 * GET /polls/:id/results
 * Returns vote counts and percentages per option
 */
const getPollResults = async (req, res, next) => {
  try {
    const { id } = req.params;

    const pollResult = await pool.query(
      `SELECT p.*, u.name AS created_by_name, u.email AS created_by_email
       FROM polls p JOIN users u ON u.id = p.created_by
       WHERE p.id = $1`,
      [id]
    );
    if (pollResult.rows.length === 0) {
      return res.status(404).json({ error: 'Poll not found.' });
    }
    const poll = pollResult.rows[0];

    // Get vote counts per option
    const resultsQuery = await pool.query(
      `SELECT
         o.id,
         o.text,
         COUNT(v.id)::int AS vote_count
       FROM options o
       LEFT JOIN votes v ON v.option_id = o.id
       WHERE o.poll_id = $1
       GROUP BY o.id
       ORDER BY o.id`,
      [id]
    );
    const options = resultsQuery.rows;
    const totalVotes = options.reduce((sum, o) => sum + o.vote_count, 0);

    // Attach percentage
    const optionsWithPercentage = options.map((o) => ({
      ...o,
      percentage: totalVotes > 0 ? Math.round((o.vote_count / totalVotes) * 100) : 0,
    }));

    res.json({ ...poll, options: optionsWithPercentage, totalVotes });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /polls/:id
 * Delete a poll if the user is the creator
 */
const deletePoll = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if the poll exists and user is owner
    const pollResult = await pool.query('SELECT created_by FROM polls WHERE id = $1', [id]);
    if (pollResult.rows.length === 0) {
      return res.status(404).json({ error: 'Poll not found.' });
    }
    
    if (pollResult.rows[0].created_by !== req.user.id) {
      return res.status(403).json({ error: 'You are not authorized to delete this poll.' });
    }
    
    // Delete poll (options and votes will be cascaded)
    await pool.query('DELETE FROM polls WHERE id = $1', [id]);
    
    res.json({ message: 'Poll deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllPolls, createPoll, getPollById, voteOnPoll, getPollResults, deletePoll };
