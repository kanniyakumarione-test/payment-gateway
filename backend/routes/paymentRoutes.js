const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

// Apply middleware to all routes
router.use(verifyToken);

// Create a new payment
router.post('/create', async (req, res) => {
  const supabase = req.app.get('supabase');
  
  try {
    const { amount, currency, method, customer_email, description } = req.body;
    const merchant_id = req.user.uid; // From Firebase Token

    // 1. Process payment (Mock logic for now)
    const status = Math.random() > 0.1 ? 'Success' : 'Failed';

    // 2. Save to Supabase
    const { data, error } = await supabase
      .from('transactions')
      .insert([
        { 
          merchant_id, 
          amount, 
          currency: currency || 'INR', 
          method, 
          customer_email, 
          description, 
          status 
        }
      ])
      .select();

    if (error) throw error;

    res.status(201).json({ success: true, transaction: data[0] });
  } catch (err) {
    console.error('Payment creation error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// List transactions for the authenticated merchant
router.get('/list', async (req, res) => {
  const supabase = req.app.get('supabase');
  const merchant_id = req.user.uid;

  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('merchant_id', merchant_id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ success: true, transactions: data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
