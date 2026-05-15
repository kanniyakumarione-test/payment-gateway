import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardOverview from './pages/DashboardOverview';
import Transactions from './pages/Transactions';
import Payouts from './pages/Payouts';
import Customers from './pages/Customers';
import DevDocs from './pages/DevDocs';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      
      {/* Dashboard Protected Routes (Mock) */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardOverview />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="payouts" element={<Payouts />} />
        <Route path="customers" element={<Customers />} />
        <Route path="docs" element={<DevDocs />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>

      {/* Redirect all unknown to landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
