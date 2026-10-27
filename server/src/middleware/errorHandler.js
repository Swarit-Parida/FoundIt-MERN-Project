export function notFound(req, res, next) { res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` }); }
export function errorHandler(err, req, res, next) {
  console.error(err.stack || err);
  if (err.name === 'ValidationError') return res.status(400).json({ message: Object.values(err.errors).map(e => e.message).join('. ') });
  if (err.code === 11000) return res.status(409).json({ message: 'A record with those details already exists.' });
  const status = err.statusCode || 500;
  res.status(status).json({ message: status === 500 && process.env.NODE_ENV === 'production' ? 'An unexpected server error occurred.' : (err.message || 'Server error') });
}
