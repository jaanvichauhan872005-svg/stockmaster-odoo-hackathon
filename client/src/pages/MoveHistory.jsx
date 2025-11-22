import React, { useState } from 'react';
import { 
  Search, 
  List, 
  LayoutGrid, 
  History, 
  ArrowRight, 
  Calendar,
  Plus,
  X
} from 'lucide-react';
import Navbar from '../components/Navbar';

const MoveHistory = () => {
  // --- Configuration ---
  const CURRENT_USER = "Admin User";

  // --- State ---
  const [view, setView] = useState('list'); 
  const [searchTerm, setSearchTerm] = useState('');

  // Move Data (Mock)
  const [moves, setMoves] = useState([
    { 
      id: 1, 
      reference: "WH/IN/0001", 
      date: "2023-12-01", 
      contact: "Azure Interior", 
      from: "Vendor", 
      to: "WH/Stock1", 
      product: "[DESK001] Desk",
      quantity: 10,
      status: "Ready",
      type: "IN" 
    },
    { 
      id: 2, 
      reference: "WH/OUT/0002", 
      date: "2023-12-01", 
      contact: "Azure Interior", 
      from: "WH/Stock1", 
      to: "Vendor", 
      product: "[DESK001] Desk",
      quantity: 2,
      status: "Ready",
      type: "OUT" 
    },
    { 
        id: 3, 
        reference: "WH/OUT/0002", 
        date: "2023-12-01", 
        contact: "Azure Interior", 
        from: "WH/Stock2", 
        to: "Vendor", 
        product: "Chair",
        quantity: 5,
        status: "Ready",
        type: "OUT"
    },
    { 
        id: 4, 
        reference: "WH/IN/0003", 
        date: "2023-11-15", 
        contact: "Gemini Furniture", 
        from: "Vendor", 
        to: "WH/Stock1", 
        product: "Lamp",
        quantity: 50,
        status: "Done",
        type: "IN"
    }
  ]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMove, setNewMove] = useState({
    reference: '',
    date: '',
    contact: '',
    from: '',
    to: '',
    product: '',
    quantity: 0,
    status: 'Done',
    type: 'IN'
  });

  // --- Helpers ---

  const filteredMoves = moves.filter(item => {
    const ref = item.reference.toLowerCase();
    const contact = item.contact.toLowerCase();
    const query = searchTerm.toLowerCase();
    return ref.includes(query) || contact.includes(query);
  });

  const generateReference = () => {
    const nextId = moves.length + 1;
    const paddedId = String(nextId).padStart(4, '0');
    return `WH/MO/${paddedId}`; // MO for Manual Operation/Move
  };

  // --- Handlers ---

  const handleNewMoveClick = () => {
    setNewMove({
        reference: generateReference(),
        date: new Date().toISOString().split('T')[0],
        contact: '',
        from: '',
        to: '',
        product: '',
        quantity: 1,
        status: 'Done',
        type: 'IN'
    });
    setIsModalOpen(true);
  };

  const handleSaveMove = (e) => {
      e.preventDefault();
      const moveToAdd = {
          id: moves.length + 1,
          ...newMove
      };
      setMoves([moveToAdd, ...moves]);
      setIsModalOpen(false);
  };

  // --- Renderers ---

  const getStatusStyles = (status) => {
    return 'bg-gray-100 text-gray-700 border-gray-200'; 
  };

  const getTypeStyles = (type) => {
      if (type === 'IN') return {
          text: 'text-green-600',
          bg: 'bg-green-50',
          border: 'border-l-green-500',
          badge: 'bg-green-100 text-green-700'
      };
      return {
          text: 'text-red-600',
          bg: 'bg-red-50',
          border: 'border-l-red-500',
          badge: 'bg-red-100 text-red-700'
      };
  };

  const KanbanCard = ({ move }) => {
    const styles = getTypeStyles(move.type);
    return (
        <div className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer border-l-4 ${styles.border}`}>
            <div className="flex justify-between items-start mb-2">
                <span className={`font-bold text-sm ${styles.text}`}>{move.reference}</span>
                <span className={`text-xs px-2 py-0.5 rounded font-medium ${styles.badge}`}>
                    {move.type}
                </span>
            </div>
            <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {move.date}
            </div>
            <div className="text-sm text-gray-700 mb-2 font-medium">
                {move.product}
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 p-2 rounded">
                <span className="truncate max-w-[45%]">{move.from}</span>
                <ArrowRight className="w-3 h-3 text-gray-400" />
                <span className="truncate max-w-[45%]">{move.to}</span>
            </div>
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <History className="w-6 h-6 text-blue-600" />
              Move History
            </h2>
            <p className="text-gray-500 text-sm mt-1">Track all inventory movements between locations.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            
            {/* NEW BUTTON */}
            <button 
              onClick={handleNewMoveClick}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium rounded-lg shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Move</span>
            </button>

            {/* Search & View Toggle Container */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative group flex-1 sm:w-64">
                <input 
                  type="text" 
                  placeholder="Search Reference, Contact..." 
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

        {/* Main Content Area */}
        {view === 'list' ? (
          // LIST VIEW
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-fade-in">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMoves.length > 0 ? (
                    filteredMoves.map((item) => {
                        const styles = getTypeStyles(item.type);
                        return (
                          <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                            {/* Reference colored based on IN/OUT */}
                            <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${styles.text}`}>
                              {item.reference}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">{item.contact}</td>
                            
                            {/* From Location */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {item.from}
                            </td>

                            {/* To Location */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {item.to}
                            </td>

                            {/* Quantity (Colored based on IN/OUT) */}
                            <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-bold ${styles.text}`}>
                              {item.type === 'IN' ? '+' : '-'} {item.quantity}
                            </td>

                            {/* Status */}
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusStyles(item.status)}`}>
                                {item.status}
                              </span>
                            </td>
                          </tr>
                        );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center text-gray-400 text-sm">
                        <div className="flex flex-col items-center justify-center">
                           <Search className="w-8 h-8 mb-2 text-gray-300" />
                           <p>No history found matching "{searchTerm}"</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
               <span className="text-xs text-gray-500">Total Moves: {filteredMoves.length}</span>
            </div>
          </div>
        ) : (
          // KANBAN VIEW
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in">
             {filteredMoves.map(move => (
                 <KanbanCard key={move.id} move={move} />
             ))}
          </div>
        )}

      </main>

      {/* ================================================================== */}
      {/* NEW MOVE MODAL */}
      {/* ================================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800">Record New Move</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Form */}
            <form onSubmit={handleSaveMove} className="p-6 space-y-4">
              
              {/* Type Toggle */}
              <div className="flex gap-4 p-1 bg-gray-100 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setNewMove({...newMove, type: 'IN'})}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${newMove.type === 'IN' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                      IN (Receipt)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewMove({...newMove, type: 'OUT'})}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${newMove.type === 'OUT' ? 'bg-white text-red-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                      OUT (Delivery)
                  </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Reference</label>
                <input 
                  type="text" 
                  required
                  value={newMove.reference}
                  onChange={(e) => setNewMove({...newMove, reference: e.target.value})}
                  className="w-full border-b border-gray-300 focus:border-blue-600 outline-none py-1 text-gray-800 bg-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date</label>
                    <input 
                      type="date" 
                      required
                      value={newMove.date}
                      onChange={(e) => setNewMove({...newMove, date: e.target.value})}
                      className="w-full border-b border-gray-300 focus:border-blue-600 outline-none py-1 text-gray-800 bg-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Contact</label>
                    <input 
                      type="text" 
                      value={newMove.contact}
                      onChange={(e) => setNewMove({...newMove, contact: e.target.value})}
                      className="w-full border-b border-gray-300 focus:border-blue-600 outline-none py-1 text-gray-800 bg-transparent"
                      placeholder="e.g. Vendor Name"
                    />
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">From</label>
                    <input 
                      type="text" 
                      required
                      value={newMove.from}
                      onChange={(e) => setNewMove({...newMove, from: e.target.value})}
                      className="w-full border-b border-gray-300 focus:border-blue-600 outline-none py-1 text-gray-800 bg-transparent"
                      placeholder="e.g. Vendor"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">To</label>
                    <input 
                      type="text" 
                      required
                      value={newMove.to}
                      onChange={(e) => setNewMove({...newMove, to: e.target.value})}
                      className="w-full border-b border-gray-300 focus:border-blue-600 outline-none py-1 text-gray-800 bg-transparent"
                      placeholder="e.g. WH/Stock1"
                    />
                  </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Product</label>
                    <input 
                      type="text" 
                      required
                      value={newMove.product}
                      onChange={(e) => setNewMove({...newMove, product: e.target.value})}
                      className="w-full border-b border-gray-300 focus:border-blue-600 outline-none py-1 text-gray-800 bg-transparent"
                      placeholder="e.g. Chair"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Quantity</label>
                    <input 
                      type="number" 
                      required
                      min="1"
                      value={newMove.quantity}
                      onChange={(e) => setNewMove({...newMove, quantity: parseInt(e.target.value)})}
                      className="w-full border-b border-gray-300 focus:border-blue-600 outline-none py-1 text-gray-800 bg-transparent text-right"
                    />
                  </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
                >
                  Record Move
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default MoveHistory;