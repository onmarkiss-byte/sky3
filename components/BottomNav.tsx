
import React from 'react';
import { NavLink } from 'react-router-dom';

const MiningIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M21.7,4.3c-2-2-5.3-2-7.3,0L3.5,15.2c-0.4,0.4-0.4,1,0,1.4l4.2,4.2c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3l12.5-12.5C23.7,8.5,23.7,5.3,21.7,4.3z"/>
    </svg>
);

const LightningIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
    </svg>
);

const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 19.5v-8.25M12 4.5v15m0 0l-3.75-3.75M12 19.5l3.75-3.75M21 8.25H3.75c-.621 0-1.125-.504-1.125-1.125V6.375c0-.621.504-1.125 1.125-1.125h16.5c.621 0 1.125.504 1.125 1.125v.75c0 .621-.504 1.125-1.125 1.125z" />
    </svg>
);


const BottomNav = () => {
    const activeLink = 'text-cyan-400';
    const inactiveLink = 'text-gray-500 hover:text-cyan-300';
    
    return (
        <nav className="bg-gray-900/50 backdrop-blur-sm border-t border-gray-700">
            <div className="max-w-md mx-auto flex justify-around p-2">
                <NavLink to="/mining" className={({ isActive }) => `flex flex-col items-center justify-center w-full p-2 rounded-lg transition-colors duration-300 ${isActive ? activeLink : inactiveLink}`}>
                    {/* Fix: Use NavLink's children as a render prop to pass the `isActive` state down. */}
                    {({ isActive }) => (
                        <>
                            <MiningIcon className={`h-6 w-6 mb-1 ${isActive ? 'animate-spin' : ''}`} style={isActive ? { animationDuration: '2s' } : undefined} />
                            <span className="text-xs font-medium">Майнинг</span>
                        </>
                    )}
                </NavLink>
                <NavLink to="/boosters" className={({ isActive }) => `flex flex-col items-center justify-center w-full p-2 rounded-lg transition-colors duration-300 ${isActive ? activeLink : inactiveLink}`}>
                    <LightningIcon className="h-6 w-6 mb-1"/>
                    <span className="text-xs font-medium">Бустеры</span>
                </NavLink>
                <NavLink to="/invite" className={({ isActive }) => `flex flex-col items-center justify-center w-full p-2 rounded-lg transition-colors duration-300 ${isActive ? activeLink : inactiveLink}`}>
                    <UsersIcon className="h-6 w-6 mb-1"/>
                    <span className="text-xs font-medium">Пригласить</span>
                </NavLink>
            </div>
        </nav>
    );
};

export default BottomNav;