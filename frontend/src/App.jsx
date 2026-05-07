import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/layout/AppShell.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Properties from "./pages/Properties.jsx";
import Register from "./pages/Register.jsx";
import Tenants from "./pages/Tenants.jsx";
import Lease from "./pages/tenant/Lease.jsx";
import Payments from "./pages/tenant/Payments.jsx";
import Maintenance from "./pages/tenant/Maintenance.jsx";
import Documents from "./pages/tenant/Documents.jsx";
import PropertyInfo from "./pages/tenant/PropertyInfo.jsx";
import Communication from "./pages/tenant/Communication.jsx";
import Settings from "./pages/tenant/Settings.jsx";

function AuthenticatedLayout() {
  const { user } = useAuth();
  
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* Landlord Only Routes */}
        {user?.role === "landlord" && (
          <>
            <Route path="properties" element={<Properties />} />
            <Route path="tenants" element={<Tenants />} />
            <Route path="finance" element={<div className="p-8">Finance Dashboard (Coming Soon)</div>} />
          </>
        )}

        {/* Common/Tenant Specific Routes */}
        <Route path="lease" element={user?.role === "tenant" ? <Lease /> : <Navigate to="/dashboard" />} />
        <Route path="payments" element={<Payments />} />
        <Route path="maintenance" element={<Maintenance />} />
        <Route path="documents" element={<Documents />} />
        <Route path="property-info" element={<PropertyInfo />} />
        <Route path="communication" element={<Communication />} />
        <Route path="settings" element={<Settings />} />
        
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
