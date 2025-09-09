import React from 'react';
import BottomNav from './BottomNav';
import NotificationBanner from './NotificationBanner';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="bg-gray-900 text-white h-screen font-mono flex flex-col w-full max-w-md mx-auto relative overflow-hidden">
        <NotificationBanner />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900 via-black to-blue-900/40 z-0"></div>
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-radial from-purple-600/20 via-transparent to-transparent animate-pulse opacity-50 z-0"></div>
        
        <header className="flex justify-center items-center p-4 z-10 flex-shrink-0">
            <h1 className="text-2xl font-bold text-cyan-400 tracking-tight">Sky Crypto Miner Tether</h1>
        </header>

        <main className="flex-grow flex flex-col p-4 z-10 overflow-y-auto">
            {children}
        </main>

        <footer className="z-10 flex-shrink-0">
            <BottomNav />
        </footer>
    </div>
  );
};

export default Layout;