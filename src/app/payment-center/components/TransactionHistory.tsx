'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import Skeleton from '@/components/ui/Skeleton';

interface Transaction {
  id: string;
  type: 'received' | 'withdrawn' | 'refund' | 'fee';
  description: string;
  project: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'Secured' | 'pending_completion';
  date: string;
  method: string;
  businessPageId: string | null;
  businessPageName: string | null;
}

const TransactionHistory = ({ viewMode = 'all' }: { viewMode?: 'all' | 'freelancer' | 'business' | 'client' }) => {
  const [filter, setFilter] = useState<'all' | 'received' | 'withdrawn'>('all');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async (type: string) => {
    try {
      setLoading(true);
      const apiType = type === 'received' ? 'credit' : (type === 'withdrawn' ? 'debit' : 'all');
      const res = await fetch(`/api/wallet/transactions?type=${apiType}&limit=50&viewMode=${viewMode}`);
      const data = await res.json();
      if (data.success) {
        setTransactions(data.transactions.map((tx: any) => ({
          id: tx._id,
          type: tx.type === 'credit' ? 'received' : (tx.category === 'platform_fee' ? 'fee' : 'withdrawn'),
          description: (tx.description || '')
            .replace(/Direct payment for job/gi, 'Card/Bank/UPI Payment')
            .replace(/Wallet portion for split payment:.*/gi, 'Split Payment (Wallet)')
            .replace(/Job funded via Wallet:.*/gi, 'Wallet Payment')
            .replace(/Escrow securely deposited/gi, 'Escrow Deposit'),
          project: tx.projectTitle || (tx.category === 'milestone_release' ? 'Milestone' : (tx.category === 'platform_fee' ? 'Service Fee' : 'Payment')),
          amount: tx.type === 'credit' ? tx.amount : -tx.amount,
          status: ((tx.category === 'escrow_deposit' || tx.category === 'payment') && tx.status === 'completed') ? 'Secured' : tx.status,
          date: new Date(tx.createdAt).toISOString().split('T')[0],
          method: tx.source === 'razorpay' ? 'Card/Bank/UPI Payment' : (tx.category === 'topup' ? 'Wallet Top-up' : (tx.category === 'milestone_release' ? 'Escrow Release' : 'System')),
          businessPageId: tx.businessPageId || null,
          businessPageName: tx.businessPageName || null,
        })));
      }
    } catch (e) {
      console.error('Fetch transactions error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(filter);
  }, [filter, viewMode]);

  const filteredTransactions = transactions; // Filter is now handled by API

  const borderColors = [
    'border-l-blue-400',
    'border-l-emerald-400',
    'border-l-purple-400',
    'border-l-amber-400',
    'border-l-rose-400',
    'border-l-cyan-400',
    'border-l-indigo-400'
  ];

  const getBorderColor = (id: string | null) => {
    if (!id) return 'border-l-transparent';
    const hexSegment = id.slice(-6);
    const num = parseInt(hexSegment, 16);
    if (isNaN(num)) return borderColors[0];
    const index = num % borderColors.length;
    return borderColors[index];
  };

  const getTransactionLabel = (type: string, category: string) => {
    if (category === 'escrow_deposit') return 'Funds Secured';
    if (category === 'milestone_release') return 'Payment Released';
    if (category === 'topup') return 'Wallet Top-up';
    if (category === 'withdrawal') return 'Withdrawal';
    return category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ');
  };

  const getTransactionIcon = (category: string) => {
    switch (category) {
      case 'escrow_deposit': return 'LockClosedIcon';
      case 'milestone_release': return 'CheckCircleIcon';
      case 'topup': return 'PlusCircleIcon';
      case 'withdrawal': return 'BanknotesIcon';
      default: return 'ArrowsRightLeftIcon';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-brand-green/10 text-brand-green';
      case 'Secured':
        return 'bg-brand-blue/10 text-brand-blue';
      case 'pending':
        return 'bg-warning/10 text-warning';
      case 'failed':
        return 'bg-error/10 text-error';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'received':
        return 'ArrowDownTrayIcon';
      case 'withdrawn':
        return 'ArrowUpTrayIcon';
      case 'refund':
        return 'ArrowPathIcon';
      case 'fee':
        return 'ReceiptPercentIcon';
      default:
        return 'BanknotesIcon';
    }
  };

  const exportToCSV = () => {
    // CSV Header
    const headers = ['Date', 'Description', 'Project', 'Method', 'Status', 'Amount (INR)'];

    const escapeCSV = (value: any) => {
      if (value === null || value === undefined) return '""';
      const str = String(value);
      return `"${str.replace(/"/g, '""')}"`;
    };

    // CSV Rows
    const rows = filteredTransactions.map(tx => [
      escapeCSV(tx.date),
      escapeCSV(tx.description),
      escapeCSV(tx.project),
      escapeCSV(tx.method),
      escapeCSV(tx.status),
      tx.amount
    ]);

    // Combine headers and rows with UTF-8 BOM for Excel compatibility
    const csvContent = '\uFEFF' + [headers.map(escapeCSV).join(','), ...rows.map(r => r.join(','))].join('\n');

    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `transactions_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-6 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center space-x-4 flex-1">
                <Skeleton variant="circle" className="h-12 w-12" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </div>
              <div className="text-right space-y-2 ml-4">
                <Skeleton className="h-6 w-24 ml-auto" />
                <Skeleton className="h-4 w-20 ml-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <h2 className="text-xl font-display font-bold text-foreground">Transaction History</h2>
        <div className="flex items-center space-x-2">
          {(['all', 'received', 'withdrawn'] as const).map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-4 py-2 rounded-lg font-body font-medium text-sm transition-all duration-300 capitalize ${filter === filterType
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
            >
              {filterType}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="ClockIcon" size={40} className="text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-display font-bold text-foreground mb-2">No Transactions Yet</h2>
            <p className="text-muted-foreground font-body">Your recent transactions will appear here.</p>
          </div>
        ) : (
          filteredTransactions
            .filter(tx => tx.status !== 'pending' && tx.status !== 'pending_completion')
            .map((transaction) => (
              <div
                key={transaction.id}
                className={`flex items-center justify-between p-4 border border-y-border border-r-border rounded-lg hover:shadow-md transition-all duration-300 border-l-[4px] ${getBorderColor(transaction.businessPageId)}`}
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className={`p-3 rounded-lg ${transaction.amount > 0 ? 'bg-brand-green/10' : 'bg-muted'}`}>
                    <Icon
                      name={getTypeIcon(transaction.type) as any}
                      size={24}
                      className={transaction.amount > 0 ? 'text-brand-green' : 'text-muted-foreground'}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-body font-semibold text-foreground truncate">{transaction.project}</h3>
                      <span className={`px-2 py-1 text-xs font-body font-medium rounded ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground font-body truncate">{transaction.description}</p>
                    {transaction.businessPageName && (
                      <div className="flex items-center gap-1 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-indigo-400 flex-shrink-0">
                          <path fillRule="evenodd" d="M6 3.75A2.75 2.75 0 018.75 1h2.5A2.75 2.75 0 0114 3.75v.443c.572.055 1.14.122 1.706.2C17.053 4.582 18 5.75 18 7.07v3.469c0 1.126-.694 2.191-1.83 2.54-1.952.599-4.024.921-6.17.921s-4.219-.322-6.17-.921C2.694 12.73 2 11.665 2 10.539V7.07c0-1.32.947-2.489 2.294-2.676A41.047 41.047 0 016 4.193V3.75zm6.5 0v.325a41.122 41.122 0 00-5 0V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25zM10 10a1 1 0 00-1 1v.01a1 1 0 001 1h.01a1 1 0 001-1V11a1 1 0 00-1-1H10z" clipRule="evenodd" />
                          <path d="M3 15.055v-.684c.126.053.255.1.39.142 2.1.644 4.313.992 6.61.992 2.297 0 4.51-.348 6.61-.992.135-.041.264-.089.39-.142v.684c0 1.347-.985 2.53-2.363 2.686a41.454 41.454 0 01-9.274 0C3.985 17.585 3 16.402 3 15.055z" />
                        </svg>
                        <span className="text-xs text-indigo-500 font-medium truncate">{transaction.businessPageName}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p
                    className={`text-lg font-display font-bold ${transaction.amount > 0 ? 'text-brand-green' : 'text-foreground'
                      }`}
                  >
                    {transaction.amount > 0 ? '+' : ''}₹{Math.abs(transaction.amount).toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs text-muted-foreground font-body">{transaction.date}</p>
                </div>
              </div>
            ))
        )}
      </div>

      <div className="mt-6 flex items-center justify-between pt-4 border-t border-border">
        <button
          onClick={exportToCSV}
          className="flex items-center space-x-2 px-4 py-2 text-primary font-body font-medium hover:bg-muted rounded-lg transition-all duration-300"
        >
          <Icon name="ArrowDownTrayIcon" size={20} />
          <span>Export CSV</span>
        </button>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-body font-medium hover:bg-opacity-90 transition-all duration-300">
          <span>View All Transactions</span>
          <Icon name="ArrowRightIcon" size={20} />
        </button>
      </div>
    </div>
  );
};

export default TransactionHistory;