import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  List, 
  LayoutGrid, 
  ClipboardList, 
  MoreHorizontal, 
  Calendar,
  MapPin,
  CheckCircle2,
  X,
  ChevronRight,
  Trash2,
  Save,
  AlertCircle
} from 'lucide-react';
import Navbar from '../components/Navbar';

const Adjustment = () => {
  // --- Configuration ---
  const WAREHOUSE_ID = "WH";
  const OPERATION_TYPE = "ADJ"; // ADJ for Adjustment
  const CURRENT_USER = "Admin User";

  // --- State ---
  const [view, setView] = useState('list'); 
  const [searchTerm, setSearchTerm] = useState('');

  // Mock Data
  const [adjustments, setAdjustments] = useState([
    { 
      id: 1, 
      reference: "WH/ADJ/0001", 
      location: "WH/Stock1", 
      date: "2023-10-30", 
      status: "Done", 
      responsible: "Admin User",
      items: [
        { product: "[DESK001] Desk", theoretical: 10, counted: 9 } // Missing 1
      ] 
    },
    { 
      id: 2, 
      reference: "WH/ADJ/0002", 
      location: "WH/Stock2", 
      date: "2023-11-05", 
      status: "In Progress", 
      responsible: "Admin User",
      items: [
        { product: "Chair", theoretical: 50, counted: 50 }, // Match
        { product: "Lamp", theoretical: 20, counted: 22 }   // Extra 2
      ] 
    }
  ]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAdj, setCurrentAdj] = useState(null);
  const [isEditingRef, setIsEditingRef] = useState(false);

  // --- Helpers ---

  const generateReference = (id) => {
    const paddedId = String(id).padStart(4, '0');
    return `${WAREHOUSE_ID}/${OPERATION_TYPE}/${paddedId}`;
  };

  const filteredAdjustments = adjustments.filter(item => {
    const ref = item.reference.toLowerCase();
    const loc = item.location.toLowerCase();
    const query = searchTerm.toLowerCase();
    return ref.includes(query) || loc.includes(query);
  });

  // --- Actions ---

  const openNewAdjModal = () => {
    const newId = adjustments.length > 0 ? Math.max(...adjustments.map(a => a.id)) + 1 : 1;
    setCurrentAdj({
      id: newId,
      reference: generateReference(newId),
      isNew: true,
      location: "WH/Stock1",
      date: new Date().toISOString().split('T')[0],
      status: "Draft",
      responsible: CURRENT_USER,
      items: []
    });
    setIsModalOpen(true);
  };

  const openEditAdjModal = (adj) => {
    setCurrentAdj({ ...adj, isNew: false });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (currentAdj.isNew) {
      setAdjustments([currentAdj, ...adjustments]);
    } else {
      setAdjustments(adjustments.map(a => a.id === currentAdj.id ? currentAdj : a));
    }
    setIsModalOpen(false);
  };

  const handleStatusChange = (newStatus) => {
    setCurrentAdj({ ...currentAdj, status: newStatus });
  };

  // Product Line Logic
  const addProductLine = () => {
    setCurrentAdj({
      ...currentAdj,
      items: [...currentAdj.items, { product: "", theoretical: 0, counted: 0 }]
    });
  };

  const updateProductLine = (index, field, value) => {
    const newItems = [...currentAdj.items];
    newItems[index][field] = value;
    setCurrentAdj({ ...currentAdj, items: newItems });
  };

  const removeProductLine = (index) => {
    const newItems = currentAdj.items.filter((_, i) => i !== index);
    setCurrentAdj({ ...currentAdj, items: newItems });
  };

  // --- Renderers ---

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Done': return 'bg-green-100 text-green-700 border-green-200';
      case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Draft': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getDiffColor = (theo, counted) => {
      const diff = counted - theo;
      if (diff > 0) return 'text-green-600 font-bold'; // Gain
      if (diff < 0) return 'text-red-600 font-bold';   // Loss
      return 'text-gray-400'; // No change
  };

  const KanbanCard = ({ item }) => (
    <div 
      onClick={() => openEditAdjModal(item)}
      className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer border-l-4 ${item.status === 'Done' ? 'border-l-green-500' : item.status === 'In Progress' ? 'border-l-blue-500' : 'border-l-gray-400'}`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="font-bold text-gray-800 text-sm">{item.reference}</span>
        <MoreHorizontal className="w-4 h-4 text-gray-400" />
      </div>
      <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
         <MapPin className="w-3 h-3" /> {item.location}
      </div>
      <div className="text-xs text-gray-400">
         {item.items.length} Products Checked
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <ClipboardList className="w-6 h-6 text-blue-600" />
              Inventory Adjustments
            </h2>
            <p className="text-gray-500 text-sm mt-1">Perform physical counts and adjust stock levels.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button 
              onClick={openNewAdjModal}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium rounded-lg shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Adjustment</span>
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative group flex-1 sm:w-64">
                <input 
                  type="text" 
                  placeholder="Search Reference, Location..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all shadow-sm"
                />
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>

              <div className="flex items-center bg-white border border-gray-300 rounded-lg p-1 shadow-sm">
                <button 
                  onClick={() => setView('list')}
                  className={`p-1.5 rounded-md transition-all ${view === 'list' ? 'bg-gray-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setView('kanban')}
                  className={`p-1.5 rounded-md transition-all ${view === 'kanban' ? 'bg-gray-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {view === 'list' ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-fade-in">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsible</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAdjustments.length > 0 ? (
                    filteredAdjustments.map((item) => (
                      <tr key={item.id} onClick={() => openEditAdjModal(item)} className="hover:bg-blue-50 transition-colors cursor-pointer group">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {item.reference}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.location}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">{item.responsible}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date || '--'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusStyles(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-gray-400 text-sm">
                        No adjustments found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
            <div className="flex flex-col gap-3">
                <h3 className="text-sm font-bold text-gray-500 uppercase">Draft</h3>
                {filteredAdjustments.filter(i => i.status === 'Draft').map(item => <KanbanCard key={item.id} item={item} />)}
            </div>
            <div className="flex flex-col gap-3">
                <h3 className="text-sm font-bold text-blue-600 uppercase">In Progress</h3>
                {filteredAdjustments.filter(i => i.status === 'In Progress').map(item => <KanbanCard key={item.id} item={item} />)}
            </div>
            <div className="flex flex-col gap-3">
                <h3 className="text-sm font-bold text-green-600 uppercase">Done</h3>
                {filteredAdjustments.filter(i => i.status === 'Done').map(item => <KanbanCard key={item.id} item={item} />)}
            </div>
          </div>
        )}
      </main>

      {/* ================================================================== */}
      {/* ADJUSTMENT MODAL */}
      {/* ================================================================== */}
      {isModalOpen && currentAdj && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden">
            
            {/* 1. Modal Top Bar */}
            <div className="px-6 py-4 border-b border-gray-200 bg-white flex justify-between items-center">
               <div className="flex items-center gap-4">
                   {currentAdj.isNew && (
                        <span className="border border-gray-300 text-gray-700 px-3 py-0.5 rounded text-sm font-medium shadow-sm">New</span>
                   )}
                   <h2 className="text-2xl font-normal text-gray-800">Inventory Adjustment</h2>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500">
                  <X className="w-6 h-6" />
               </button>
            </div>

            {/* 2. Action Bar */}
            <div className="px-6 py-4 border-b border-gray-200 bg-white flex flex-col sm:flex-row justify-between items-center gap-4">
               <div className="flex items-center gap-2 w-full sm:w-auto">
                    {currentAdj.status === 'In Progress' && (
                        <button 
                            onClick={() => handleStatusChange('Done')}
                            className="px-4 py-1.5 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-md text-sm font-medium transition"
                        >
                            Validate Inventory
                        </button>
                    )}
                    {currentAdj.status === 'Draft' && (
                        <button 
                            onClick={() => handleStatusChange('In Progress')}
                            className="px-4 py-1.5 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-md text-sm font-medium transition"
                        >
                            Start Inventory
                        </button>
                    )}
                    <button 
                         onClick={handleSave}
                         className="px-4 py-1.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md text-sm font-medium transition"
                    >
                        Save
                    </button>
                    <button 
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-1.5 border border-gray-300 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md text-sm font-medium transition"
                    >
                        Cancel
                    </button>
               </div>

               {/* Status Pipeline */}
               <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
                  {['Draft', 'In Progress', 'Done'].map((step, index, arr) => {
                      const isActive = currentAdj.status === step;
                      return (
                          <button 
                            key={step}
                            onClick={() => handleStatusChange(step)}
                            className={`
                                px-4 py-1 text-sm font-medium transition-colors flex items-center
                                ${isActive ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}
                                ${index !== arr.length - 1 ? 'border-r border-gray-300' : ''}
                            `}
                          >
                              {step}
                              {index !== arr.length - 1 && <ChevronRight className="w-3 h-3 ml-2 opacity-50" />}
                          </button>
                      );
                  })}
               </div>
            </div>

            {/* 3. Form Body */}
            <div className="p-8 overflow-y-auto flex-1 bg-white">
               
               {/* Reference ID */}
               <div className="mb-8">
                   <h1 className="text-3xl text-gray-700 font-medium tracking-tight">
                       {currentAdj.reference}
                   </h1>
               </div>

               {/* Form Fields */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                   <div className="group">
                       <label className="block text-sm font-medium text-gray-500 mb-1">Location</label>
                       <input 
                            type="text"
                            value={currentAdj.location}
                            onChange={(e) => setCurrentAdj({...currentAdj, location: e.target.value})}
                            className="w-full border-b border-gray-300 focus:border-blue-600 outline-none py-1 text-gray-800 bg-transparent transition-colors font-medium"
                            placeholder="e.g. WH/Stock"
                       />
                   </div>
                   
                   <div className="group">
                       <label className="block text-sm font-medium text-gray-500 mb-1">Responsible</label>
                       <input 
                            type="text"
                            value={currentAdj.responsible}
                            readOnly
                            className="w-full border-b border-gray-300 outline-none py-1 text-gray-600 bg-transparent transition-colors"
                       />
                   </div>

                   <div className="group">
                       <label className="block text-sm font-medium text-gray-500 mb-1">Accounting Date</label>
                       <input 
                            type="date"
                            value={currentAdj.date}
                            onChange={(e) => setCurrentAdj({...currentAdj, date: e.target.value})}
                            className="w-full border-b border-gray-300 focus:border-blue-600 outline-none py-1 text-gray-800 bg-transparent transition-colors"
                       />
                   </div>
               </div>

               {/* Inventory Table */}
               <div className="mt-8">
                   <div className="border-b border-gray-200 mb-4 flex justify-between items-center">
                       <button className="text-sm font-medium text-gray-800 border-b-2 border-gray-800 pb-2 px-1">
                           Inventory Lines
                       </button>
                   </div>

                   <table className="min-w-full">
                       <thead>
                           <tr>
                               <th className="text-left text-sm font-medium text-gray-500 pb-2 border-b border-gray-200 w-1/2">Product</th>
                               <th className="text-right text-sm font-medium text-gray-500 pb-2 border-b border-gray-200 w-1/6">Theoretical</th>
                               <th className="text-right text-sm font-medium text-gray-500 pb-2 border-b border-gray-200 w-1/6">Counted</th>
                               <th className="text-right text-sm font-medium text-gray-500 pb-2 border-b border-gray-200 w-1/6">Difference</th>
                               <th className="w-10 border-b border-gray-200"></th>
                           </tr>
                       </thead>
                       <tbody>
                           {currentAdj.items.map((item, index) => (
                               <tr key={index} className="group">
                                   <td className="py-2 border-b border-gray-100">
                                       <input 
                                            type="text"
                                            value={item.product}
                                            onChange={(e) => updateProductLine(index, 'product', e.target.value)}
                                            placeholder="e.g. [DESK001] Desk"
                                            className="w-full outline-none text-gray-800 placeholder-gray-300" 
                                       />
                                   </td>
                                   {/* Theoretical (Read-only typically, but editable for mock) */}
                                   <td className="py-2 border-b border-gray-100 text-right">
                                        <input 
                                            type="number"
                                            value={item.theoretical}
                                            onChange={(e) => updateProductLine(index, 'theoretical', parseFloat(e.target.value))}
                                            className="w-20 text-right outline-none text-gray-500 bg-transparent" 
                                       />
                                   </td>
                                   {/* Counted (Editable) */}
                                   <td className="py-2 border-b border-gray-100 text-right">
                                        <input 
                                            type="number"
                                            value={item.counted}
                                            onChange={(e) => updateProductLine(index, 'counted', parseFloat(e.target.value))}
                                            className="w-20 text-right outline-none text-gray-800 border-b border-gray-300 focus:border-blue-500 bg-gray-50" 
                                       />
                                   </td>
                                   {/* Difference (Calculated) */}
                                   <td className={`py-2 border-b border-gray-100 text-right text-sm ${getDiffColor(item.theoretical, item.counted)}`}>
                                       {(item.counted - item.theoretical) > 0 ? '+' : ''}{item.counted - item.theoretical}
                                   </td>
                                   
                                   <td className="py-2 border-b border-gray-100 text-right">
                                       <button onClick={() => removeProductLine(index)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity">
                                           <Trash2 className="w-4 h-4" />
                                       </button>
                                   </td>
                               </tr>
                           ))}
                           
                           <tr>
                               <td colSpan="5" className="py-3">
                                   <button 
                                        onClick={addProductLine}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                                   >
                                       <Plus className="w-4 h-4" /> Add an item
                                   </button>
                               </td>
                           </tr>
                       </tbody>
                   </table>
               </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Adjustment;