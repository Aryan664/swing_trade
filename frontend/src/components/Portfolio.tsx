import React from 'react';
import axios from 'axios';
import { Briefcase, ArrowUpRight, ArrowDownRight, Trash2 } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

interface PortfolioProps {
  account: any;
  onTrade: () => void;
}

const Portfolio: React.FC<PortfolioProps> = ({ account, onTrade }) => {
  const sellAll = async (symbol: string, shares: number) => {
    try {
      await axios.post(`${API_BASE}/sell`, { symbol, shares });
      onTrade();
      alert(`Sold all shares of ${symbol}`);
    } catch (err) {
      alert('Failed to sell shares');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">My Portfolio</h1>
        <p className="text-gray-400 mt-1 font-medium">Manage your active positions and track unrealized gains.</p>
      </div>

      <div className="card overflow-hidden bg-[#0a0a0a] border-[#1f1f1f]">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#1f1f1f] bg-[#111111]/50">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Asset</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Shares</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Avg Price</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Total Cost</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1f1f1f]">
            {account?.portfolio?.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center text-gray-500 italic">
                   <div className="flex flex-col items-center space-y-3">
                      <Briefcase size={40} className="opacity-20" />
                      <span>No active positions found. Explore the market to start trading.</span>
                   </div>
                </td>
              </tr>
            ) : (
              account?.portfolio?.map((pos: any) => (
                <tr key={pos.symbol} className="hover:bg-[#111111] transition-all group">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold">
                        {pos.symbol[0]}
                      </div>
                      <div>
                        <div className="font-mono font-bold text-white">{pos.symbol}</div>
                        <div className="text-xs text-gray-500">EQUITY</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono font-medium">{pos.shares}</td>
                  <td className="px-6 py-4 font-mono font-medium text-gray-400">${pos.avgPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="px-6 py-4 font-mono font-bold text-white">${(pos.shares * pos.avgPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => sellAll(pos.symbol, pos.shares)}
                      className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                      title="Liquidate Position"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {account?.portfolio?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="card p-6 bg-[#0a0a0a] border-[#1f1f1f] border-l-4 border-l-blue-500">
              <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Portfolio Concentration</div>
              <div className="flex items-center space-x-4">
                 <div className="text-2xl font-bold font-mono">{(account.portfolio.length / 10 * 100).toFixed(0)}%</div>
                 <div className="flex-1 h-2 bg-[#1f1f1f] rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${(account.portfolio.length / 10 * 100)}%` }}></div>
                 </div>
              </div>
           </div>
           <div className="card p-6 bg-[#0a0a0a] border-[#1f1f1f] border-l-4 border-l-green-500">
              <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Unrealized P/L</div>
              <div className="flex items-center space-x-2 text-green-500">
                 <ArrowUpRight size={20} />
                 <span className="text-2xl font-bold font-mono">$0.00</span>
                 <span className="text-xs font-bold bg-green-500/10 px-2 py-1 rounded">+0.00%</span>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
