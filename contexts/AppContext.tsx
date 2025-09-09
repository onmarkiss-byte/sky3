import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { INITIAL_MINING_RATE, BOOSTERS, REFERRAL_BONUS_PER_MINUTE } from '../constants';
import type { Booster, ReferredUser, WithdrawalRequest, WithdrawalRecord } from '../types';

// Объявляем глобальный тип для объекта Telegram Web App
declare global {
  interface Window {
    Telegram?: {
      WebApp: any;
    };
  }
}

interface MiningHistoryPoint {
    timestamp: number;
    balance: number;
}

// Определяем форму объекта состояния, который будет храниться в localStorage
interface StoredState {
  balance: number;
  miningRate: number;
  referredUsers: ReferredUser[];
  lastVisitTimestamp: number;
  pendingBoosters: Booster[];
  purchasedBoosterIds: number[];
  withdrawalHistory: WithdrawalRecord[];
  miningHistory: MiningHistoryPoint[];
}

// Вспомогательная функция для получения уникального ID пользователя из Telegram
// или возврата 'dev-user' для локальной разработки.
const getUserId = (): string => {
  try {
    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.user && window.Telegram.WebApp.initDataUnsafe.user.id) {
        return window.Telegram.WebApp.initDataUnsafe.user.id.toString();
    }
  } catch (e) {
      console.error("Не удалось получить ID пользователя Telegram", e);
  }
  
  console.warn("Контекст пользователя Telegram не найден. Используется ID по умолчанию для разработки. Данные будут привязаны к текущей сессии браузера.");
  return 'dev-user';
};

const USER_ID = getUserId();
// Определяем уникальный ключ для localStorage на основе ID пользователя
const LOCAL_STORAGE_KEY = `sky-crypto-miner-state-${USER_ID}`;


interface AppContextType {
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  miningRate: number; // USDT в минуту
  applyBooster: (rateIncrease: number) => void;
  purchaseBooster: (boosterId: number) => void;
  boosterForPayment: Booster | null;
  closePaymentModal: () => void;
  submitPaymentForApproval: () => void;
  showPaymentSubmittedModal: boolean;
  hidePaymentSubmittedModal: () => void;
  account: string | null;
  connectWallet: () => void;
  disconnectWallet: () => void;
  invitedFriends: number;
  addFriend: () => void;
  pendingBoosters: Booster[];
  purchasedBoosterIds: number[];
  cancelPendingBooster: (boosterId: number) => void;
  referredUsers: ReferredUser[];
  showWithdrawModal: boolean;
  openWithdrawModal: () => void;
  closeWithdrawModal: () => void;
  showWithdrawQueuedModal: boolean;
  hideWithdrawQueuedModal: () => void;
  submitWithdrawal: (request: WithdrawalRequest) => void;
  withdrawalHistory: WithdrawalRecord[];
  cancelWithdrawal: (withdrawalId: string) => void;
  miningHistory: MiningHistoryPoint[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Функция для загрузки состояния из localStorage и расчета офлайн-заработка
const loadInitialState = (): { 
    balance: number; 
    miningRate: number; 
    referredUsers: ReferredUser[], 
    pendingBoosters: Booster[], 
    purchasedBoosterIds: number[], 
    withdrawalHistory: WithdrawalRecord[],
    miningHistory: MiningHistoryPoint[] 
} => {
  try {
    const savedStateJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!savedStateJSON) {
      return {
        balance: 0,
        miningRate: INITIAL_MINING_RATE,
        referredUsers: [],
        pendingBoosters: [],
        purchasedBoosterIds: [],
        withdrawalHistory: [],
        miningHistory: [],
      };
    }

    const savedState: StoredState = JSON.parse(savedStateJSON);

    // Рассчитываем заработок, накопленный во время закрытия приложения
    const now = Date.now();
    const timeDiffMs = now - savedState.lastVisitTimestamp;
    const minutesPassed = Math.max(0, timeDiffMs / (1000 * 60));
    const earnedOffline = minutesPassed * savedState.miningRate;
    
    const initialBalance = savedState.balance + earnedOffline;

    // Загружаем и фильтруем историю майнинга
    const twentyFourHoursAgo = now - (24 * 60 * 60 * 1000);
    let initialHistory = (savedState.miningHistory || []).filter(p => p.timestamp >= twentyFourHoursAgo);
    
    // Добавляем точку для текущего рассчитанного баланса, если был офлайн-прогресс
    if (minutesPassed > 1 && initialHistory.length > 0) {
        initialHistory.push({ timestamp: now, balance: initialBalance });
    }

    return {
      balance: initialBalance,
      miningRate: savedState.miningRate,
      referredUsers: savedState.referredUsers || [],
      pendingBoosters: savedState.pendingBoosters || [],
      purchasedBoosterIds: savedState.purchasedBoosterIds || [],
      withdrawalHistory: savedState.withdrawalHistory || [],
      miningHistory: initialHistory,
    };
  } catch (error) {
    console.error("Не удалось загрузить состояние из localStorage, состояние сброшено.", error);
    // Возврат к состоянию по умолчанию в случае ошибки (например, поврежденные данные)
    return {
      balance: 0,
      miningRate: INITIAL_MINING_RATE,
      referredUsers: [],
      pendingBoosters: [],
      purchasedBoosterIds: [],
      withdrawalHistory: [],
      miningHistory: [],
    };
  }
};


export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Инициализируем состояние один раз, вызвав функцию загрузки
  const [initialState] = useState(loadInitialState);

