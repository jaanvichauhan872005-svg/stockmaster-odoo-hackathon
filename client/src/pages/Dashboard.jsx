import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    History,
    Settings,
    Boxes,
    Bell,
    User,
    ChevronRight,
    AlertCircle,
    Clock,
    ArrowDownToLine,
    ArrowUpFromLine,
    Menu,
    X
} from 'lucide-react';
import Navbar from '../components/Navbar';

// Reusable Card Component
const OperationCard = ({ title, actionText, actionCount, stats, type }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between h-64 hover:shadow-md transition-shadow duration-200">
            <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    {type === 'receipt' ? (
                        <ArrowDownToLine className="w-5 h-5 text-blue-600" />
                    ) : (
                        <ArrowUpFromLine className="w-5 h-5 text-orange-600" />
                    )}
                    {title}
                </h3>
                <span className="bg-gray-100 text-gray-600 py-1 px-2 rounded text-xs font-medium uppercase tracking-wider">
                    {type}
                </span>
            </div>

            <div className="flex flex-col gap-4 mt-4">
                <button className="flex items-center justify-between w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors group">
                    <span className="font-medium text-lg">{actionCount} {actionText}</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="space-y-2">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                            <span className={`flex items-center gap-2 ${stat.alert ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                                {stat.alert && <AlertCircle className="w-4 h-4" />}
                                {stat.warning && <Clock className="w-4 h-4 text-amber-500" />}
                                {stat.label}
                            </span>
                            <span className="font-mono text-gray-900 bg-gray-50 px-2 py-0.5 rounded">
                                {stat.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('Dashboard');


    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            {/* Top Navigation Bar */}

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
                    <p className="text-gray-500 mt-1">Here's what's happening in your inventory today.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* Receipt Card - Matches sketch "Receipt" */}
                    <Link to="/stock">
                        <OperationCard
                            title="Total Stocks"
                            type="stocks"
                            actionText="available stocks"
                            actionCount={4}
                            stats={[
                                { label: "Out of stock", value: 1, alert: true },
                                { label: "Pending", value: 6, warning: true }
                            ]}
                        />
                    </Link>
                    <Link to="/receipts">
                        <OperationCard
                            title="Receipts"
                            type="receipt"
                            actionText="to receive"
                            actionCount={4}
                            stats={[
                                { label: "Late", value: 1, alert: true },
                                { label: "Total Operations", value: 6 }
                            ]}
                        />
                    </Link>

                    {/* Delivery Card - Matches sketch "Delivery" */}
                    <Link to="/deliveries">
                        <OperationCard
                            title="Deliveries"
                            type="delivery"
                            actionText="to deliver"
                            actionCount={4}
                            stats={[
                                { label: "Late", value: 1, alert: true },
                                { label: "Waiting", value: 2, warning: true },
                                { label: "Total Operations", value: 6 }
                            ]}
                        />
                    </Link>

                    {/* Placeholder Card to fill grid (Optional, but makes it look 'real') */}
                    <div className="bg-white rounded-xl shadow-sm border border-dashed border-gray-300 p-6 flex flex-col justify-center items-center h-64 text-gray-400 hover:border-gray-400 hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                            <Package className="w-6 h-6 text-gray-400" />
                        </div>
                        <span className="font-medium">Internal Transfers</span>
                        <span className="text-sm mt-1">No pending actions</span>
                    </div>

                </div>

                {/* Optional Table Section to fill empty space in sketch */}
                <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Recent Operations</h3>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scheduled</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {[
                                    { ref: "WH/IN/00124", partner: "Azure Interior", status: "Late", date: "Today" },
                                    { ref: "WH/OUT/00098", partner: "Gemini Furniture", status: "Ready", date: "Tomorrow" },
                                    { ref: "WH/IN/00125", partner: "Deco Addict", status: "Waiting", date: "In 2 days" },
                                ].map((row, i) => (
                                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{row.ref}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.partner}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${row.status === 'Late' ? 'bg-red-100 text-red-800' :
                                                row.status === 'Ready' ? 'bg-green-100 text-green-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;