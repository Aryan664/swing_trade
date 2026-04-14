import React, { useState } from 'react';
import axios from 'axios';
import { Search, Loader2, ArrowUpCircle, ArrowDownCircle, AlertCircle } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

interface StockSearchProps {
  onTrade: () => void;
}

const StockSearch: React.FC<StockSearchProps> = ({ onTrade }) => {
  const [symbol, setSymbol] = useState('');
  const [stock, setStock] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shares, setShares] = useState(1);
  const [trading, setTrading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol) return;
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_BASE}/stock/${symbol.toUpperCase()}`);
      setStock(response.data);
    } catch (err) {
      setError('Stock not found. Please check the symbol (e.g., AAPL, TSLA).');
      setStock(null);
    } finally {
      setLoading(false);
    }
  };

  const executeTrade = async (action: 'buy' | 'sell') => {
    setTrading(true);
    setError('');
    try {
      await axios.post(`${API_BASE}/${action}`, {
        symbol: stock.symbol,
        shares: Number(shares)
      });
      onTrade();
      alert(`Successfully ${action === 'buy' ? 'bought' : 'sold'} ${shares} shares of ${stock.symbol}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Trade failed. Please try again.');
    } finally {
      setTrading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Market Explorer</h1>
        <p className="text-gray-400 mt-1 font-medium">Search the NYSE/NASDAQ for real-time tickers and execute mock trades.</p>
      </div>

      <div className="card p-8 bg-[#0a0a0a] border-[#1f1f1f]">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Enter Stock Symbol (e.g. BTC-USD, NVDA, AMZN)"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#111111] border border-[#1f1f1f] rounded-xl focus:border-blue-500 outline-none font-mono tracking-widest uppercase transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary px-8 flex items-center space-x-2"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <span>Analyze</span>}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center space-x-3 text-red-500 text-sm font-medium">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}
      </div>

      {stock && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in zoom-in duration-500">
          <div className="card p-8 bg-[#0a0a0a] border-[#1f1f1f] space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-4xl font-mono font-bold">{stock.symbol}</h2>
                <p className="text-gray-400 font-medium">{stock.name}</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-mono font-bold">${stock.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                <div className={`text-sm font-bold ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}% Today
                </div>
              </div>
            </div>

            <div className="h-px bg-[#1f1f1f]" />

            <div className="space-y-4">
              <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Order Execution</div>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#111111] rounded-xl border border-[#1f1f1f]">
                  <span className="text-sm font-medium text-gray-400">Quantity</span>
                  <input
                    type="number"
                    min="1"
                    value={shares}
                    onChange={(e) => setShares(Number(e.target.value))}
                    className="bg-transparent border-none text-right outline-none font-mono text-xl w-24"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-[#111111] rounded-xl border border-[#1f1f1f]">
                  <span className="text-sm font-medium text-gray-400">Total Value</span>
                  <span className="font-mono text-xl">${(stock.price * shares).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <button
                    onClick={() => executeTrade('buy')}
                    disabled={trading}
                    className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-bold transition-all disabled:opacity-50"
                  >
                    {trading ? <Loader2 className="animate-spin" /> : <><ArrowUpCircle size={20} /> <span>Long Position</span></>}
                  </button>
                  <button
                    onClick={() => executeTrade('sell')}
                    disabled={trading}
                    className="flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl font-bold transition-all disabled:opacity-50"
                  >
                    {trading ? <Loader2 className="animate-spin" /> : <><ArrowDownCircle size={20} /> <span>Close Position</span></>}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-[#0a0a0a] border-[#1f1f1f] flex items-center justify-center p-8">
             <div className="text-center space-y-4">
                <div className="text-6xl text-blue-500/20"><TrendingUp size={80} /></div>
                <h3 className="text-xl font-bold">Advanced Charting</h3>
                <p className="text-gray-500 text-sm max-w-xs mx-auto font-medium">Historical price visualization and candlestick analysis for {stock.symbol}.</p>
                <div className="pt-4 flex justify-center space-x-2">
                   <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                   <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-75"></div>
                   <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-150"></div>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockSearch;
