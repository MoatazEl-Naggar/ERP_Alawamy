import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import { Box, CircularProgress } from "@mui/material";

import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Suppliers from "./pages/Suppliers";
import Purchases from "./pages/Purchases";
import Receiving from "./pages/Receiving";
import Shipments from "./pages/Shipments";
import ContainerRegistration from "./pages/ContainerRegistration";
import Treasuries from "./pages/Treasuries";
import Expenses from "./pages/Expenses";
import Inventory from "./pages/Inventory";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import ItemsRegistration from "./pages/ItemsRegistration";
import ReceiptVouchers from "./pages/ReceiptVouchers";
import PaymentVouchers from "./pages/PaymentVouchers";
import VoucherReview from "./pages/VoucherReview";

/* ================= PRIVATE ROUTE ================= */
function PrivateRoute() {
  const { user, isLoading } = useAuth();

  // ✅ Show loading state while checking authentication
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // ✅ If no user, redirect to login (not to dashboard)
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

/* ================= ADMIN ROUTE ================= */
function AdminRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return user?.role === "ADMIN"
    ? <Outlet />
    : <Navigate to="/dashboard" replace />;
}

/* ================= APP ROUTES ================= */
function AppRoutes() {
  const { user, isLoading } = useAuth();

  // ✅ Show loading state while checking authentication
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Routes>
      {/* Login Page - accessible to everyone */}
      <Route path="/login" element={<Login />} />

      {/* Default Route - redirect based on auth status */}
      <Route
        path="/"
        element={
          user ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* ================= PROTECTED ERP AREA ================= */}
      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Admin Only */}
          <Route element={<AdminRoute />}>
            <Route path="/users" element={<Users />} />
            <Route path="/voucher-review" element={<VoucherReview />} />
          </Route>

          {/* Normal Pages */}
          <Route path="/customers" element={<Customers />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/container-registration" element={<ContainerRegistration />} />
          <Route path="/items-registration" element={<ItemsRegistration />} />
          <Route path="/purchases" element={<Purchases />} />
          <Route path="/receiving" element={<Receiving />} />
          <Route path="/shipments" element={<Shipments />} />
          <Route path="/treasuries" element={<Treasuries />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/receipt-vouchers" element={<ReceiptVouchers />} />
          <Route path="/payment-vouchers" element={<PaymentVouchers />} />
        </Route>
      </Route>

      {/* Catch all - redirect to login if not authenticated */}
      <Route
        path="*"
        element={
          user ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}

/* ================= APP WITH AUTH ================= */
export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}