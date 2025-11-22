import React, { useState } from 'react';
import { 
  Warehouse, 
  MapPin, 
  Save, 
  X, 
  Trash2, 
  Edit2, 
  Building2,
  CheckCircle
} from 'lucide-react';
import Navbar from '../components/Navbar';

const WarehousePage = () => {
  // --- State ---
  const [warehouses, setWarehouses] = useState([
    { id: 1, name: "San Francisco HQ", code: "WH", address: "123 Market St, SF, CA" },
    { id: 2, name: "East Coast Hub", code: "WH-East", address: "456 Broadway, NY, NY" },
  ]);

  const [form, setForm] = useState({
    id: null,
    name: '',
    code: '',
    address: ''
  });

  const [isEditing, setIsEditing] = useState(false);

  // --- Handlers ---

  const handleSave = (e) => {
    e.preventDefault();
    
    if (isEditing) {
      // Update existing
      setWarehouses(warehouses.map(w => w.id === form.id ? form : w));
      setIsEditing(false);
    } else {
      // Create new
      const newWarehouse = {
        ...form,
        id: warehouses.length + 1
      };
      setWarehouses([...warehouses, newWarehouse]);
    }
    
    // Reset
    setForm({ id: null, name: '', code: '', address: '' });
  };

  const handleEdit = (warehouse) => {
    setForm(warehouse);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this warehouse?")) {
      setWarehouses(warehouses.filter(w => w.id !== id));
    }
  };

  const handleCancel = () => {
    setForm({ id: null, name: '', code: '', address: '' });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Warehouse className="w-6 h-6 text-blue-600" />
              Warehouse Configuration
            </h2>
            <p className="text-gray-500 text-sm mt-1">Manage your physical warehouse locations and addresses.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 1. Form Section (Left) */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            
            <div className="px-6 py-4 border-b border-gray-200 bg-white flex justify-between items-center">
               <h3 className="text-lg font-semibold text-gray-800">
                 {isEditing ? 'Edit Warehouse' : 'Create New Warehouse'}
               </h3>
            </div>

            <div className="p-8">
                <form onSubmit={handleSave} className="space-y-8">
                    
                    {/* Warehouse Name */}
                    <div className="group">
                        <label className="block text-sm font-medium text-gray-500 mb-1 uppercase tracking-wider">Warehouse Name</label>
                        <div className="flex items-center gap-2 border-b-2 border-gray-300 focus-within:border-blue-600 transition-colors">
                            <Building2 className="w-5 h-5 text-gray-400" />
                            <input 
                                type="text"
                                required
                                value={form.name}
                                onChange={(e) => setForm({...form, name: e.target.value})}
                                className="w-full text-lg outline-none py-2 text-gray-800 bg-transparent placeholder-gray-300"
                                placeholder="e.g. Main Distribution Center"
                            />
                        </div>
                    </div>

                    {/* Short Code */}
                    <div className="group">
                        <label className="block text-sm font-medium text-gray-500 mb-1 uppercase tracking-wider">Short Code</label>
                        <input 
                            type="text"
                            required
                            maxLength="10"
                            value={form.code}
                            onChange={(e) => setForm({...form, code: e.target.value.toUpperCase()})}
                            className="w-full text-lg border-b-2 border-gray-300 focus:border-blue-600 outline-none py-2 text-gray-800 bg-transparent transition-colors placeholder-gray-300 font-mono"
                            placeholder="e.g. WH-01"
                        />
                        <p className="text-xs text-gray-400 mt-2">Used for generating sequence numbers (e.g., WH-01/IN/0001).</p>
                    </div>

                    {/* Address */}
                    <div className="group">
                        <label className="block text-sm font-medium text-gray-500 mb-1 uppercase tracking-wider">Address</label>
                        <div className="flex items-center gap-2 border-b-2 border-gray-300 focus-within:border-blue-600 transition-colors">
                            <MapPin className="w-5 h-5 text-gray-400" />
                            <input 
                                type="text"
                                value={form.address}
                                onChange={(e) => setForm({...form, address: e.target.value})}
                                className="w-full text-lg outline-none py-2 text-gray-800 bg-transparent placeholder-gray-300"
                                placeholder="e.g. 123 Logistics Blvd, City"
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="pt-4 flex gap-3">
                        <button 
                            type="submit"
                            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-md transition-all transform active:scale-95"
                        >
                            <Save className="w-4 h-4" />
                            {isEditing ? 'Update Warehouse' : 'Save Warehouse'}
                        </button>
                        <button 
                            type="button"
                            onClick={handleCancel}
                            className="flex items-center gap-2 px-6 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                        >
                            <X className="w-4 h-4" />
                            Cancel
                        </button>
                    </div>

                </form>
            </div>
          </div>

          {/* 2. Existing List (Right) */}
          <div className="lg:col-span-1 flex flex-col gap-6">
             
             {/* Info Card */}
             <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 items-start">
                <div className="bg-blue-100 p-2 rounded-full">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-blue-800">Setup Tip</h4>
                    <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                        Create a warehouse for each physical location. Use the "Locations" page to define specific shelves or zones inside these warehouses.
                    </p>
                </div>
             </div>

             {/* List Card */}
             <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col flex-1">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Active Warehouses</h3>
                </div>
                
                <div className="p-4 flex-1 overflow-y-auto max-h-[600px]">
                    {warehouses.length > 0 ? (
                        <div className="space-y-3">
                            {warehouses.map((wh) => (
                                <div key={wh.id} className="group relative flex flex-col p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all bg-white">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-base font-bold text-gray-800">
                                            {wh.name}
                                        </span>
                                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded font-mono font-bold">
                                            {wh.code}
                                        </span>
                                    </div>
                                    
                                    <div className="text-sm text-gray-500 flex items-start gap-2">
                                        <MapPin className="w-4 h-4 mt-0.5 text-gray-400" />
                                        {wh.address || "No address provided"}
                                    </div>

                                    {/* Action Buttons (Visible on Hover) */}
                                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 bg-white pl-2">
                                        <button 
                                            onClick={() => handleEdit(wh)}
                                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(wh.id)}
                                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-400 text-sm">
                            <Warehouse className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            No warehouses found.
                        </div>
                    )}
                </div>
             </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default WarehousePage;