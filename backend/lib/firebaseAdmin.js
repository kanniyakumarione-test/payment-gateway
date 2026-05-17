const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

function getServiceAccountFromEnv() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  }

  if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    const fullPath = path.resolve(process.cwd(), process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
    const file = fs.readFileSync(fullPath, 'utf8');
    return JSON.parse(file);
  }

  return null;
}

function initFirebaseAdmin() {
  if (admin.apps.length) return admin;

  const serviceAccount = getServiceAccountFromEnv();
  if (!serviceAccount) {
    throw new Error(
      'Firebase Admin is not configured. Set FIREBASE_SERVICE_ACCOUNT_PATH or FIREBASE_SERVICE_ACCOUNT_JSON.'
    );
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  return admin;
}

module.exports = { initFirebaseAdmin };
