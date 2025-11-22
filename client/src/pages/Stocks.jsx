import React, { useState } from 'react';
import { Search, Edit2, Save, X, Plus, Package } from 'lucide-react';
import Navbar from '../components/Navbar';


const Stock = () => {
  // Stock Data State
  const [products, setProducts] = useState([
    { id: 1, name: 'Desk', cost: 3000, onHand: 50, freeToUse: 45 },
    { id: 2, name: 'Table', cost: 3000, onHand: 50, freeToUse: 50 },
    { id: 3, name: 'Chair', cost: 1500, onHand: 120, freeToUse: 100 },
  ]);

  // Search State
  const [searchTerm, setSearchTerm] = useState('');

  // Editing State
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ onHand: 0, freeToUse: 0 });

  // Adding State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', cost: '', onHand: 0, freeToUse: 0 });

  // --- Handlers ---

  // Filter products based on search
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Start Editing
  const handleEditClick = (product) => {
    setEditingId(product.id);
    setEditForm({ onHand: product.onHand, freeToUse: product.freeToUse });
  };

  // Cancel Editing
  const handleCancelClick = () => {
    setEditingId(null);
  };

  // Save Changes (Edit)
  const handleSaveClick = (id) => {
    const updatedProducts = products.map(p => {
      if (p.id === id) {
        return { 
          ...p, 
          onHand: parseInt(editForm.onHand) || 0, 
          freeToUse: parseInt(editForm.freeToUse) || 0 
        };
      }
      return p;
    });
    setProducts(updatedProducts);
    setEditingId(null);
  };

  // Save New Product (Add)
  const handleAddSubmit = (e) => {
    e.preventDefault();
    
    // Generate simple ID (in real app, backend handles this)
    const nextId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;

    const itemToAdd = {
      id: nextId,
      name: newProduct.name,
      cost: parseInt(newProduct.cost) || 0,
      onHand: parseInt(newProduct.onHand) || 0,
      freeToUse: parseInt(newProduct.freeToUse) || 0
    };

    setProducts([itemToAdd, ...products]); // Add to top of list
    setIsAddModalOpen(false);
    setNewProduct({ name: '', cost: '', onHand: 0, freeToUse: 0 }); // Reset form
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* 1. Page Header & Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Package className="w-6 h-6 text-blue-600" />
              Stock Management
            </h2>
            <p className="text-gray-500 text-sm mt-1">Manage your inventory levels and unit costs.</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative group flex-1 sm:w-64">
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all shadow-sm"
              />
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            </div>

            {/* New Button */}
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium rounded-lg shadow-sm transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Add Item</span>
            </button>
          </div>
        </div>

        {/* 2. Stock Table Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Per Unit Cost</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">On Hand</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Free to Use</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => {
                    const isEditing = editingId === product.id;

                    return (
                      <tr 
                        key={product.id} 
                        className="hover:bg-gray-50 transition-colors group"
                      >
                        {/* Product Name */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {product.name}
                        </td>

                        {/* Per Unit Cost */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="font-mono">{product.cost.toLocaleString()} Rs</span>
                        </td>

                        {/* On Hand (Editable) */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {isEditing ? (
                            <input 
                              type="number" 
                              value={editForm.onHand}
                              onChange={(e) => setEditForm({...editForm, onHand: e.target.value})}
                              className="w-24 p-1 border border-blue-300 rounded focus:ring-2 focus:ring-blue-200 outline-none text-gray-900"
                            />
                          ) : (
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.onHand < 10 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                              {product.onHand} Units
                            </span>
                          )}
                        </td>

                        {/* Free to Use (Editable) */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                           {isEditing ? (
                            <input 
                              type="number" 
                              value={editForm.freeToUse}
                              onChange={(e) => setEditForm({...editForm, freeToUse: e.target.value})}
                              className="w-24 p-1 border border-blue-300 rounded focus:ring-2 focus:ring-blue-200 outline-none text-gray-900"
                            />
                          ) : (
                            <span className="font-medium text-gray-700">{product.freeToUse}</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {isEditing ? (
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => handleSaveClick(product.id)}
                                className="text-green-600 hover:text-green-900 p-1"
                                title="Save"
                              >
                                <Save className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={handleCancelClick}
                                className="text-gray-400 hover:text-gray-600 p-1"
                                title="Cancel"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => handleEditClick(product)}
                              className="text-blue-600 hover:text-blue-900 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Update Stock"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400 text-sm">
                      <Package className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                      No products found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Footer of the card */}
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
            <p className="text-xs text-gray-500 italic">
              * Click the pencil icon on a row to update stock levels.
            </p>
            <span className="text-xs font-medium text-gray-500">
              Total Items: {products.length}
            </span>
          </div>
        </div>

      </main>

      {/* 3. Add Stock Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800">Add New Product</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input 
                  type="text" 
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="e.g. Ergonomic Chair"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Per Unit Cost (Rs)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500 text-sm">Rs</span>
                  <input 
                    type="number" 
                    required
                    min="0"
                    value={newProduct.cost}
                    onChange={(e) => setNewProduct({...newProduct, cost: e.target.value})}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">On Hand</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    value={newProduct.onHand}
                    onChange={(e) => setNewProduct({...newProduct, onHand: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Free to Use</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    value={newProduct.freeToUse}
                    onChange={(e) => setNewProduct({...newProduct, freeToUse: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Stock;