
import React from 'react';
import type { Booster } from './types';

// IMPORTANT: Replace with your actual ETH wallet address.
export const PAYMENT_WALLET_ADDRESS = "0x1234567890123456789012345678901234567890";
// Payment window timeout in seconds (30 minutes)
export const PAYMENT_TIMER_DURATION = 30 * 60;

const ZapIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
  </svg>
);

const RocketIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.82m5.84-2.56a6 6 0 0 0-7.38-5.84m2.56 5.84L6.16 20.23m11.12-11.12L13.84 6.16M15.59 14.37l-2.56-2.56" />
  </svg>
);

const CpuChipIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 21v-1.5M15.75 3v1.5M19.5 8.25h1.5m-1.5 3.75h1.5m-1.5 3.75h1.5M15.75 21v-1.5M12 4.5v15" />
  </svg>
);

export const INITIAL_MINING_RATE = 1 / (24 * 60); // 1 USDT per day

export const REFERRAL_BONUS_PER_WEEK = 1; // 1 USDT per week per friend
export const REFERRAL_BONUS_PER_DAY = REFERRAL_BONUS_PER_WEEK / 7;
export const REFERRAL_BONUS_PER_MINUTE = REFERRAL_BONUS_PER_DAY / (24 * 60);
export const REFERRAL_LINK = "https://t.me/SkyCryptoBot?start=REF_123XYZ";

export const BOOSTERS: Booster[] = [
  {
    id: 1,
    name: 'Квантовый буст',
    description: 'Начальное ускорение для вашего майнинга.',
    price: 20,
    rateIncrease: 10 / (24 * 60), // +10 USDT/день
    icon: <CpuChipIcon className="h-8 w-8 text-cyan-400" />,
  },
  {
    id: 2,
    name: 'Плазменный заряд',
    description: 'Значительно увеличивает скорость добычи.',
    price: 100,
    rateIncrease: 50 / (24 * 60), // +50 USDT/день
    icon: <ZapIcon className="h-8 w-8 text-yellow-400" />,
  },
  {
    id: 3,
    name: 'Гипердрайв',
    description: 'Максимальное ускорение для серьезного дохода.',
    price: 200,
    rateIncrease: 100 / (24 * 60), // +100 USDT/день
    icon: <RocketIcon className="h-8 w-8 text-purple-400" />,
  },
];