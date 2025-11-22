import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import ProtectedLayout from "./components/ProtectedLayout";

import Dashboard from "./pages/dashboard";
import MoveHistory from "./pages/MoveHistory";
import Receipts from "./pages/Receipts";
import Stock from "./pages/Stocks";
import Delivery from "./pages/Delivery";
import Login from "./pages/Login";
import WarehousePage from "./pages/WarehousePage";
import LocationContent from "./pages/LocationContent";
import Adjustment from "./pages/Adjustment";
import Profile from "./pages/Profile";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedLayout>
                <Dashboard />
              </ProtectedLayout>
            }
          />

          <Route
            path="/receipts"
            element={
              <ProtectedLayout>
                <Receipts />
              </ProtectedLayout>
            }
          />

          <Route
            path="/stock"
            element={
              <ProtectedLayout>
                <Stock />
              </ProtectedLayout>
            }
          />

          <Route
            path="/deliveries"
            element={
              <ProtectedLayout>
                <Delivery />
              </ProtectedLayout>
            }
          />

          <Route
            path="/warehouse"
            element={
              <ProtectedLayout>
                <WarehousePage />
              </ProtectedLayout>
            }
          />

          <Route
            path="/location"
            element={
              <ProtectedLayout>
                <LocationContent />
              </ProtectedLayout>
            }
          />

          <Route
            path="/adjustment"
            element={
              <ProtectedLayout>
                <Adjustment />
              </ProtectedLayout>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedLayout>
                <Profile />
              </ProtectedLayout>
            }
          />

          <Route
            path="/history"
            element={
              <ProtectedLayout>
                <MoveHistory />
              </ProtectedLayout>
            }
          />
          <Route
            path="/*"
            element={
              <ProtectedLayout>
                <MoveHistory />
              </ProtectedLayout>
            }
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
