import React from 'react';
import { Package, Truck, AlertTriangle, DollarSign, TrendingUp, Users } from 'lucide-react';

const DashboardHome: React.FC = () => {
  const stats = [
    { title: 'Total Shipments', value: '14,293', change: '+12.5%', icon: Package, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'In Transit', value: '842', change: '+4.2%', icon: Truck, color: 'text-brand-yellow', bg: 'bg-brand-yellow/10' },
    { title: 'Exceptions', value: '12', change: '-2.1%', icon: AlertTriangle, color: 'text-brand-red', bg: 'bg-brand-red/10' },
    { title: 'Monthly Revenue', value: '$245k', change: '+18.2%', icon: DollarSign, color: 'text-brand-green', bg: 'bg-brand-green/10' },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up">
       <div className="flex justify-between items-end">
          <div>
             <h1 className="text-2xl font-bold text-brand-black dark:text-white">Dashboard Overview</h1>
             <p className="text-gray-500 text-sm mt-1">Real-time logistics performance metrics.</p>
          </div>
          <button className="bg-brand-black dark:bg-white text-white dark:text-black px-4 py-2 rounded font-bold text-sm shadow hover:shadow-lg transition-all">
             Download Report
          </button>
       </div>

       {/* Stats Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
             <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                   <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                      <stat.icon size={24} />
                   </div>
                   <span className={`text-xs font-bold px-2 py-1 rounded ${stat.change.startsWith('+') ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                      {stat.change}
                   </span>
                </div>
                <h3 className="text-3xl font-bold text-brand-black dark:text-white mb-1">{stat.value}</h3>
                <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
             </div>
          ))}
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart Area (Mockup) */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-brand-black dark:text-white">Shipment Volume</h3>
                <select className="bg-gray-100 dark:bg-gray-900 border-none rounded px-3 py-1 text-xs outline-none dark:text-white">
                   <option>Last 30 Days</option>
                   <option>Last 7 Days</option>
                   <option>Last Year</option>
                </select>
             </div>
             
             {/* Simple CSS Chart */}
             <div className="h-64 flex items-end justify-between gap-2">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
                   <div key={i} className="w-full bg-gray-100 dark:bg-gray-700 rounded-t-sm relative group">
                      <div 
                        className="absolute bottom-0 left-0 w-full bg-brand-red rounded-t-sm transition-all duration-1000 group-hover:bg-brand-redDark" 
                        style={{ height: `${h}%` }}
                      ></div>
                      {/* Tooltip */}
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                         {h * 10} Orders
                      </div>
                   </div>
                ))}
             </div>
             <div className="flex justify-between mt-4 text-xs text-gray-400 font-bold uppercase">
                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
             </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
             <h3 className="font-bold text-lg text-brand-black dark:text-white mb-6">Recent Alerts</h3>
             <div className="space-y-6">
                {[
                   { msg: 'Shipment #49201 delayed at customs', time: '20 min ago', type: 'alert' },
                   { msg: 'New driver registered: John D.', time: '2 hrs ago', type: 'info' },
                   { msg: 'System maintenance scheduled', time: '5 hrs ago', type: 'warning' },
                   { msg: 'Revenue milestone reached!', time: '1 day ago', type: 'success' },
                ].map((item, i) => (
                   <div key={i} className="flex gap-4 items-start">
                      <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                         item.type === 'alert' ? 'bg-brand-red' : 
                         item.type === 'success' ? 'bg-brand-green' : 
                         item.type === 'warning' ? 'bg-brand-yellow' : 'bg-blue-500'
                      }`}></div>
                      <div>
                         <p className="text-sm font-medium text-brand-black dark:text-white leading-tight">{item.msg}</p>
                         <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                      </div>
                   </div>
                ))}
             </div>
             <button className="w-full mt-6 py-2 border border-gray-200 dark:border-gray-700 text-sm font-bold rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300">
                View All Activity
             </button>
          </div>
       </div>
    </div>
  );
};

export default DashboardHome;