const { initFirebaseAdmin } = require('../lib/firebaseAdmin');

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    const admin = initFirebaseAdmin();
    const decodedToken = await admin.auth().verifyIdToken(token, true);

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || null,
    };

    next();
  } catch (err) {
    console.error('Auth Error:', err);
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

module.exports = verifyToken;
