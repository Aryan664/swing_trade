import React from 'react';
import { DollarSign, PieChart, ArrowUpRight, TrendingUp } from 'lucide-react';

interface DashboardProps {
  account: any;
}

const Dashboard: React.FC<DashboardProps> = ({ account }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Market Overview</h1>
        <p className="text-gray-400 mt-1 font-medium">Your current paper-trading performance and portfolio analytics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6 bg-[#0a0a0a] border-[#1f1f1f] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm font-medium">Total Balance</span>
            <div className="p-2 bg-blue-500/10 rounded-lg"><DollarSign size={18} className="text-blue-500" /></div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-mono font-bold">${account?.balance?.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-1 uppercase font-bold tracking-wider">Available Liquidity</div>
          </div>
        </div>

        <div className="card p-6 bg-[#0a0a0a] border-[#1f1f1f] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm font-medium">Holdings</span>
            <div className="p-2 bg-purple-500/10 rounded-lg"><PieChart size={18} className="text-purple-500" /></div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-mono font-bold">{account?.portfolio?.length || 0}</div>
            <div className="text-xs text-gray-500 mt-1 uppercase font-bold tracking-wider">Active Positions</div>
          </div>
        </div>

        <div className="card p-6 bg-[#0a0a0a] border-[#1f1f1f] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm font-medium">Net Profit</span>
            <div className="p-2 bg-green-500/10 rounded-lg"><ArrowUpRight size={18} className="text-green-500" /></div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-mono font-bold text-green-500">$0.00</div>
            <div className="text-xs text-gray-500 mt-1 uppercase font-bold tracking-wider">Historical Gains</div>
          </div>
        </div>

        <div className="card p-6 bg-[#0a0a0a] border-[#1f1f1f] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm font-medium">Market Status</span>
            <div className="p-2 bg-yellow-500/10 rounded-lg"><TrendingUp size={18} className="text-yellow-500" /></div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-yellow-500">LIVE</div>
            <div className="text-xs text-gray-500 mt-1 uppercase font-bold tracking-wider">Yahoo Finance API</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card p-8 bg-[#0a0a0a] border-[#1f1f1f]">
          <h2 className="text-lg font-bold mb-6">Market Trends</h2>
          <div className="h-64 flex flex-col items-center justify-center space-y-4 border border-dashed border-[#1f1f1f] rounded-xl text-gray-600">
             <TrendingUp size={48} className="opacity-20" />
             <p className="text-sm font-medium">Search for a ticker to see detailed analysis.</p>
          </div>
        </div>

        <div className="card p-8 bg-[#0a0a0a] border-[#1f1f1f]">
          <h2 className="text-lg font-bold mb-6">Recent Activity</h2>
          <div className="space-y-4">
            <div className="text-sm text-gray-500 text-center py-10 italic">No recent trades executed.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
