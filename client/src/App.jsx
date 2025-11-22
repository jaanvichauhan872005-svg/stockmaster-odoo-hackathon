import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

// Import your pages here
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
    <BrowserRouter>

      <div className="p-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/receipts" element={<Receipts />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/deliveries" element={<Delivery />} />
          <Route path="/login" element={<Login />} />
          <Route path="/warehouse" element={<WarehousePage />} /> 
          <Route path="/location" element={<LocationContent />} />
          <Route path="/adjustment" element={<Adjustment />} />
          <Route path="/profile" element={<Profile />} />
          {/* <Route path="/operations" element={<Operations />} /> */}
          {/* <Route path="/stock" element={<Stock />} /> */}
          <Route path="/history" element={<MoveHistory />} />
          {/* <Route path="/settings" element={<Settings />} /> */}

          {/* Optional: fallback route */}
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
