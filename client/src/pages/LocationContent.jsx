import React, { useState } from 'react';
import { 
  MapPin, 
  Save, 
  X, 
  ChevronRight, 
  Box, 
  Layout, 
  ArrowRight,
  Trash2,
  ChevronUp,
  ChevronDown,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const LocationContent = () => {
  const CURRENT_USER = "Admin User";

  const [availableWarehouses] = useState([
    { id: 1, name: "San Francisco HQ", code: "WH" },
    { id: 2, name: "East Coast Hub", code: "WH-East" },
  ]);

  const [locations, setLocations] = useState([
    { id: 1, name: "Stock 1", code: "WH/Stock1", warehouse: "WH", type: "Internal" },
    { id: 2, name: "Stock 2", code: "WH/Stock2", warehouse: "WH", type: "Internal" },
    { id: 3, name: "Shelf A", code: "WH/Stock1/ShelfA", warehouse: "WH", type: "View" },
  ]);

  const [form, setForm] = useState({
    name: '',
    shortCode: '',
    warehouse: 'WH',
    type: 'Internal'
  });

  const handleSave = (e) => {
    e.preventDefault();
    const newLocation = {
      id: locations.length + 1,
      name: form.name,
      code: `${form.warehouse}/${form.shortCode || form.name}`,
      warehouse: form.warehouse,
      type: form.type
    };
    setLocations([...locations, newLocation]);
    setForm({ name: '', shortCode: '', warehouse: 'WH', type: 'Internal' });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this location?")) {
      setLocations(locations.filter(loc => loc.id !== id));
    }
  };

  const handleMove = (index, direction) => {
    const newLocations = [...locations];
    if (direction === 'up' && index > 0) {
      [newLocations[index], newLocations[index - 1]] = [newLocations[index - 1], newLocations[index]];
    }
    if (direction === 'down' && index < newLocations.length - 1) {
      [newLocations[index], newLocations[index + 1]] = [newLocations[index + 1], newLocations[index]];
    }
    setLocations(newLocations);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-blue-600" />
              Location Settings
            </h2>
            <p className="text-gray-500 text-sm mt-1">Manage warehouse zones, rooms, and shelves.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Form */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-white flex justify-between items-center">
               <h3 className="text-lg font-semibold text-gray-800">Add New Location</h3>
            </div>

            <div className="p-8">
              <form onSubmit={handleSave} className="space-y-8">

                {/* Location Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1 uppercase">Location Name</label>
                  <input 
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    className="w-full text-lg border-b-2 border-gray-300 focus:border-blue-600 outline-none py-2 bg-transparent"
                    placeholder="e.g. Spare Parts Room"
                  />
                </div>

                {/* Short Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1 uppercase">Short Code</label>
                  <input 
                    type="text"
                    value={form.shortCode}
                    onChange={(e) => setForm({...form, shortCode: e.target.value})}
                    className="w-full text-lg border-b-2 border-gray-300 focus:border-blue-600 outline-none py-2 bg-transparent"
                    placeholder="e.g. dp2510"
                  />
                </div>

                {/* Warehouse Select */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-500 uppercase">Parent Warehouse</label>
                    <Link to="/warehouse" className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1">
                      Manage Warehouses <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>

                  <div className="flex items-center gap-2 border-b-2 border-gray-300">
                    <Box className="w-5 h-5 text-gray-400" />
                    <select 
                      value={form.warehouse}
                      onChange={(e) => setForm({...form, warehouse: e.target.value})}
                      className="w-full text-lg outline-none py-2 bg-transparent cursor-pointer"
                    >
                      {availableWarehouses.map(wh => (
                        <option key={wh.id} value={wh.code}>
                          {wh.name} ({wh.code})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>

                  <p className="text-xs text-gray-400 mt-2">
                    Select the physical building this location belongs to.
                  </p>
                </div>

                {/* Buttons */}
                <div className="pt-4 flex gap-3">
                  <button 
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg shadow-md"
                  >
                    <Save className="w-4 h-4" />
                    Save Location
                  </button>

                  <button 
                    type="button"
                    onClick={() => setForm({ name: '', shortCode: '', warehouse: 'WH', type: 'Internal' })}
                    className="flex items-center gap-2 px-6 py-2.5 border border-gray-300 hover:bg-gray-50 text-sm rounded-lg"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>

              </form>
            </div>
          </div>

          {/* Right List */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">

            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-sm font-bold text-gray-700 uppercase">Current Hierarchy</h3>
            </div>

            <div className="p-4 flex-1 overflow-y-auto max-h-[500px]">
              {locations.length > 0 ? (
                <div className="space-y-3">

                  {locations.map((loc, index) => (
                    <div key={loc.id} className="group flex items-center justify-between p-3 border rounded-lg hover:bg-blue-50 transition">
                      <div>
                        <span className="text-sm font-semibold flex items-center gap-2">
                          <Layout className="w-4 h-4 text-gray-400" />
                          {loc.name}
                        </span>
                        <span className="text-xs text-gray-500 pl-6 font-mono">{loc.code}</span>
                      </div>

                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">

                        {/* Move Up */}
                        <div className="flex flex-col">
                          <button 
                            disabled={index === 0}
                            onClick={() => handleMove(index, 'up')}
                            className="text-gray-400 hover:text-blue-600 disabled:opacity-20"
                          >
                            <ChevronUp className="w-3 h-3" />
                          </button>

                          {/* Move Down */}
                          <button 
                            disabled={index === locations.length - 1}
                            onClick={() => handleMove(index, 'down')}
                            className="text-gray-400 hover:text-blue-600 disabled:opacity-20"
                          >
                            <ChevronDown className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Delete */}
                        <button 
                          onClick={() => handleDelete(loc.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                      </div>
                    </div>
                  ))}

                </div>
              ) : (
                <div className="text-center py-8 text-gray-400 text-sm">
                  No locations defined yet.
                </div>
              )}
            </div>

            <div className="bg-gray-50 p-4 border-t text-xs text-gray-500">
              Tip: Use arrows to reorder priority.
            </div>

          </div>

        </div>
      </main>
    </div>
  );
};

export default LocationContent;   // <-- Correct export only
