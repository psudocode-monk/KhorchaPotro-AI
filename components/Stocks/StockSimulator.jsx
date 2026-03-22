'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ComposedChart, Bar, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Clock, DollarSign, Wallet2, RotateCcw, Activity, Trash2, BarChart2, LineChart as LineChartIcon } from 'lucide-react';
import Button from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

const ASSETS = [
  { id: 'INTL', name: 'IntelliSpend Index', basePrice: 1000, volatility: 2.5, decimals: 2 },
  { id: 'BTC/USD', name: 'Bitcoin / USD', basePrice: 65000, volatility: 45, decimals: 0 },
  { id: 'ETH/USD', name: 'Ethereum / USD', basePrice: 3500, volatility: 12, decimals: 2 },
  { id: 'AAPL', name: 'Apple Inc.', basePrice: 175.50, volatility: 0.8, decimals: 2 },
  { id: 'TSLA', name: 'Tesla Inc.', basePrice: 205.20, volatility: 1.5, decimals: 2 },
  { id: 'GOOGL', name: 'Alphabet Inc.', basePrice: 140.00, volatility: 0.6, decimals: 2 },
  { id: 'RELIANCE', name: 'Reliance Ind.', basePrice: 2950.00, volatility: 3.5, decimals: 2 },
  { id: 'TCS', name: 'TCS Ltd.', basePrice: 4100.00, volatility: 4.0, decimals: 2 },
  { id: 'EUR/USD', name: 'EUR / USD', basePrice: 1.0850, volatility: 0.0005, decimals: 4 },
  { id: 'XAU/USD', name: 'Gold / USD', basePrice: 2150.50, volatility: 2.0, decimals: 2 },
];

