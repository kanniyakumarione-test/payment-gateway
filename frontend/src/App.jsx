import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardOverview from './pages/Overview';
import Transactions from './pages/Transactions';
import Payouts from './pages/Payouts';
import Customers from './pages/Customers';
import Settings from './pages/Settings';
import DevDocs from './pages/DevDocs';
import Checkout from './pages/Checkout';
import AdminPanel from './pages/AdminPanel';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/pay" element={<Checkout />} />
      
      {/* Dashboard Protected Routes (Mock) */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardOverview />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="payouts" element={<Payouts />} />
        <Route path="customers" element={<Customers />} />
        <Route path="settings" element={<Settings />} />
        <Route path="admin" element={<AdminPanel />} />
        <Route path="docs" element={<DevDocs />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Catch All */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
