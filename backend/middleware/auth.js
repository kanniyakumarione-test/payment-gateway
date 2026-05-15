const admin = require('firebase-admin');

// Initialize Firebase Admin (this requires a service account JSON)
// admin.initializeApp({
//   credential: admin.credential.cert(process.env.FIREBASE_SERVICE_ACCOUNT_PATH)
// });

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    // In a real scenario, we verify with Firebase
    // const decodedToken = await admin.auth().verifyIdToken(token);
    // req.user = decodedToken;
    
    // For now, we'll mock the verification to allow development
    req.user = { uid: 'mock_uid', email: 'merchant@aura.com' }; 
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

module.exports = verifyToken;
