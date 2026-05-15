const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

router.use(verifyToken);

// List customers for the merchant (Aggregated from transactions)
router.get('/list', async (req, res) => {
  const supabase = req.app.get('supabase');
  const merchant_id = req.user.uid;

  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('customer_email, amount, created_at')
      .eq('merchant_id', merchant_id);

    if (error) throw error;

    // Group by email to find unique customers
    const customersMap = data.reduce((acc, curr) => {
      if (!acc[curr.customer_email]) {
        acc[curr.customer_email] = { 
          email: curr.customer_email, 
          totalSpent: 0, 
          transactions: 0,
          joined: curr.created_at
        };
      }
      acc[curr.customer_email].totalSpent += curr.amount;
      acc[curr.customer_email].transactions += 1;
      return acc;
    }, {});

    res.json({ success: true, customers: Object.values(customersMap) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
