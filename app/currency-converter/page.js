'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRightLeft, RefreshCw, DollarSign, HelpCircle } from 'lucide-react';

const COMMON_CURRENCIES = [
  'USD', 'EUR', 'GBP', 'BDT', 'INR', 'CAD', 'AUD', 'JPY', 'CNY', 'AED', 'SAR', 'MYR'
];

export default function CurrencyConverter() {
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('BDT');
  const [result, setResult] = useState(null);
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');

  const handleConvert = async () => {
    if (!amount || isNaN(amount)) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`);
      const data = await response.json();

      if (data.result === 'success') {
        setRates(data.rates);
        const rate = data.rates[toCurrency];
        if (rate) {
          setResult((parseFloat(amount) * rate).toFixed(2));
          setLastUpdated(data.time_last_update_utc);
        } else {
          setError(`Rate not found for ${toCurrency}`);
        }
      } else {
        setError('Failed to fetch rates. Please try again.');
      }
    } catch (err) {
      setError('Network error or API issues.');
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    if (result) {
      setResult(null); // Reset result on swap to encourage re-calculation or lazy fetch
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gradient-to-br from-gray-50 via-gray-100 to-emerald-50/20 dark:from-neutral-950 dark:via-neutral-900 dark:to-emerald-950/10 flex items-center justify-center">
      <div className="max-w-md w-full">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-cyan-500 dark:from-emerald-400 dark:to-cyan-400 mb-2">
            Currency Converter 💱
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Fetch live exchange rates on demand
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 dark:bg-black/80 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl p-6 relative overflow-hidden"
        >
          {/* Subtle Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 -z-10" />

          <div className="space-y-6">
            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
                Amount
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-gray-900 dark:text-white font-medium"
                  placeholder="1.00"
                />
              </div>
            </div>

            {/* Currency Selectors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
                  From
                </label>
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="w-full p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-gray-900 dark:text-white font-medium cursor-pointer"
                >
                  {COMMON_CURRENCIES.map(curr => (
                    <option key={curr} value={curr} className="text-black">{curr}</option>
                  ))}
                </select>
              </div>

              {/* Swap Button */}
              <button
                onClick={handleSwap}
                className="self-center p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20 transition-all flex items-center justify-center"
                title="Swap Currencies"
              >
                <ArrowRightLeft className="h-5 w-5 rotate-90 md:rotate-0" />
              </button>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
                  To
                </label>
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="w-full p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-gray-900 dark:text-white font-medium cursor-pointer"
                >
                  {COMMON_CURRENCIES.map(curr => (
                    <option key={curr} value={curr} className="text-black">{curr}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-500 text-sm bg-red-500/10 p-3 rounded-xl border border-red-500/20 text-center"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Convert Button */}
            <button
              onClick={handleConvert}
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-90 rounded-xl text-white font-bold flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <span>Convert</span>
                </>
              )}
            </button>

            {/* Result Display */}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, opacity: 0 }}
                  className="mt-4 p-5 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-2xl border border-emerald-500/20 text-center"
                >
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
                    {amount} {fromCurrency} =
                  </p>
                  <p className="text-4xl font-extrabold text-emerald-500">
                    {result} <span className="text-xl font-bold">{toCurrency}</span>
                  </p>
                  {lastUpdated && (
                    <p className="text-xs text-gray-400 mt-2">
                      Rates updated: {new Date(lastUpdated).toLocaleDateString()}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Disclaimer / Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 flex items-start space-x-2 bg-white/50 dark:bg-black/30 backdrop-blur-md p-3 rounded-xl border border-gray-200/50 dark:border-white/5"
        >
          <HelpCircle className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Rates are fetched live on demand using open ER-API and are provided for informational purposes only. Frequency of updates may vary.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
