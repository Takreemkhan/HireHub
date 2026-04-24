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
}

const TransactionHistory = () => {
  const [filter, setFilter] = useState<'all' | 'received' | 'withdrawn'>('all');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async (type: string) => {
    try {
      setLoading(true);
      const apiType = type === 'received' ? 'credit' : (type === 'withdrawn' ? 'debit' : 'all');
      const res = await fetch(`/api/wallet/transactions?type=${apiType}&limit=50`);
      const data = await res.json();
      if (data.success) {
        setTransactions(data.transactions.map((tx: any) => ({
          id: tx._id,
          type: tx.type === 'credit' ? 'received' : (tx.category === 'platform_fee' ? 'fee' : 'withdrawn'),
          description: tx.description?.replace(/Escrow securely deposited/gi, 'Deposit') || tx.description,
          project: tx.projectTitle || (tx.category === 'milestone_release' ? 'Milestone Release' : (tx.category === 'platform_fee' ? 'Service Fee' : 'Payment')),
          amount: tx.type === 'credit' ? tx.amount : -tx.amount,
          status: (tx.category === 'escrow_deposit' && tx.status === 'completed') ? 'Secured' : tx.status,
          date: new Date(tx.createdAt).toISOString().split('T')[0],
          method: tx.category === 'topup' ? 'Wallet Top-up' : (tx.category === 'milestone_release' ? 'Escrow Release' : 'System'),
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
  }, [filter]);

  const filteredTransactions = transactions; // Filter is now handled by API

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
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-primary transition-all duration-300"
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
                      <h3 className="font-body font-semibold text-foreground truncate">{transaction.description}</h3>
                      <span className={`px-2 py-1 text-xs font-body font-medium rounded ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground font-body truncate">{transaction.project}</p>
                    <p className="text-xs text-muted-foreground font-body mt-1">{transaction.method}</p>
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