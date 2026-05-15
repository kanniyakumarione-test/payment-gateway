const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

// Middleware to ensure ONLY the super admin can access these routes
const verifySuperAdmin = (req, res, next) => {
  const superAdminEmail = 'kanniyakumarione@gmail.com';
  if (req.user.email !== superAdminEmail) {
    return res.status(403).json({ success: false, message: 'Access denied. Super Admin only.' });
  }
  next();
};

router.use(verifyToken);
router.use(verifySuperAdmin);

// Get ALL transactions across all merchants
router.get('/transactions', async (req, res) => {
  const supabase = req.app.get('supabase');
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*, merchant_id')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, transactions: data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Global Payout requests
router.get('/payouts', async (req, res) => {
  const supabase = req.app.get('supabase');
  try {
    const { data, error } = await supabase
      .from('payouts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, payouts: data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