  const [balance, setBalance] = useState<number>(initialState.balance);
  const [miningRate, setMiningRate] = useState<number>(initialState.miningRate);
  const [referredUsers, setReferredUsers] = useState<ReferredUser[]>(initialState.referredUsers);
  const [pendingBoosters, setPendingBoosters] = useState<Booster[]>(initialState.pendingBoosters);
  const [purchasedBoosterIds, setPurchasedBoosterIds] = useState<number[]>(initialState.purchasedBoosterIds);
  const [withdrawalHistory, setWithdrawalHistory] = useState<WithdrawalRecord[]>(initialState.withdrawalHistory);
  const [miningHistory, setMiningHistory] = useState<MiningHistoryPoint[]>(initialState.miningHistory);
  
  const [boosterForPayment, setBoosterForPayment] = useState<Booster | null>(null);
  const [showPaymentSubmittedModal, setShowPaymentSubmittedModal] = useState(false);
  const [account, setAccount] = useState<string | null>(null);

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showWithdrawQueuedModal, setShowWithdrawQueuedModal] = useState(false);
  
  const balanceRef = useRef(balance);
  useEffect(() => {
    balanceRef.current = balance;
  }, [balance]);

  // Эффект для инициализации Telegram Web App
  useEffect(() => {
    try {
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.ready();
        }
    } catch (e) {
        console.error("Не удалось инициализировать Telegram Web App", e);
    }
  }, []);
  
  // Эффект для сохранения состояния в localStorage при изменении ключевых значений
  useEffect(() => {
    const stateToSave: StoredState = {
      balance,
      miningRate,
      referredUsers,
      lastVisitTimestamp: Date.now(),
      pendingBoosters,
      purchasedBoosterIds,
      withdrawalHistory,
      miningHistory,
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
  }, [balance, miningRate, referredUsers, pendingBoosters, purchasedBoosterIds, withdrawalHistory, miningHistory]);
  
  // Эффект для обновления истории майнинга
  useEffect(() => {
    if (miningHistory.length === 0) {
        setMiningHistory([{ timestamp: Date.now(), balance: balanceRef.current }]);
    }

    const interval = setInterval(() => {
        const now = Date.now();
        const twentyFourHoursAgo = now - 24 * 60 * 60 * 1000;
        
        setMiningHistory(prev => {
            const filtered = prev.filter(p => p.timestamp >= twentyFourHoursAgo);
            return [...filtered, { timestamp: now, balance: balanceRef.current }];
        });
    }, 60 * 1000); // Каждую минуту

    return () => clearInterval(interval);
  }, []); // Запускается один раз при монтировании


  const applyBooster = (rateIncrease: number) => {
    setMiningRate(prevRate => prevRate + rateIncrease);
  };

  const purchaseBooster = (boosterId: number) => {
    const booster = BOOSTERS.find(b => b.id === boosterId);
    if (booster) {
      setBoosterForPayment(booster);
    }
  };
  
  const closePaymentModal = () => {
    setBoosterForPayment(null);
  };

  const hidePaymentSubmittedModal = () => {
    setShowPaymentSubmittedModal(false);
  };

  const submitPaymentForApproval = () => {
    if (boosterForPayment) {
        setPendingBoosters(prev => [...prev, boosterForPayment]);
    }
    closePaymentModal();
    setShowPaymentSubmittedModal(true);
  };

  const cancelPendingBooster = (boosterId: number) => {
    setPendingBoosters(prev => prev.filter(b => b.id !== boosterId));
  };


  const addFriend = () => {
    // Эта функция не используется в UI, но содержит логику для добавления
    // реального реферала, когда эта функция будет реализована.
    const newUser: ReferredUser = {
      id: `TG_${Math.floor(100000000 + Math.random() * 900000000)}`,
      name: `User #${Math.floor(1000 + Math.random() * 9000)}`
    };
    setReferredUsers(prevUsers => [...prevUsers, newUser]);
    setMiningRate(prevRate => prevRate + REFERRAL_BONUS_PER_MINUTE);
  };

  const connectWallet = () => {
    setAccount("0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t");
  };

  const disconnectWallet = () => {
    setAccount(null);
  };

  const openWithdrawModal = () => {
    setShowWithdrawModal(true);
  };

  const closeWithdrawModal = () => {
    setShowWithdrawModal(false);
  };
  
  const hideWithdrawQueuedModal = () => {
      setShowWithdrawQueuedModal(false);
  };

  const submitWithdrawal = (request: WithdrawalRequest) => {
    // Округляем баланс до 6 знаков после запятой, чтобы избежать проблем с плавающей точкой.
    // Это соответствует отображению на главном экране майнинга.
    const withdrawalAmount = parseFloat(balance.toFixed(6));
    
    const newWithdrawal: WithdrawalRecord = {
        id: `wd-${Date.now()}`,
        amount: withdrawalAmount,
        address: request.address,
        network: request.network,
        timestamp: Date.now(),
        status: 'В обработке'
    };

    setWithdrawalHistory(prev => [newWithdrawal, ...prev]);

    console.log('Запрос на вывод:', request, 'Сумма:', withdrawalAmount);
    // Для симуляции сбрасываем баланс.
    setBalance(0);
    closeWithdrawModal();
    setShowWithdrawQueuedModal(true);
  };

  const cancelWithdrawal = (withdrawalId: string) => {
    const withdrawalToCancel = withdrawalHistory.find(w => w.id === withdrawalId);
    if (withdrawalToCancel && withdrawalToCancel.status === 'В обработке') {
      setBalance(prevBalance => prevBalance + withdrawalToCancel.amount);
      setWithdrawalHistory(prevHistory => 
        prevHistory.map(w => 
          w.id === withdrawalId ? { ...w, status: 'Отменено' } : w
        )
      );
    }
  };

  return (
    <AppContext.Provider value={{
      balance,
      setBalance,
      miningRate,
      applyBooster,
      purchaseBooster,
      boosterForPayment,
      closePaymentModal,
      submitPaymentForApproval,
      showPaymentSubmittedModal,
      hidePaymentSubmittedModal,
      account,
      connectWallet,
      disconnectWallet,
      invitedFriends: referredUsers.length,
      addFriend,
      pendingBoosters,
      purchasedBoosterIds,
      cancelPendingBooster,
      referredUsers,
      showWithdrawModal,
      openWithdrawModal,
      closeWithdrawModal,
      showWithdrawQueuedModal,
      hideWithdrawQueuedModal,
      submitWithdrawal,
      withdrawalHistory,
      cancelWithdrawal,
      miningHistory,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};