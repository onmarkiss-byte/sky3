import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useMining } from '../hooks/useMining';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const USDTIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        fill="currentColor"
        {...props}
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32ZM13.0645 10.8258H18.9355V13.7581H22.5V16.6903H18.9355V22H13.0645V16.6903H9.5V13.7581H13.0645V10.8258Z"
        />
    </svg>
);

const MiningChart = () => {
    const { miningHistory } = useAppContext();

    if (miningHistory.length < 2) {
        return (
            <div className="flex items-center justify-center h-full bg-gray-800/50 rounded-xl border border-gray-700">
                <p className="text-gray-500">Сбор данных для графика...</p>
            </div>
        );
    }

    const data = miningHistory.map(point => ({
        ...point,
        balance: Number(point.balance.toFixed(6)) 
    }));

    const formatXAxis = (tickItem: number) => {
        return new Date(tickItem).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    }
    
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-600 p-3 rounded-lg shadow-lg">
                    <p className="text-sm text-gray-400">{new Date(label).toLocaleString('ru-RU')}</p>
                    <p className="text-lg font-bold text-cyan-400">{`${payload[0].value.toFixed(6)} USDT`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                 <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" strokeOpacity={0.3} />
                <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={formatXAxis} 
                    stroke="#a0aec0" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                    type="monotone" 
                    dataKey="balance" 
                    stroke="#06b6d4" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorBalance)" 
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}

const MiningPage = () => {
  const { balance, miningRate } = useAppContext();
  useMining();
  const [isAnimating, setIsAnimating] = useState(false);
  const prevBalanceRef = useRef(balance);

  useEffect(() => {
    // Анимируем только при увеличении баланса, чтобы избежать анимации при начальной загрузке
    if (balance > prevBalanceRef.current) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300); // Длительность должна совпадать с длительностью transition
      return () => clearTimeout(timer);
    }
    prevBalanceRef.current = balance;
  }, [balance]);

  return (
    <div className="flex flex-col items-center text-center overflow-x-hidden">
      <div className="relative w-64 h-64 flex items-center justify-center mb-8">
        <div className="absolute w-full h-full bg-cyan-500/20 rounded-full animate-ping"></div>
        <div className="absolute w-5/6 h-5/6 bg-cyan-500/30 rounded-full animate-ping" style={{animationDelay: '0.2s'}}></div>
        <div className="absolute w-3/4 h-3/4 bg-cyan-500/40 rounded-full"></div>
        <div className="absolute w-1/2 h-1/2 bg-gray-800 rounded-full border-4 border-cyan-500 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-cyan-400 animate-mining-swing" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21.7,4.3c-2-2-5.3-2-7.3,0L3.5,15.2c-0.4,0.4-0.4,1,0,1.4l4.2,4.2c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3l12.5-12.5C23.7,8.5,23.7,5.3,21.7,4.3z"/>
            </svg>
        </div>
      </div>
      
      <div className="bg-gray-900/70 backdrop-blur-md p-6 rounded-2xl border border-gray-700 shadow-2xl shadow-black/50 w-full max-w-sm">
          <p className="text-gray-400 text-lg">Текущий баланс</p>
          <div className="flex items-baseline justify-center my-2 space-x-3">
              <h2 className={`text-5xl font-bold tracking-tight transition-all duration-300 ease-out ${isAnimating ? 'text-yellow-300 scale-105' : 'text-white'}`}>
                  {balance.toFixed(6)}
              </h2>
              <div className="flex items-center space-x-1.5">
                  <USDTIcon className="h-8 w-8 text-green-500" />
                  <span className="text-3xl text-cyan-400 font-semibold">USDT</span>
              </div>
          </div>
          <div className="mt-4 text-center bg-gray-800/50 rounded-lg px-4 py-2">
            <p className="text-sm text-gray-400">Скорость майнинга</p>
            <p className="text-lg text-yellow-400 font-semibold">{(miningRate * 24 * 60).toFixed(2)} USDT/день</p>
          </div>
      </div>
      
      <div className="w-full max-w-sm mt-8">
            <h3 className="text-lg font-bold text-gray-300 mb-4 text-left">История добычи</h3>
            <div className="h-48">
                <MiningChart />
            </div>
      </div>
      <style>{`
        @keyframes mining-swing {
            0% { transform: rotate(15deg); }
            70% { transform: rotate(-35deg); }
            100% { transform: rotate(15deg); }
        }
        .animate-mining-swing {
            animation: mining-swing 0.8s ease-in-out infinite;
            transform-origin: 75% 75%;
        }
      `}</style>
    </div>
  );
};

export default MiningPage;