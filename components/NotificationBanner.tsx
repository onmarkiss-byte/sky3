import React, { useState, useEffect, useRef } from 'react';

// Helper function to generate random data
const generateRandomNotification = () => {
    const userId = Math.floor(100000000 + Math.random() * 900000000); // Generate a full 9-digit user ID
    const amount = (Math.random() * (1700 - 211) + 211).toFixed(2);
    return `Пользователь ID ${userId} только что вывел ${amount} USDT`;
};

const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

const NotificationBanner = () => {
    const [notification, setNotification] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const timeoutRef = useRef<number | null>(null);

    useEffect(() => {
        const scheduleNotification = () => {
            const minDelay = 5 * 1000; // 5 seconds
            const maxDelay = 3 * 60 * 1000; // 3 minutes
            const randomDelay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;

            timeoutRef.current = window.setTimeout(() => {
                setNotification(generateRandomNotification());
                setIsVisible(true);

                // Hide after 7 seconds and then schedule the next one
                timeoutRef.current = window.setTimeout(() => {
                    setIsVisible(false);
                    scheduleNotification(); // Schedule the next one to appear
                }, 7000); // Visible for 7 seconds

            }, randomDelay);
        };

        scheduleNotification(); // Initial call

        return () => {
            // Cleanup on unmount
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <div 
            className={`
                fixed top-4 left-1/2 -translate-x-1/2
                w-[calc(100%-2rem)] max-w-sm
                bg-gray-800/70 backdrop-blur-md 
                border border-cyan-500/30 rounded-xl 
                shadow-lg shadow-cyan-500/10
                p-3 flex items-center space-x-3 
                overflow-hidden z-40
                transition-all duration-500 ease-in-out
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-16 pointer-events-none'}
            `}
        >
             <CheckCircleIcon className="w-6 h-6 text-green-400 flex-shrink-0" />
             <div className="overflow-hidden w-full">
                <p className="text-sm text-white whitespace-nowrap animate-marquee">
                    {notification}
                </p>
             </div>
             <style>{`
                @keyframes marquee {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-120%); }
                }
                .animate-marquee {
                    animation: marquee 10s linear infinite;
                    animation-delay: 0.5s;
                }
             `}</style>
        </div>
    );
};

export default NotificationBanner;
