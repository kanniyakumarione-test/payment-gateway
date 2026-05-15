const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

router.use(verifyToken);

// Get aggregated stats for the dashboard
router.get('/overview', async (req, res) => {
  const supabase = req.app.get('supabase');
  const merchant_id = req.user.uid;

  try {
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('merchant_id', merchant_id);

    if (error) throw error;

    // Aggregate data
    const totalRevenue = transactions
      .filter(t => t.status === 'Success')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalTransactions = transactions.length;
    const successRate = totalTransactions > 0 
      ? (transactions.filter(t => t.status === 'Success').length / totalTransactions * 100).toFixed(1)
      : 0;

    // Monthly data for charts (Mocking a bit for now to show variety)
    const chartData = [
      { name: 'Mon', revenue: 4000 },
      { name: 'Tue', revenue: 3000 },
      { name: 'Wed', revenue: 5000 },
      { name: 'Thu', revenue: 2780 },
      { name: 'Fri', revenue: 6890 },
      { name: 'Sat', revenue: 2390 },
      { name: 'Sun', revenue: totalRevenue / 10 }, // Use some real data influence
    ];

    res.json({
      success: true,
      stats: {
        totalRevenue: `₹${totalRevenue.toLocaleString()}`,
        totalTransactions: totalTransactions.toLocaleString(),
        successRate: `${successRate}%`,
        activeCustomers: '1,240' // Mock for now
      },
      chartData
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
