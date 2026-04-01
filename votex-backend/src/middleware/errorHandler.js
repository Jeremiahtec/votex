// Centralised error handler middleware
// Must have 4 parameters for Express to treat it as an error handler
const errorHandler = (err, req, res, next) => {
  console.error('[ERROR]', err.message || err);

  // PostgreSQL unique violation (duplicate vote)
  if (err.code === '23505') {
    return res.status(409).json({ error: 'You have already voted on this poll.' });
  }

  // PostgreSQL foreign key violation
  if (err.code === '23503') {
    return res.status(400).json({ error: 'Invalid reference. Please check your input.' });
  }

  const status = err.status || 500;
  const message = err.message || 'Internal server error.';
  res.status(status).json({ error: message });
};

module.exports = errorHandler;
