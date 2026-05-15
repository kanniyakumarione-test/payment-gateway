const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

router.use(verifyToken);

// List payouts for the merchant
router.get('/list', async (req, res) => {
  const supabase = req.app.get('supabase');
  const merchant_id = req.user.uid;

  try {
    const { data, error } = await supabase
      .from('payouts')
      .select('*')
      .eq('merchant_id', merchant_id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, payouts: data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Request a new payout
router.post('/request', async (req, res) => {
  const supabase = req.app.get('supabase');
  const merchant_id = req.user.uid;
  const { amount, bank_name, account_number } = req.body;

  try {
    const { data, error } = await supabase
      .from('payouts')
      .insert([{ 
        amount, 
        bank_name, 
        account_number, 
        merchant_id, 
        status: 'Pending' 
      }])
      .select();

    if (error) throw error;
    res.json({ success: true, payout: data[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update payout status (ADMIN ONLY)
router.patch('/status/:id', async (req, res) => {
  const supabase = req.app.get('supabase');
  const { id } = req.params;
  const { status } = req.body;

  try {
    const { data, error } = await supabase
      .from('payouts')
      .update({ status })
      .eq('id', id)
      .select();

    if (error) throw error;
    res.json({ success: true, payout: data[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
