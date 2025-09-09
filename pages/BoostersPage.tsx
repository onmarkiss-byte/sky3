
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { BOOSTERS } from '../constants';
import type { Booster } from '../types';

const ClockIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

const XCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

const getBoosterAnimationClass = (id: number) => {
    switch (id) {
        case 1: return 'animate-pulse-slow'; // Quantum Boost
        case 2: return 'animate-plasma-flash'; // Plasma Charge
        case 3: return 'animate-rocket-shake'; // Hyperdrive
        default: return '';
    }
};

const BoosterCard: React.FC<{ booster: Booster }> = ({ booster }) => {
  const { purchaseBooster } = useAppContext();

  const handlePurchase = () => {
    purchaseBooster(booster.id);
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 flex items-center justify-between space-x-4 backdrop-blur-sm shadow-lg hover:border-cyan-500 transition-all duration-300">
      <div className="flex items-center space-x-4">
        <div className={`bg-gray-900 p-3 rounded-lg border border-gray-600 ${getBoosterAnimationClass(booster.id)}`}>
          {booster.icon}
        </div>
        <div>
          <h3 className="font-bold text-white text-lg">{booster.name}</h3>
          <p className="text-gray-400 text-sm">+{ (booster.rateIncrease * 24 * 60).toFixed(0) } USDT/день</p>
        </div>
      </div>
      <button
        onClick={handlePurchase}
        className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center min-w-[120px]"
      >
        {`${booster.price} USDT`}
      </button>
    </div>
  );
};

const PendingBoosterCard: React.FC<{ booster: Booster, onCancel: (id: number) => void }> = ({ booster, onCancel }) => {
  return (
    <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0 sm:space-x-4 backdrop-blur-sm shadow-lg transition-all duration-300">
      <div className="flex items-center space-x-4 w-full sm:w-auto">
        <div className={`bg-gray-900 p-3 rounded-lg border border-gray-600 ${getBoosterAnimationClass(booster.id)}`}>
          {booster.icon}
        </div>
        <div className="flex-grow">
          <h3 className="font-bold text-white text-lg">{booster.name}</h3>
          <div className="flex items-center space-x-1.5 text-yellow-400">
              <ClockIcon className="w-4 h-4 animate-spin" style={{animationDuration: '3s'}}/>
              <span className="text-sm font-medium">В обработке...</span>
          </div>
        </div>
      </div>
      <button
          onClick={() => onCancel(booster.id)}
          className="w-full sm:w-auto bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
      >
         <XCircleIcon className="w-5 h-5"/>
         <span>Отмена платежа</span>
      </button>
    </div>
  );
};


const BoostersPage = () => {
  const { pendingBoosters, purchasedBoosterIds, cancelPendingBooster } = useAppContext();
  
  const availableBoosters = BOOSTERS.filter(b => 
      !purchasedBoosterIds.includes(b.id) && 
      !pendingBoosters.some(pb => pb.id === b.id)
  );

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white">Бустеры для майнинга</h2>
          <p className="text-gray-400 mt-1">Увеличьте свой хешрейт с помощью мощных улучшений.</p>
        </div>
        <div className="space-y-4 overflow-y-auto flex-grow pr-2">
          {pendingBoosters.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-yellow-400 mb-3">Ожидают подтверждения</h3>
              <div className="space-y-4">
                {pendingBoosters.map((booster) => (
                  <PendingBoosterCard key={booster.id} booster={booster} onCancel={cancelPendingBooster} />
                ))}
              </div>
            </div>
          )}
          
          {availableBoosters.length > 0 && pendingBoosters.length > 0 && <hr className="border-gray-700 my-6"/>}

          {availableBoosters.map((booster) => (
            <BoosterCard key={booster.id} booster={booster} />
          ))}
          
          {availableBoosters.length === 0 && pendingBoosters.length === 0 && (
              <p className="text-center text-gray-500 mt-8">Все доступные бустеры куплены.</p>
          )}
        </div>
      </div>
      <style>{`
          @keyframes pulse-slow {
            50% {
              box-shadow: 0 0 15px 3px rgba(6, 182, 212, 0.5);
            }
          }
          .animate-pulse-slow {
            animation: pulse-slow 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }

          @keyframes plasma-flash {
              0%, 100% { filter: drop-shadow(0 0 3px #facc15); }
              50% { filter: drop-shadow(0 0 12px #fef08a); }
          }
          .animate-plasma-flash {
              animation: plasma-flash 1.2s ease-in-out infinite;
          }

          @keyframes rocket-shake {
              0%, 100% { transform: translate(0, 0) rotate(0); }
              25% { transform: translate(1px, -1px) rotate(-2deg); }
              50% { transform: translate(-1px, 1px) rotate(1deg); }
              75% { transform: translate(1px, 1px) rotate(2deg); }
          }
          .animate-rocket-shake {
              animation: rocket-shake 0.4s ease-in-out infinite;
          }
      `}</style>
    </>
  );
};

export default BoostersPage;
