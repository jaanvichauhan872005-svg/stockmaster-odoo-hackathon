import React, { useState } from 'react';
import {
    Search,
    Plus,
    List,
    LayoutGrid,
    ArrowDownToLine,
    MoreHorizontal,
    Printer,
    X,
    Trash2,
    ChevronRight,
    Edit2
} from 'lucide-react';

import Navbar from '../components/Navbar';

const Receipts = () => {
    // --- Configuration ---
    const WAREHOUSE_ID = "WH";
    const OPERATION_TYPE = "IN";
    const CURRENT_USER = "Admin User";

    // --- State ---
    const [view, setView] = useState('list');
    const [searchTerm, setSearchTerm] = useState('');

    // Main Data - Now includes explicit 'reference' field
    const [receipts, setReceipts] = useState([
        { id: 1, reference: "WH/IN/0001", from: "Azure Interior", to: "WH/Stock1", contact: "Azure Interior", date: "2023-10-25", status: "Ready", responsible: "Admin User", items: [{ product: "[DESK001] Desk", qty: 10 }] },
        { id: 2, reference: "WH/IN/0002", from: "Gemini Furniture", to: "WH/Stock1", contact: "Gemini Furniture", date: "2023-10-26", status: "Done", responsible: "Admin User", items: [{ product: "Chair", qty: 20 }] },
        { id: 3, reference: "WH/IN/0003", from: "Deco Addict", to: "WH/Stock1", contact: "Deco Addict", date: "", status: "Draft", responsible: "Admin User", items: [] }
    ]);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentReceipt, setCurrentReceipt] = useState(null);
    const [isEditingRef, setIsEditingRef] = useState(false); // Toggle for reference input

    // --- Helpers ---

    const generateReference = (id) => {
        const paddedId = String(id).padStart(4, '0');
        return `${WAREHOUSE_ID}/${OPERATION_TYPE}/${paddedId}`;
    };

    const filteredReceipts = receipts.filter(item => {
        const ref = item.reference.toLowerCase();
        const contact = item.from.toLowerCase();
        const query = searchTerm.toLowerCase();
        return ref.includes(query) || contact.includes(query);
    });

    // --- Actions ---

    const openNewReceiptModal = () => {
        const newId = receipts.length > 0 ? Math.max(...receipts.map(r => r.id)) + 1 : 1;

        setCurrentReceipt({
            id: newId,
            reference: generateReference(newId), // Auto-generate, but editable
            isNew: true,
            from: "",
            to: "WH/Stock1",
            contact: "",
            date: "",
            status: "Draft",
            responsible: CURRENT_USER,
            items: []
        });
        setIsEditingRef(false);
        setIsModalOpen(true);
    };

    const openEditReceiptModal = (receipt) => {
        setCurrentReceipt({
            ...receipt,
            isNew: false,
            responsible: receipt.responsible || CURRENT_USER
        });
        setIsEditingRef(false);
        setIsModalOpen(true);
    };

    const handleSaveReceipt = () => {
        if (!currentReceipt.from) {
            alert("Please select a vendor (Receive From).");
            return;
        }

        if (currentReceipt.isNew) {
            setReceipts([currentReceipt, ...receipts]);
        } else {
            setReceipts(receipts.map(r => r.id === currentReceipt.id ? currentReceipt : r));
        }
        setIsModalOpen(false);
    };

    const handleStatusChange = (newStatus) => {
        setCurrentReceipt({ ...currentReceipt, status: newStatus });
    };

    // Product Line Logic
    const addProductLine = () => {
        setCurrentReceipt({
            ...currentReceipt,
            items: [...currentReceipt.items, { product: "", qty: 1 }]
        });
    };

    const updateProductLine = (index, field, value) => {
        const newItems = [...currentReceipt.items];
        newItems[index][field] = value;
        setCurrentReceipt({ ...currentReceipt, items: newItems });
    };

    const removeProductLine = (index) => {
        const newItems = currentReceipt.items.filter((_, i) => i !== index);
        setCurrentReceipt({ ...currentReceipt, items: newItems });
    };

    // --- Renderers ---

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Ready': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Draft': return 'bg-gray-100 text-gray-700 border-gray-200';
            case 'Done': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const getKanbanBorder = (status) => {
        switch (status) {
            case 'Ready': return 'border-l-blue-500';
            case 'Draft': return 'border-l-gray-400';
            case 'Done': return 'border-l-green-500';
            default: return 'border-l-gray-200';
        }
    };

    const KanbanColumn = ({ title, items, colorClass }) => (
        <div className="flex flex-col gap-3">
            <div className={`flex items-center justify-between pb-3 border-b ${colorClass}`}>
                <span className="font-semibold text-gray-700 text-sm uppercase tracking-wider">{title}</span>
                <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
                    {items.length}
                </span>
            </div>
            <div className="flex flex-col gap-3">
                {items.map(item => (
                    <div
                        key={item.id}
                        onClick={() => openEditReceiptModal(item)}
                        className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer border-l-4 ${getKanbanBorder(item.status)}`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-gray-800 text-sm">{item.reference}</span>
                            <MoreHorizontal className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="text-xs text-gray-500 mb-1">
                            Contact: <span className="text-blue-600 font-medium">{item.from}</span>
                        </div>
                        <div className="text-xs text-gray-400">To: {item.to}</div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header & Actions */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <ArrowDownToLine className="w-6 h-6 text-blue-600" />
                            Receipts
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">Manage incoming shipments and vendor receipts.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                        <button
                            onClick={openNewReceiptModal}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium rounded-lg shadow-sm transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            <span>New Receipt</span>
                        </button>

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
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-fade-in">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receive From</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsible</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule Date</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredReceipts.length > 0 ? (
                                        filteredReceipts.map((item) => (
                                            <tr key={item.id} onClick={() => openEditReceiptModal(item)} className="hover:bg-gray-50 transition-colors cursor-pointer group">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                                    {item.reference}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.from}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">{item.responsible || CURRENT_USER}</td>
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
                                                No receipts found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                        <KanbanColumn title="Draft" items={filteredReceipts.filter(i => i.status === 'Draft')} colorClass="border-gray-200" />
                        <KanbanColumn title="Ready" items={filteredReceipts.filter(i => i.status === 'Ready')} colorClass="border-blue-200" />
                        <KanbanColumn title="Done" items={filteredReceipts.filter(i => i.status === 'Done')} colorClass="border-green-200" />
                    </div>
                )}
            </main>

            {/* ================================================================== */}
            {/* RECEIPT MODAL */}
            {/* ================================================================== */}
            {isModalOpen && currentReceipt && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden">

                        {/* 1. Modal Top Bar */}
                        <div className="px-6 py-4 border-b border-gray-200 bg-white flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                {currentReceipt.isNew && (
                                    <span className="border border-gray-300 text-gray-700 px-3 py-0.5 rounded text-sm font-medium shadow-sm">New</span>
                                )}
                                <h2 className="text-2xl font-normal text-gray-800">Receipt</h2>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* 2. Action Bar */}
                        <div className="px-6 py-4 border-b border-gray-200 bg-white flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <button
                                    onClick={() => handleStatusChange('Done')}
                                    className="px-4 py-1.5 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-md text-sm font-medium transition"
                                >
                                    Validate
                                </button>
                                <button
                                    onClick={handleSaveReceipt}
                                    className="px-4 py-1.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md text-sm font-medium transition"
                                >
                                    Save
                                </button>
                                <button className="px-4 py-1.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md text-sm font-medium transition">
                                    Print
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
                                {['Draft', 'Ready', 'Done'].map((step, index, arr) => {
                                    const isActive = currentReceipt.status === step;
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

                            {/* EDITABLE Reference ID */}
                            <div className="mb-8 flex items-center gap-3 group">
                                {isEditingRef ? (
                                    <input
                                        type="text"
                                        value={currentReceipt.reference}
                                        onChange={(e) => setCurrentReceipt({ ...currentReceipt, reference: e.target.value })}
                                        onBlur={() => setIsEditingRef(false)}
                                        autoFocus
                                        className="text-3xl text-gray-700 font-medium tracking-tight border-b-2 border-blue-500 outline-none bg-transparent w-full max-w-md"
                                    />
                                ) : (
                                    <h1
                                        className="text-3xl text-gray-700 font-medium tracking-tight cursor-pointer hover:text-blue-600 transition-colors"
                                        onClick={() => setIsEditingRef(true)}
                                        title="Click to edit reference"
                                    >
                                        {currentReceipt.reference}
                                    </h1>
                                )}

                                <button
                                    onClick={() => setIsEditingRef(!isEditingRef)}
                                    className="text-gray-300 hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100"
                                    title="Edit Reference"
                                >
                                    <Edit2 className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Form Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-8">
                                <div className="space-y-6">
                                    <div className="group">
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Receive From</label>
                                        <input
                                            type="text"
                                            value={currentReceipt.from}
                                            onChange={(e) => setCurrentReceipt({ ...currentReceipt, from: e.target.value })}
                                            className="w-full border-b border-gray-300 focus:border-blue-600 outline-none py-1 text-gray-800 bg-transparent transition-colors font-medium"
                                            placeholder="e.g. Vendor Name"
                                        />
                                    </div>

                                    <div className="group">
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Responsible</label>
                                        <input
                                            type="text"
                                            value={currentReceipt.responsible}
                                            readOnly
                                            className="w-full border-b border-gray-300 outline-none py-1 text-gray-600 bg-transparent transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="group">
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Schedule Date</label>
                                        <input
                                            type="date"
                                            value={currentReceipt.date}
                                            onChange={(e) => setCurrentReceipt({ ...currentReceipt, date: e.target.value })}
                                            className="w-full border-b border-gray-300 focus:border-blue-600 outline-none py-1 text-gray-800 bg-transparent transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Products */}
                            <div className="mt-8">
                                <div className="border-b border-gray-200 mb-4">
                                    <button className="text-sm font-medium text-gray-800 border-b-2 border-gray-800 pb-2 px-1">
                                        Products
                                    </button>
                                </div>

                                <table className="min-w-full">
                                    <thead>
                                        <tr>
                                            <th className="text-left text-sm font-medium text-gray-500 pb-2 border-b border-gray-200 w-3/4">Product</th>
                                            <th className="text-right text-sm font-medium text-gray-500 pb-2 border-b border-gray-200 w-1/4">Quantity</th>
                                            <th className="w-10 border-b border-gray-200"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentReceipt.items.map((item, index) => (
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
                                                <td className="py-2 border-b border-gray-100 text-right">
                                                    <input
                                                        type="number"
                                                        value={item.qty}
                                                        onChange={(e) => updateProductLine(index, 'qty', e.target.value)}
                                                        className="w-20 text-right outline-none text-gray-800"
                                                    />
                                                </td>
                                                <td className="py-2 border-b border-gray-100 text-right">
                                                    <button onClick={() => removeProductLine(index)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}

                                        <tr>
                                            <td colSpan="3" className="py-3">
                                                <button
                                                    onClick={addProductLine}
                                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                >
                                                    New Product
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

export default Receipts;