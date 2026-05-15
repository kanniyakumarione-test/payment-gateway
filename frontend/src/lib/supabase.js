import { createClient } from '@supabase/supabase-js';

// These should be moved to .env
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper functions for common operations
export const fetchTransactions = async (merchantId) => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('merchant_id', merchantId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const createTransaction = async (transactionData) => {
  const { data, error } = await supabase
    .from('transactions')
    .insert([transactionData]);
  
  if (error) throw error;
  return data;
};
