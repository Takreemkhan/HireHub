'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

const WithdrawalSection = () => {
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('bank');

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/wallet/status');
        const data = await res.json();
        if (data.success) setWalletBalance(data.wallet.balance ?? 0);
      } catch (e) {
        console.error('Wallet status error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchBalance();
  }, []);

  const availableBalance = walletBalance;
  const minimumWithdrawal = 50;

  const withdrawalMethods = [
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: 'BuildingLibraryIcon',
      fee: '0%',
      time: '2-3 business days',
      details: 'Chase Bank ****6789',
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: 'CurrencyDollarIcon',
      fee: '2%',
      time: 'Instant',
      details: 'john.doe@email.com',
    },
    {
      id: 'card',
      name: 'Debit Card',
      icon: 'CreditCardIcon',
      fee: '1.5%',
      time: '1-2 business days',
      details: 'Visa ****4242',
    },
  ];

  const handleWithdrawal = () => {
    if (!withdrawalAmount || parseFloat(withdrawalAmount) < minimumWithdrawal) {
      return;
    }
    // Handle withdrawal logic
  };

  if (loading) {
    return (
      <div className="bg-card rounded-xl p-6 border border-border animate-pulse">
        <div className="h-6 bg-muted rounded w-48 mb-6"></div>
        <div className="space-y-4">
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-48 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <h2 className="text-xl font-display font-bold text-foreground mb-6">Withdraw Funds</h2>

      <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 text-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 font-body text-sm mb-1">Available Balance</p>
            <h3 className="text-3xl font-display font-bold">₹{availableBalance.toLocaleString('en-IN')}</h3>
          </div>
          <div className="p-4 bg-white/20 rounded-lg">
            <Icon name="BanknotesIcon" size={32} />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-body font-semibold text-foreground mb-2">Withdrawal Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-body text-lg">₹</span>
            <input
              type="number"
              value={withdrawalAmount}
              onChange={(e) => setWithdrawalAmount(e.target.value)}
              placeholder="0.00"
              min={minimumWithdrawal}
              max={availableBalance}
              className="w-full pl-8 pr-4 py-3 border border-border rounded-lg font-body text-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <p className="text-sm text-muted-foreground font-body mt-2">
            Minimum withdrawal: ₹{minimumWithdrawal.toLocaleString('en-IN')} • Maximum: ₹{availableBalance.toLocaleString('en-IN')}
          </p>
        </div>

        <div>
          <label className="block text-sm font-body font-semibold text-foreground mb-3">Withdrawal Method</label>
          <div className="space-y-3">
            {withdrawalMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`w-full flex items-center justify-between p-4 border rounded-lg transition-all duration-300 ${selectedMethod === method.id
                  ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${selectedMethod === method.id ? 'bg-primary/10' : 'bg-muted'}`}>
                    <Icon
                      name={method.icon as any}
                      size={24}
                      className={selectedMethod === method.id ? 'text-primary' : 'text-muted-foreground'}
                    />
                  </div>
                  <div className="text-left">
                    <h4 className="font-body font-semibold text-foreground">{method.name}</h4>
                    <p className="text-sm text-muted-foreground font-body">{method.details}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-body font-semibold text-foreground">{method.fee} fee</p>
                  <p className="text-xs text-muted-foreground font-body">{method.time}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 bg-muted/50 rounded-lg border border-border">
          <div className="flex items-start space-x-3">
            <Icon name="InformationCircleIcon" size={20} className="text-primary mt-0.5" />
            <div>
              <h4 className="font-body font-semibold text-foreground mb-1">Withdrawal Information</h4>
              <ul className="text-sm text-muted-foreground font-body space-y-1">
                <li>• Withdrawals are processed within the specified timeframe</li>
                <li>• Fees are deducted from the withdrawal amount</li>
                <li>• You'll receive an email confirmation once processed</li>
                <li>• Contact support if you don't receive funds within the expected time</li>
              </ul>
            </div>
          </div>
        </div>

        <button
          onClick={handleWithdrawal}
          disabled={!withdrawalAmount || parseFloat(withdrawalAmount) < minimumWithdrawal}
          className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-brand-cta text-white rounded-lg font-display font-semibold hover:bg-opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Withdraw Funds</span>
          <Icon name="ArrowRightIcon" size={20} />
        </button>
      </div>
    </div>
  );
};

export default WithdrawalSection;