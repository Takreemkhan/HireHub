'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'paypal';
  name: string;
  details: string;
  isDefault: boolean;
  icon: string;
}

const PaymentMethods = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const paymentMethods: PaymentMethod[] = [
    {
      id: '1',
      type: 'card',
      name: 'Visa ending in 4242',
      details: 'Expires 12/2027',
      isDefault: true,
      icon: 'CreditCardIcon',
    },
    {
      id: '2',
      type: 'bank',
      name: 'Chase Bank Account',
      details: 'Account ****6789',
      isDefault: false,
      icon: 'BuildingLibraryIcon',
    },
    {
      id: '3',
      type: 'paypal',
      name: 'PayPal Account',
      details: 'john.doe@email.com',
      isDefault: false,
      icon: 'CurrencyDollarIcon',
    },
  ];

  if (!isHydrated) {
    return (
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="h-6 bg-muted rounded w-48 mb-6 animate-pulse"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 border border-border rounded-lg animate-pulse">
              <div className="h-5 bg-muted rounded w-40 mb-2"></div>
              <div className="h-4 bg-muted rounded w-32"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-bold text-foreground">Payment Methods</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-body font-medium hover:bg-opacity-90 transition-all duration-300"
          >
            <Icon name="PlusIcon" size={20} />
            <span>Add Method</span>
          </button>
        </div>

        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-primary transition-all duration-300"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-muted rounded-lg">
                  <Icon name={method.icon as any} size={24} className="text-primary" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-body font-semibold text-foreground">{method.name}</h3>
                    {method.isDefault && (
                      <span className="px-2 py-1 bg-brand-green/10 text-brand-green text-xs font-body font-medium rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground font-body">{method.details}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {!method.isDefault && (
                  <button className="p-2 hover:bg-muted rounded-lg transition-colors duration-200">
                    <Icon name="StarIcon" size={20} className="text-muted-foreground" />
                  </button>
                )}
                <button className="p-2 hover:bg-muted rounded-lg transition-colors duration-200">
                  <Icon name="PencilIcon" size={20} className="text-muted-foreground" />
                </button>
                <button className="p-2 hover:bg-error/10 rounded-lg transition-colors duration-200">
                  <Icon name="TrashIcon" size={20} className="text-error" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
          <div className="flex items-start space-x-3">
            <Icon name="ShieldCheckIcon" size={20} className="text-brand-green mt-0.5" />
            <div>
              <h4 className="font-body font-semibold text-foreground mb-1">Secure Payment Processing</h4>
              <p className="text-sm text-muted-foreground font-body">
                All payment methods are encrypted and stored securely. We never share your financial information with third parties.
              </p>
            </div>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl p-6 max-w-md w-full border border-border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-display font-bold text-foreground">Add Payment Method</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors duration-200"
              >
                <Icon name="XMarkIcon" size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <button className="w-full flex items-center space-x-3 p-4 border border-border rounded-lg hover:border-primary transition-all duration-300">
                <Icon name="CreditCardIcon" size={24} className="text-primary" />
                <div className="text-left">
                  <h4 className="font-body font-semibold text-foreground">Credit/Debit Card</h4>
                  <p className="text-sm text-muted-foreground font-body">Add a new card for payments</p>
                </div>
              </button>

              <button className="w-full flex items-center space-x-3 p-4 border border-border rounded-lg hover:border-primary transition-all duration-300">
                <Icon name="BuildingLibraryIcon" size={24} className="text-primary" />
                <div className="text-left">
                  <h4 className="font-body font-semibold text-foreground">Bank Account</h4>
                  <p className="text-sm text-muted-foreground font-body">Link your bank account</p>
                </div>
              </button>

              <button className="w-full flex items-center space-x-3 p-4 border border-border rounded-lg hover:border-primary transition-all duration-300">
                <Icon name="CurrencyDollarIcon" size={24} className="text-primary" />
                <div className="text-left">
                  <h4 className="font-body font-semibold text-foreground">PayPal</h4>
                  <p className="text-sm text-muted-foreground font-body">Connect your PayPal account</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PaymentMethods;