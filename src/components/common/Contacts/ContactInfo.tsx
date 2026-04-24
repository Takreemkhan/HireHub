'use client';

import React, { useState } from 'react';
import { FiEdit2, FiMapPin, FiPhone, FiMail, FiX, FiCheck } from 'react-icons/fi';
import LocationEditForm from './LocationEditForm';
import { useSession } from 'next-auth/react';
import { useGetContactsInfo, useContactsInfoEdit } from '@/app/hook/useProfile';

export default function ContactInfo() {
    const { data: session } = useSession();
    const userId = session?.user?.id;
    const role = session?.user?.role;
console.log("user info", role);
    const [isEditingLocation, setIsEditingLocation] = useState(false);
    const [isEditingAccount, setIsEditingAccount] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    // Fetch contact data
    const { data: contactData, isLoading } = useGetContactsInfo({
        userId: userId || "",
    });

    // Mutation for updating
    const { mutate: updateContact, isPending: saving } = useContactsInfoEdit();

    const contact = contactData?.contact;
    const locationData = {
        address:  contact?.location?.address  || '',
        address2: contact?.location?.address2 || '',
        city:     contact?.location?.city     || '',
        state:    contact?.location?.state    || '',
        zipCode:  contact?.location?.zipCode  || '',
        country:  contact?.location?.country  || '',
        phone:    contact?.phone              || '',
        companyName: contact?.companyName     || '',
    };

    // Update location (full update)
    const handleUpdateLocation = (newData: any) => {
        if (!userId) return;
        updateContact(
            { userId, data: newData },
            {
                onSuccess: () => {
                    setSuccessMsg('Contact info saved!');
                    setTimeout(() => setSuccessMsg(''), 3000);
                    setIsEditingLocation(false);
                },
                onError: (error) => console.error('Update failed:', error),
            }
        );
    };

    // Update only company name (merge with existing data)
    const handleUpdateAccount = (newCompanyName: string) => {
        if (!userId) return;
        const updatedData = { ...locationData, companyName: newCompanyName };
        updateContact(
            { userId, data: updatedData },
            {
                onSuccess: () => {
                    setSuccessMsg('Company name updated!');
                    setTimeout(() => setSuccessMsg(''), 3000);
                    setIsEditingAccount(false);
                },
                onError: (error) => console.error('Update failed:', error),
            }
        );
    };

    if (isLoading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[200px]">
                <div className="w-7 h-7 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Contact info </h2>
                {successMsg && (
                    <span className="text-sm text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full">
                        ✓ {successMsg}
                    </span>
                )}
            </div>

            <div className="space-y-8">


                {/* Account Section - with editable company name */}
                {
                    role === 'client' && (
                         <section className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                        <h3 className="text-base font-semibold text-gray-900 border-b-2 border-orange-500 pb-1">Account</h3>
                        {!isEditingAccount && (
                            <button
                                onClick={() => setIsEditingAccount(true)}
                                className="p-2 text-orange-500 hover:bg-orange-50 rounded-full transition-colors"
                            >
                                <FiEdit2 size={18} />
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Company Name - editable */}
                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Company Name</p>
                            {isEditingAccount ? (
                                <AccountEditForm
                                    currentName={locationData.companyName}
                                    saving={saving}
                                    onSave={handleUpdateAccount}
                                    onCancel={() => setIsEditingAccount(false)}
                                />
                            ) : (
                                <p className="text-sm font-medium text-gray-900">{locationData.companyName || '—'}</p>
                            )}
                        </div>

                        {/* Email - read only */}
                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</p>
                            <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                <FiMail className="text-gray-400" />
                                {session?.user?.email || '—'}
                            </p>
                        </div>
                    </div>
                </section>
                    )

                }
               

                {/* Location Section (unchanged) */}
                {isEditingLocation ? (
                    <LocationEditForm
                        initialData={locationData}
                        saving={saving}
                        onCancel={() => setIsEditingLocation(false)}
                        onUpdate={handleUpdateLocation}
                    />
                ) : (
                    <section className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-base font-semibold text-gray-900 border-b-2 border-orange-500 pb-1">Location</h3>
                            <button
                                onClick={() => setIsEditingLocation(true)}
                                className="p-2 text-orange-500 hover:bg-orange-50 rounded-full transition-colors"
                            >
                                <FiEdit2 size={18} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Address</p>
                                <div className="flex items-start gap-3 mt-1">
                                    <FiMapPin className="text-gray-400 mt-0.5" />
                                    <p className="text-sm text-gray-900 leading-relaxed">
                                        {locationData.address || '—'}
                                        {locationData.address2 && <><br />{locationData.address2}</>}
                                        {(locationData.city || locationData.state) && (
                                            <><br />{[locationData.city, locationData.state, locationData.zipCode].filter(Boolean).join(', ')}</>
                                        )}
                                        {locationData.country && <><br />{locationData.country}</>}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Phone</p>
                                <div className="flex items-center gap-3 mt-1 text-sm text-gray-900 font-medium">
                                    <FiPhone className="text-gray-400" />
                                    {locationData.phone ? `+91 ${locationData.phone}` : '—'}
                                </div>
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}

// Simple inline edit form for Company Name
function AccountEditForm({ 
    currentName, 
    saving, 
    onSave, 
    onCancel 
}: { 
    currentName: string; 
    saving: boolean; 
    onSave: (name: string) => void; 
    onCancel: () => void; 
}) {
    const [name, setName] = useState(currentName);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) onSave(name.trim());
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                placeholder="Company name"
                disabled={saving}
                autoFocus
            />
            <button
                type="submit"
                disabled={saving}
                className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                title="Save"
            >
                <FiCheck size={18} />
            </button>
            <button
                type="button"
                onClick={onCancel}
                disabled={saving}
                className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                title="Cancel"
            >
                <FiX size={18} />
            </button>
        </form>
    );
}