import React, { useState } from 'react';
import { UserProfile } from '../types';

interface AdminProps {
  t: (key: string) => string;
}

// Mock users for admin view
const MOCK_USERS_LIST = [
    { id: '1', name: 'Alex Developer', email: 'alex@technova.io', role: 'Admin', status: 'Active' },
    { id: '2', name: 'Sarah Content', email: 'sarah@bloggers.com', role: 'User', status: 'Active' },
    { id: '3', name: 'John Doe', email: 'john@doe.com', role: 'User', status: 'Inactive' },
];

export const Admin: React.FC<AdminProps> = ({ t }) => {
  const [users, setUsers] = useState(MOCK_USERS_LIST);

  const toggleStatus = (id: string) => {
      setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u));
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-10">
        <h2 className="text-3xl font-bold tracking-tight mb-2 text-gray-900 dark:text-white">{t('admin_title')}</h2>
        <p className="text-gray-500 dark:text-gray-400">Manage system users and view platform statistics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white dark:bg-mag-surface p-6 rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm">
              <div className="text-gray-500 text-sm font-bold uppercase mb-2">Total Users</div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">1,248</div>
          </div>
          <div className="bg-white dark:bg-mag-surface p-6 rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm">
              <div className="text-gray-500 text-sm font-bold uppercase mb-2">Ideas Generated</div>
              <div className="text-3xl font-bold text-mag-orange">85,402</div>
          </div>
           <div className="bg-white dark:bg-mag-surface p-6 rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm">
              <div className="text-gray-500 text-sm font-bold uppercase mb-2">Webhook Calls</div>
              <div className="text-3xl font-bold text-mag-red">12,200</div>
          </div>
      </div>

      <div className="bg-white dark:bg-mag-surface rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-white/5">
            <h3 className="text-lg font-bold">{t('admin_users_list')}</h3>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-black/20">
                    <tr>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">{t('col_user')}</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">{t('col_role')}</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">{t('col_status')}</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">{t('col_actions')}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                    {users.map(u => (
                        <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition">
                            <td className="px-6 py-4">
                                <div className="font-bold text-gray-900 dark:text-white">{u.name}</div>
                                <div className="text-xs text-gray-500">{u.email}</div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-white/10 rounded text-xs font-bold">{u.role}</span>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${u.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                <span className="text-sm">{u.status === 'Active' ? t('status_active') : t('status_inactive')}</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button 
                                    onClick={() => toggleStatus(u.id)}
                                    className={`text-xs font-bold px-3 py-1 rounded border transition ${
                                        u.status === 'Active' 
                                        ? 'border-red-200 text-red-500 hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-900/20' 
                                        : 'border-green-200 text-green-500 hover:bg-green-50 dark:border-green-900/30 dark:hover:bg-green-900/20'
                                    }`}
                                >
                                    {u.status === 'Active' ? t('btn_deactivate') : t('btn_activate')}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};
