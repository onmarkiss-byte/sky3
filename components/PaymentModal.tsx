
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useCountdown } from '../hooks/useCountdown';
import { PAYMENT_WALLET_ADDRESS, PAYMENT_TIMER_DURATION } from '../constants';

const QrCodePlaceholder = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 256 256" {...props}>
        <path fill="#fff" d="M0 0h256v256H0z"/>
        <path fill="#000" d="M32 32h64v64H32zm128 0h64v64h-64zM32 160h64v64H32zm168 8h16v16h-16zm-8 8h16v16h-16zm-8 8h16v16h-16zm-8 8h16v16h-16zm-24-8h16v16h-16zm-8-8h16v16h-16zm-8-8h16v16h-16zm8-8h16v16h-16zm-24 8h16v16h-16zm-8 8h16v16h-16zm-8 8h16v16h-16zm8-8h16v16h-16zm-24 8h16v16h-16zm-8-8h16v16h-16zm-8-8h16v16h-16zm-8-8h16v16h-16zm-8 32h16v16h-16zm8-8h16v16h-16zm-8-8h16v16h-16zm-8-8h16v16h-16zm0-8h16v16h-16zm-8 32h16v16h-16zm8-8h16v16h-16zm-8-8h16v16h-16zm-8-8h16v16h-16zm-8-8h16v16h-16zm0-8h16v16h-16zm8-8h16v16h-16zm-8-8h16v16h-16zm8 40h16v16h-16zm8 8h16v16h-16zm8 8h16v16h-16zm-40-40h16v16h-16zm-8 8h16v16h-16zm8 8h16v16h-16zm-16-16h16v16h-16zm8-8h16v16h-16zm-8-8h16v16h-16zm-8 8h16v16h-16zm-16-8h16v16h-16zm-8 24h16v16h-16zm-8-8h16v16h-16zm0-8h16v16h-16zm-8-8h16v16h-16zm40 8h16v16h-16zm-8-8h16v16h-16zm-8-8h16v16h-16zm24 32h16v16h-16zm-8-8h16v16h-16zm-8-8h16v16h-16zm-8-8h16v16h-16zm-8-8h16v16h-16zm40 8h16v16h-16zm-8-8h16v16h-16zm-8 24h16v16h-16zm-8-8h16v16h-16zm-8-8h16v16h-16zm-8-8h16v16h-16zm40-16h16v16h-16zm-8 8h16v16h-16zm-8-8h16v16h-16zm-8 8h16v16h-16zm-8-8h16v16h-16zm0-8h16v16h-16zm8-8h16v16h-16zM56 56h16v16H56zm128 0h16v16h-16zM56 184h16v16H56z"/>
    </svg>
);

const CopyIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
    </svg>
);

const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
);


const PaymentModal = () => {
  const { boosterForPayment, closePaymentModal, submitPaymentForApproval } = useAppContext();
  const [isCopied, setIsCopied] = useState(false);
  const timeLeft = useCountdown(PAYMENT_TIMER_DURATION, closePaymentModal);

  if (!boosterForPayment) {
    return null;
  }
  
  const handleCopy = () => {
    navigator.clipboard.writeText(PAYMENT_WALLET_ADDRESS);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-mono">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl shadow-purple-500/20 w-full max-w-sm p-6 text-center text-white animate-fade-in">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-cyan-400">Завершите платеж</h2>
            <button onClick={closePaymentModal} className="text-gray-500 hover:text-white">&times;</button>
        </div>

        <p className="text-gray-400 mb-1">Вы покупаете:</p>
        <p className="text-2xl font-bold text-white mb-4">{boosterForPayment.name}</p>

        <p className="mb-2">Отправьте ровно <strong className="text-yellow-400">{boosterForPayment.price} USDT</strong></p>
        
        <div className="bg-white p-2 rounded-lg inline-block my-4">
            <QrCodePlaceholder className="w-48 h-48" />
        </div>
        
        <p className="text-gray-400 text-sm mb-2">На этот адрес:</p>
        <div 
            onClick={handleCopy}
            className="bg-gray-800 border border-gray-600 rounded-lg p-3 flex items-center justify-between cursor-pointer hover:bg-gray-700 transition-colors"
        >
            <span className="text-xs break-all mr-2">{PAYMENT_WALLET_ADDRESS}</span>
            {isCopied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <CopyIcon className="w-5 h-5 text-gray-400" />}
        </div>
        {isCopied && <p className="text-green-400 text-xs mt-1">Адрес скопирован!</p>}
        
        <div className="mt-6 bg-red-500/20 border border-red-500/50 rounded-lg px-4 py-2">
            <p className="text-sm text-red-300">Осталось времени для оплаты:</p>
            <p className="text-lg font-bold text-white">{timeLeft}</p>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
                onClick={submitPaymentForApproval}
                className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
                Оплатил(а)
            </button>
            <button
                onClick={closePaymentModal}
                className="w-full bg-gray-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
                Отмена
            </button>
        </div>

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

export default PaymentModal;