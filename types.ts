// Fix: Import React to use React.ReactNode type.
import type React from 'react';

export interface Booster {
  id: number;
  name: string;
  description: string;
  price: number; // Цена в USDT для симуляции
  rateIncrease: number; // Увеличение скорости в USDT в минуту
  icon: React.ReactNode;
  purchased?: boolean; // Добавлено для отслеживания купленных бустеров
}

export interface ReferredUser {
    id: string;
    name: string;
}

export interface WithdrawalRequest {
    network: 'TRC20' | 'BEP20';
    address: string;
}

export interface WithdrawalRecord {
  id: string;
  amount: number;
  address: string;
  network: 'TRC20' | 'BEP20';
  timestamp: number;
  status: 'В обработке' | 'Выполнено' | 'Отклонено' | 'Отменено';
}