import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';

const WithdrawModal = () => {
  const { showWithdrawModal, closeWithdrawModal, submitWithdrawal, balance } = useAppContext();
  // Fix: Explicitly type the network state to ensure it matches the expected 'TRC20' | 'BEP20' union type.
  const [network, setNetwork] = useState<'TRC20' | 'BEP20'>('TRC20');
  const [address, setAddress] = useState('');

  if (!showWithdrawModal) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) {
      submitWithdrawal({ network, address });
      setAddress(''); // Reset for next time
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-mono">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl shadow-cyan-500/20 w-full max-w-sm p-6 text-white animate-fade-in">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-cyan-400">Вывод средств</h2>
            <button onClick={closeWithdrawModal} className="text-gray-500 hover:text-white text-2xl leading-none">&times;</button>
        </div>
        
        <p className="text-center text-gray-400 mb-2">Сумма к выводу:</p>
        <p className="text-center text-3xl font-bold text-white mb-6">{balance.toFixed(2)} USDT</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-400 text-sm font-bold mb-2 text-left" htmlFor="network">
              Сеть
            </label>
            <div className="flex space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer w-full">
                    <input type="radio" name="network" value="TRC20" checked={network === 'TRC20'} onChange={() => setNetwork('TRC20')} className="hidden" />
                    <div className={`w-full text-center py-2 px-4 rounded-lg border transition-colors ${network === 'TRC20' ? 'bg-cyan-600 border-cyan-500 text-white' : 'bg-gray-800 border-gray-600 hover:bg-gray-700'}`}>
                        TRC20
                    </div>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer w-full">
                    <input type="radio" name="network" value="BEP20" checked={network === 'BEP20'} onChange={() => setNetwork('BEP20')} className="hidden" />
                    <div className={`w-full text-center py-2 px-4 rounded-lg border transition-colors ${network === 'BEP20' ? 'bg-cyan-600 border-cyan-500 text-white' : 'bg-gray-800 border-gray-600 hover:bg-gray-700'}`}>
                        BEP20
                    </div>
                </label>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-400 text-sm font-bold mb-2 text-left" htmlFor="wallet-address">
              Адрес кошелька
            </label>
            <input
              id="wallet-address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Введите ваш адрес"
              className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={!address.trim()}
              className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              Вывести
            </button>
            <button
              type="button"
              onClick={closeWithdrawModal}
              className="w-full bg-gray-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Отмена
            </button>
          </div>
        </form>

      </div>
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default WithdrawModal;