export default function StockSimulator() {
  const [selectedAsset, setSelectedAsset] = useState(ASSETS[0]);
  const [data, setData] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(selectedAsset.basePrice);
  
  const [balance, setBalance] = useState(10000);
  const [stake, setStake] = useState(100);
  const [duration, setDuration] = useState(15);
  
  const [activeTrades, setActiveTrades] = useState([]);
  const [tradeHistory, setTradeHistory] = useState([]);
  const [chartType, setChartType] = useState('area'); // 'area' or 'candle'

  // Load balance
  useEffect(() => {
    const saved = localStorage.getItem('intellispend_demo_balance');
    if (saved) setBalance(parseFloat(saved));
  }, []);

  // Save balance
  useEffect(() => {
    localStorage.setItem('intellispend_demo_balance', balance.toString());
  }, [balance]);

  // Initial history generation
  useEffect(() => {
    let price = selectedAsset.basePrice;
    const initialData = [];
    const now = new Date();
    
    for (let i = 150; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 2000);
      const change = (Math.random() - 0.5) * selectedAsset.volatility * 2;
      price = Math.max(0.0001, price + change);
      initialData.push({
        time: time.toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' }),
        price: Number(price.toFixed(selectedAsset.decimals)),
        timestamp: time.getTime()
      });
    }
    
    setData(initialData);
    setCurrentPrice(Number(price.toFixed(selectedAsset.decimals)));
    setActiveTrades([]);
  }, [selectedAsset]);

  // Keep track of mutable state for the interval without constantly clearing it
  const stateRef = useRef({ selectedAsset, activeTrades, currentPrice });
  useEffect(() => {
    stateRef.current = { selectedAsset, activeTrades, currentPrice };
  }, [selectedAsset, activeTrades, currentPrice]);

  // Real-time tick & Trade Resolution
  useEffect(() => {
    const interval = setInterval(() => {
      const { selectedAsset: asset, activeTrades: currentActiveTrades, currentPrice: prevPrice } = stateRef.current;
      
      const change = (Math.random() - 0.5) * asset.volatility * 2;
      const trend = (Math.random() - 0.5) * (asset.volatility * 0.5);
      const newPrice = Number(Math.max(0.0001, prevPrice + change + trend).toFixed(asset.decimals));
      
      const now = new Date();
      const nowTime = now.getTime();
      
      setCurrentPrice(newPrice);
      
      setData((prevData) => {
        const newData = [...prevData, {
          time: now.toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' }),
          price: newPrice,
          timestamp: nowTime
        }];
        if (newData.length > 150) newData.shift();
        return newData;
      });

      let hasResolved = false;
      let newBalanceAdd = 0;
      const resolvedHistory = [];
      const nextActiveTrades = [];

      currentActiveTrades.forEach(trade => {
        if (nowTime >= trade.resolvedAt) {
          hasResolved = true;
          const isWon = trade.type === 'UP' 
            ? newPrice > trade.entryPrice 
            : newPrice < trade.entryPrice;
          
          const isTie = newPrice === trade.entryPrice;
          let payout = 0;
          let status = 'LOST';
          
          if (isTie) {
            payout = trade.stake; // Refund
            status = 'TIE';
          } else if (isWon) {
            payout = trade.stake * 1.8; // 80% profit
            status = 'WON';
          }
          
          if (payout > 0) newBalanceAdd += payout;
          
          resolvedHistory.push({
            ...trade,
            exitPrice: newPrice,
            status,
            payout,
            resolvedAt: nowTime
          });
        } else {
          nextActiveTrades.push(trade);
        }
      });

      if (hasResolved) {
        setActiveTrades(nextActiveTrades);
        if (newBalanceAdd > 0) setBalance(b => b + newBalanceAdd);
        setTradeHistory(h => [...resolvedHistory, ...h].slice(0, 20));
      }

    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const placeTrade = (type) => {
    if (balance < stake || stake <= 0) return;
    
    setBalance(b => b - stake);
    
    const newTrade = {
      id: Math.random().toString(36).substring(7),
      assetId: selectedAsset.id,
      assetName: selectedAsset.name,
      type,
      stake,
      entryPrice: currentPrice,
      duration,
      startedAt: Date.now(),
      resolvedAt: Date.now() + duration * 1000
    };
    
    setActiveTrades(prev => [...prev, newTrade]);
  };

  const resetBalance = () => setBalance(10000);

  const isUpTrend = data.length > 10 ? currentPrice >= data[data.length - 10].price : true;
  const strokeColor = isUpTrend ? '#10B981' : '#EF4444';

  const candlesData = useMemo(() => {
    const candles = [];
    const GROUP_SIZE = 5; 
    for (let i = 0; i < data.length; i += GROUP_SIZE) {
      const chunk = data.slice(i, i + GROUP_SIZE);
      const open = chunk[0].price;
      const close = chunk[chunk.length - 1].price;
      const high = Math.max(...chunk.map(c => c.price));
      const low = Math.min(...chunk.map(c => c.price));
      
      const isUp = close >= open;
      const bodyMin = Math.min(open, close);
      const bodyMax = Math.max(open, close);
      const bodyAdjusted = bodyMin === bodyMax ? [bodyMin, bodyMin + (selectedAsset.volatility * 0.1)] : [bodyMin, bodyMax];

      candles.push({
        time: chunk[0].time,
        open, close, high, low,
        wick: [low, high],
        body: bodyAdjusted,
        color: isUp ? '#10B981' : '#EF4444'
      });
    }
    return candles;
  }, [data, selectedAsset]);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Chart Section */}
      <div className="flex-1 flex flex-col gap-6 w-full max-w-full overflow-hidden">
        <div className="bg-white/80 dark:bg-[#111]/80 backdrop-blur-xl border border-gray-200 dark:border-white/5 rounded-3xl p-4 sm:p-6 shadow-xl relative w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-xl shrink-0">
                <Activity className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold dark:text-white flex items-center gap-2 flex-wrap">
                  {selectedAsset.name} 
                  <span className={`font-mono transition-colors ${isUpTrend ? 'text-emerald-500' : 'text-red-500'}`}>
                    {currentPrice.toFixed(selectedAsset.decimals)}
                  </span>
                </h2>
                <div className="flex gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  <span>Simulated Data</span>
                  <span>•</span>
                  <span>Payout: 80%</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                <button 
                  onClick={() => setChartType('area')}
                  className={`p-1.5 rounded-lg transition-colors ${chartType === 'area' ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-500' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                  title="Line/Area Chart"
                >
                  <LineChartIcon className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setChartType('candle')}
                  className={`p-1.5 rounded-lg transition-colors ${chartType === 'candle' ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-500' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                  title="Candlestick Chart"
                >
                  <BarChart2 className="w-5 h-5" />
                </button>
              </div>
              <select
                className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 font-medium w-full sm:w-auto outline-none"
                value={selectedAsset.id}
                onChange={(e) => setSelectedAsset(ASSETS.find(a => a.id === e.target.value))}
              >
                {ASSETS.map(asset => (
                  <option key={asset.id} value={asset.id}>{asset.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="h-[300px] sm:h-[400px] w-full mt-4 -ml-4 sm:ml-0">
             <ResponsiveContainer width="100%" height="100%">
               {chartType === 'area' ? (
                 <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                   <defs>
                     <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3}/>
                       <stop offset="95%" stopColor={strokeColor} stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} vertical={false} />
                   <XAxis dataKey="time" stroke="#6B7280" fontSize={10} tickMargin={10} minTickGap={30} />
                   <YAxis domain={['auto', 'auto']} stroke="#6B7280" fontSize={10} tickFormatter={(val) => val.toFixed(selectedAsset.decimals > 2 ? 3 : selectedAsset.decimals)} orientation="right" width={50} />
                   <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff', borderRadius: '0.5rem' }} itemStyle={{ color: '#fff' }} isAnimationActive={false} />
                   
                   {activeTrades.map(trade => (
                     <ReferenceLine key={trade.id} y={trade.entryPrice} stroke={trade.type === 'UP' ? '#10B981' : '#EF4444'} strokeWidth={2} strokeDasharray="4 4" label={{ position: 'insideTopLeft', value: trade.type, fill: trade.type === 'UP' ? '#10B981' : '#EF4444', fontSize: 10, fontWeight: 'bold' }} />
                   ))}

                   <Area type="monotone" dataKey="price" stroke={strokeColor} strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" isAnimationActive={false} />
                 </AreaChart>
               ) : (
                 <ComposedChart data={candlesData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} vertical={false} />
                    <XAxis dataKey="time" stroke="#6B7280" fontSize={10} tickMargin={10} minTickGap={30} />
                    <YAxis domain={['auto', 'auto']} stroke="#6B7280" fontSize={10} tickFormatter={(val) => val.toFixed(selectedAsset.decimals > 2 ? 3 : selectedAsset.decimals)} orientation="right" width={50} />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff', borderRadius: '0.5rem' }} itemStyle={{ color: '#fff' }} isAnimationActive={false} cursor={{fill: '#374151', opacity: 0.2}} />
                    
                    {activeTrades.map(trade => (
                      <ReferenceLine key={trade.id} y={trade.entryPrice} stroke={trade.type === 'UP' ? '#10B981' : '#EF4444'} strokeWidth={2} strokeDasharray="4 4" label={{ position: 'insideTopLeft', value: trade.type, fill: trade.type === 'UP' ? '#10B981' : '#EF4444', fontSize: 10, fontWeight: 'bold' }} />
                    ))}

                    <Bar dataKey="wick" barSize={2} isAnimationActive={false}>
                      {candlesData.map((entry, index) => (
                        <Cell key={`wick-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                    <Bar dataKey="body" barSize={10} isAnimationActive={false}>
                      {candlesData.map((entry, index) => (
                        <Cell key={`body-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                 </ComposedChart>
               )}
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Trade History */}
        <div className="bg-white/80 dark:bg-[#111]/80 backdrop-blur-xl border border-gray-200 dark:border-white/5 rounded-3xl p-6 shadow-xl overflow-hidden w-full">
           <div className="flex justify-between items-center mb-4">
             <h3 className="text-lg font-bold dark:text-white">Recent Trades</h3>
             <button 
               onClick={() => setTradeHistory([])}
               className="text-sm flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
               disabled={tradeHistory.length === 0}
             >
               <Trash2 className="w-4 h-4" />
               Clear
             </button>
           </div>
           {tradeHistory.length === 0 && activeTrades.length === 0 ? (
             <p className="text-gray-500 text-sm">No trades yet. Make a prediction to start.</p>
           ) : (
             <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
               <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 min-w-[500px]">
                 <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-800/50">
                   <tr>
                     <th className="px-4 py-3">Asset</th>
                     <th className="px-4 py-3">Prediction</th>
                     <th className="px-4 py-3">Stake</th>
                     <th className="px-4 py-3">Status</th>
                     <th className="px-4 py-3 text-right">Payout</th>
                   </tr>
                 </thead>
                 <tbody>
                   {/* Active Trades */}
                   {activeTrades.map(trade => (
                     <tr key={trade.id} className="border-b dark:border-gray-700 bg-indigo-50/50 dark:bg-indigo-900/10">
                       <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{trade.assetName}</td>
                       <td className="px-4 py-3">
                         <span className={`px-2 py-1 rounded text-xs font-bold ${trade.type === 'UP' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'}`}>
                           {trade.type}
                         </span>
                       </td>
                       <td className="px-4 py-3 font-mono">₹{trade.stake}</td>
                       <td className="px-4 py-3">
                         <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold animate-pulse">
                           <Clock className="w-3 h-3" />
                           {Math.max(0, Math.ceil((trade.resolvedAt - Date.now()) / 1000))}s
                         </span>
                       </td>
                       <td className="px-4 py-3 text-right text-gray-400">Pending</td>
                     </tr>
                   ))}

                   {/* History */}
                   {tradeHistory.map(trade => (
                     <tr key={trade.id} className="border-b dark:border-gray-700">
                       <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{trade.assetName}</td>
                       <td className="px-4 py-3">
                         <span className={`px-2 py-1 rounded text-xs font-bold ${trade.type === 'UP' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'}`}>
                           {trade.type}
                         </span>
                       </td>
                       <td className="px-4 py-3 font-mono">₹{trade.stake}</td>
                       <td className="px-4 py-3">
                         <span className={`font-semibold ${trade.status === 'WON' ? 'text-emerald-500' : trade.status === 'LOST' ? 'text-red-500' : 'text-gray-500'}`}>
                           {trade.status}
                         </span>
                       </td>
                       <td className={`px-4 py-3 text-right font-mono font-bold ${trade.status === 'WON' ? 'text-emerald-500' : 'text-gray-500'}`}>
                         {trade.payout > 0 ? `+₹${trade.payout.toFixed(2)}` : '0'}
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           )}
        </div>
      </div>

      {/* Trading Panel Sidebar */}
      <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
        <div className="bg-white/80 dark:bg-[#111]/80 backdrop-blur-xl border border-gray-200 dark:border-white/5 rounded-3xl p-6 shadow-xl flex flex-col sticky top-24">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-gray-500 dark:text-gray-400 font-medium text-sm sm:text-base">Demo Balance</h3>
            <button onClick={resetBalance} className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors" title="Reset Balance to ₹10,000">
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex items-baseline gap-2 mb-8">
            <span className="text-3xl sm:text-4xl font-bold dark:text-white font-mono flex items-center">
              <span className="text-emerald-500 mr-1">₹</span>
              <AnimatePresence mode="wait">
                <motion.span 
                  key={balance}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-block"
                >
                  {balance.toFixed(2)}
                </motion.span>
              </AnimatePresence>
            </span>
          </div>

          <div className="space-y-6 mb-8">
            <div>
              <label className="flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <span>Amount (₹)</span>
                <span className="text-emerald-500 font-semibold text-xs sm:text-sm">Profit: +₹{(stake * 0.8).toFixed(2)}</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="w-4 h-4 text-emerald-500/50" />
                </div>
                <input
                  type="number"
                  min="10"
                  max={Math.max(10, balance)}
                  value={stake}
                  onChange={(e) => setStake(Number(e.target.value))}
                  className="w-full pl-9 pr-[70px] py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 dark:text-white font-mono text-lg transition-colors outline-none"
                />
                <div className="absolute inset-y-0 right-1 py-1 px-1 flex gap-1">
                   <button onClick={() => setStake(s => Math.max(10, s - 100))} className="h-full px-2 sm:px-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500 transition-colors font-bold shadow-sm">-</button>
                   <button onClick={() => setStake(s => Math.min(balance, s + 100))} className="h-full px-2 sm:px-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500 transition-colors font-bold shadow-sm">+</button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Duration
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[15, 30, 60].map(s => (
                  <button
                    key={s}
                    onClick={() => setDuration(s)}
                    className={`py-2 rounded-xl text-xs sm:text-sm font-medium transition-all shadow-sm border ${duration === s ? 'bg-indigo-500 border-indigo-500 text-white shadow-md shadow-indigo-500/20 ring-2 ring-indigo-500/50' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                  >
                    {s} sec
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-auto">
            <button
              onClick={() => placeTrade('DOWN')}
              disabled={balance < stake || stake <= 0}
              className="group relative overflow-hidden flex flex-col items-center justify-center p-4 bg-gradient-to-br from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 disabled:from-gray-500 disabled:to-gray-600 disabled:opacity-50 text-white rounded-2xl transition-all active:scale-95 shadow-lg shadow-red-500/20 border border-red-400/30"
            >
              <TrendingDown className="w-8 h-8 mb-1 group-hover:translate-y-1 transition-transform relative z-10" />
              <span className="font-bold uppercase tracking-wider relative z-10">Down</span>
              {/* Shine effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 opacity-0 group-hover:opacity-100"></div>
            </button>
            <button
              onClick={() => placeTrade('UP')}
              disabled={balance < stake || stake <= 0}
              className="group relative overflow-hidden flex flex-col items-center justify-center p-4 bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:from-gray-500 disabled:to-gray-600 disabled:opacity-50 text-white rounded-2xl transition-all active:scale-95 shadow-lg shadow-emerald-500/20 border border-emerald-400/30"
            >
              <TrendingUp className="w-8 h-8 mb-1 group-hover:-translate-y-1 transition-transform relative z-10" />
              <span className="font-bold uppercase tracking-wider relative z-10">Up</span>
              {/* Shine effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 opacity-0 group-hover:opacity-100"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
