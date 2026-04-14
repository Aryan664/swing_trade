import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LayoutDashboard, Search, Briefcase, TrendingUp } from 'lucide-react';
import Dashboard from './components/Dashboard';
import StockSearch from './components/StockSearch';
import Portfolio from './components/Portfolio';

const API_BASE = 'http://localhost:5000/api';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'search' | 'portfolio'>('dashboard');
  const [account, setAccount] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAccount = async () => {
    try {
      const response = await axios.get(`${API_BASE}/account`);
      setAccount(response.data);
    } catch (error) {
      console.error('Failed to fetch account', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccount();
    const interval = setInterval(fetchAccount, 30000); // Polling every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center text-xl font-mono">Loading Trading Engine...</div>;

  return (
    <div className="flex h-screen bg-[#050505]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#1f1f1f] flex flex-col p-6 space-y-8">
        <div className="flex items-center space-x-3 text-blue-500 mb-4">
          <TrendingUp size={28} />
          <span className="text-xl font-bold tracking-tight text-white">SWING TRADE</span>
        </div>

        <nav className="flex-1 space-y-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-[#111111] text-blue-500 border border-[#1f1f1f]' : 'text-gray-400 hover:text-white hover:bg-[#0a0a0a]'}`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'search' ? 'bg-[#111111] text-blue-500 border border-[#1f1f1f]' : 'text-gray-400 hover:text-white hover:bg-[#0a0a0a]'}`}
          >
            <Search size={20} />
            <span className="font-medium">Market Explorer</span>
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'portfolio' ? 'bg-[#111111] text-blue-500 border border-[#1f1f1f]' : 'text-gray-400 hover:text-white hover:bg-[#0a0a0a]'}`}
          >
            <Briefcase size={20} />
            <span className="font-medium">My Portfolio</span>
          </button>
        </nav>

        <div className="card p-4 bg-[#0a0a0a] space-y-2">
          <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Account Balance</div>
          <div className="text-xl font-mono font-bold text-white">${account?.balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-10">
        {activeTab === 'dashboard' && <Dashboard account={account} />}
        {activeTab === 'search' && <StockSearch onTrade={fetchAccount} />}
        {activeTab === 'portfolio' && <Portfolio account={account} onTrade={fetchAccount} />}
      </main>
    </div>
  );
};

export default App;
