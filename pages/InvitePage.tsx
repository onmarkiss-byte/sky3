
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { REFERRAL_BONUS_PER_DAY } from '../constants';
import type { WithdrawalRecord } from '../types';

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

const XCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

const getStatusClass = (status: WithdrawalRecord['status']) => {
    switch (status) {
        case 'В обработке':
            return 'text-yellow-300 bg-yellow-900/50';
        case 'Выполнено':
            return 'text-green-300 bg-green-900/50';
        case 'Отклонено':
            return 'text-red-300 bg-red-900/50';
        case 'Отменено':
            return 'text-gray-300 bg-gray-700/50';
        default:
            return 'text-gray-400 bg-gray-800/50';
    }
};


const InvitePage = () => {
    const { invitedFriends, referredUsers, balance, openWithdrawModal, withdrawalHistory, cancelWithdrawal, referralLink } = useAppContext();
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };
    
    const bonusRate = invitedFriends * REFERRAL_BONUS_PER_DAY;

    return (
        <div className="text-center">
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-white">Пригласить друзей</h2>
                <p className="text-gray-400 mt-2">Получайте <span className="text-yellow-400 font-bold">1 USDT/неделя</span> за каждого присоединившегося друга!</p>
            </div>
            
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center backdrop-blur-sm shadow-lg">
                <div className="w-full">
                    <p className="text-gray-400 text-sm mb-2">Ваша пригласительная ссылка:</p>
                    <div 
                        className="bg-gray-900 border border-gray-600 rounded-lg p-3 flex items-center justify-between cursor-pointer hover:bg-gray-700/50 transition-colors"
                        onClick={handleCopy}
                    >
                        <span className="text-sm break-all mr-2 text-cyan-300">{referralLink}</span>
                        <button className="flex-shrink-0">
                           {isCopied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <CopyIcon className="w-5 h-5 text-gray-400" />}
                        </button>
                    </div>
                    {isCopied && <p className="text-green-400 text-xs mt-2">Ссылка скопирована в буфер обмена!</p>}
                </div>

                <div className="w-full mt-8 grid grid-cols-2 gap-4 text-center">
                    <div className="bg-gray-900/70 p-4 rounded-lg border border-gray-700">
                        <p className="text-sm text-gray-400">Приглашено друзей</p>
                        <p className="text-2xl font-bold text-white">{invitedFriends}</p>
                    </div>
                    <div className="bg-gray-900/70 p-4 rounded-lg border border-gray-700">
                        <p className="text-sm text-gray-400">Бонусная скорость</p>
                        <p className="text-2xl font-bold text-yellow-400">+{bonusRate.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">USDT/день</p>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                 <button
                    onClick={openWithdrawModal}
                    className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                    Вывод баланса
                </button>
                <p className="text-xs text-gray-500 mt-2">
                    Ваш текущий баланс: {balance.toFixed(2)} USDT
                </p>
            </div>
            
            <div className="mt-8">
                <h3 className="text-xl font-bold text-white text-left mb-4">История выводов</h3>
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 backdrop-blur-sm shadow-lg">
                    {withdrawalHistory.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-400 uppercase border-b border-gray-600">
                                    <tr>
                                        <th scope="col" className="px-4 py-3">Дата и время</th>
                                        <th scope="col" className="px-4 py-3">Сумма</th>
                                        <th scope="col" className="px-4 py-3">Адрес</th>
                                        <th scope="col" className="px-4 py-3">Сеть</th>
                                        <th scope="col" className="px-4 py-3">Статус</th>
                                        <th scope="col" className="px-4 py-3 text-center">Действия</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {withdrawalHistory.map((record) => (
                                        <tr key={record.id} className="border-b border-gray-700 last:border-b-0 hover:bg-gray-900/50">
                                            <td className="px-4 py-4 whitespace-nowrap">{new Date(record.timestamp).toLocaleString()}</td>
                                            <td className="px-4 py-4 font-medium text-white">{record.amount.toFixed(2)} USDT</td>
                                            <td className="px-4 py-4 font-mono text-cyan-300" title={record.address}>
                                                {`${record.address.substring(0, 6)}...${record.address.substring(record.address.length - 4)}`}
                                            </td>
                                            <td className="px-4 py-4">{record.network}</td>
                                            <td className="px-4 py-4">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(record.status)}`}>
                                                    {record.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                {record.status === 'В обработке' && (
                                                    <button
                                                        onClick={() => cancelWithdrawal(record.id)}
                                                        className="text-red-500 hover:text-red-400"
                                                        title="Отменить вывод"
                                                    >
                                                        <XCircleIcon className="w-6 h-6" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center">
                            <p className="text-gray-500 text-center py-4">У вас еще не было выводов.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8">
                <h3 className="text-xl font-bold text-white text-left mb-4">Ваши приглашенные</h3>
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 backdrop-blur-sm shadow-lg">
                    {referredUsers.length > 0 ? (
                        <ul className="space-y-3">
                            {referredUsers.map((user, index) => (
                                <li key={index} className="flex justify-between items-center bg-gray-900/50 p-3 rounded-lg">
                                    <div>
                                        <p className="font-semibold text-white text-left">{user.name}</p>
                                        <p className="text-xs text-gray-400 text-left">{user.id}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex items-center justify-center">
                            <p className="text-gray-500 text-center py-4">У вас пока нету приглашенных.</p>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default InvitePage;