
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './contexts/AppContext';
import Layout from './components/Layout';
import MiningPage from './pages/MiningPage';
import BoostersPage from './pages/BoostersPage';
import InvitePage from './pages/InvitePage';
import PaymentModal from './components/PaymentModal';
import WithdrawModal from './components/WithdrawModal';
import WithdrawQueuedModal from './components/WithdrawQueuedModal';

const ClockIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

const PaymentSubmittedModal = () => {
  const { showPaymentSubmittedModal, hidePaymentSubmittedModal } = useAppContext();

  if (!showPaymentSubmittedModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-mono">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl shadow-cyan-500/20 w-full max-w-sm p-6 text-center text-white animate-fade-in">
        <div className="flex flex-col items-center">
            <ClockIcon className="w-16 h-16 text-cyan-400 mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Платеж в обработке</h2>
            <p className="text-gray-400 mb-6">
              Ваш платеж отправлен на проверку. Бустер будет активирован после подтверждения.
            </p>
            <button
                onClick={hidePaymentSubmittedModal}
                className="w-full bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-cyan-700 transition-colors"
            >
                Понятно
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


function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/mining" replace />} />
            <Route path="/mining" element={<MiningPage />} />
            <Route path="/boosters" element={<BoostersPage />} />
            <Route path="/invite" element={<InvitePage />} />
          </Routes>
        </Layout>
        <PaymentModal />
        <PaymentSubmittedModal />
        <WithdrawModal />
        <WithdrawQueuedModal />
      </HashRouter>
    </AppProvider>
  );
}

export default App;