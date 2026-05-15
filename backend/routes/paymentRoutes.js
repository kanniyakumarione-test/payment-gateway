const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

// Update transaction status (Approve/Reject) - ADMIN ONLY
router.patch('/status/:id', verifyToken, async (req, res) => {
  const supabase = req.app.get('supabase');
  const { status } = req.body;
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('transactions')
      .update({ status })
      .eq('id', id)
      .select();

    if (error) throw error;
    res.json({ success: true, transaction: data[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// This route is PUBLIC because customers use it without logging in
router.post('/verify', async (req, res) => {
  const supabase = req.app.get('supabase');
  const { transactionId, utrNumber } = req.body;

  if (!transactionId || !utrNumber) {
    return res.status(400).json({ success: false, message: 'Transaction ID and UTR are required' });
  }

  try {
    const { data, error } = await supabase
      .from('transactions')
      .update({ 
        status: 'Pending Verification', 
        utr_number: utrNumber 
      })
      .eq('id', transactionId)
      .select();

    if (error) throw error;
    res.json({ success: true, message: 'Payment submitted for verification', transaction: data[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin routes (requires token)
router.use(verifyToken);

router.post('/create', async (req, res) => {
  const supabase = req.app.get('supabase');
  const merchant_id = req.user.uid;
  
  try {
    const { data, error } = await supabase
      .from('transactions')
      .insert([{ ...req.body, merchant_id, status: 'Awaiting Payment' }])
      .select();
    
    if (error) throw error;
    res.json({ success: true, transaction: data[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

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

router.delete('/:id', async (req, res) => {
  const supabase = req.app.get('supabase');
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ success: true, message: 'Transaction deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
