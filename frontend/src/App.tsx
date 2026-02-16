import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/AuthContext";

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

/* ================= PRIVATE ROUTE ================= */

function PrivateRoute() {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

/* ================= ADMIN ROUTE ================= */

function AdminRoute() {
  const { user } = useAuth();
  return user?.role === "ADMIN"
    ? <Outlet />
    : <Navigate to="/dashboard" replace />;
}

/* ================= APP ================= */

export default function App() {
  return (
    <AuthProvider>
      <Routes>

        {/* Default → redirect based on auth */}
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* ================= PROTECTED ERP AREA ================= */}
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>

            <Route path="/dashboard" element={<Dashboard />} />

            {/* Admin Only */}
            <Route element={<AdminRoute />}>
              <Route path="/users" element={<Users />} />
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

          </Route>
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />

      </Routes>
    </AuthProvider>
  );
}
