
import React from 'react';
import { useAppContext } from '../contexts/AppContext';

const WalletIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 3a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 12m15 0a2.25 2.25 0 0 0-2.25-2.25H12a2.25 2.25 0 0 0-2.25 2.25" />
  </svg>
);


const ConnectWalletButton = () => {
    const { account, connectWallet, disconnectWallet } = useAppContext();

    const formatAddress = (address: string) => {
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    }

    if (account) {
        return (
            <div className="flex items-center space-x-2 bg-gray-800/50 border border-gray-700 rounded-full px-3 py-1.5 text-sm">
                <span className="text-green-400">●</span>
                <span className="font-semibold text-gray-300">{formatAddress(account)}</span>
                <button onClick={disconnectWallet} className="text-gray-500 hover:text-red-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={connectWallet}
            className="flex items-center space-x-2 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-1.5 px-4 rounded-full transition-all duration-300 shadow-lg shadow-cyan-500/30"
        >
            <WalletIcon className="h-5 w-5"/>
            <span>Подключить</span>
        </button>
    );
};

export default ConnectWalletButton;