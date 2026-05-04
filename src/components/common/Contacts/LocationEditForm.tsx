'use client';

import React, { useState } from 'react';
import { FiSearch, FiCheck, FiShield } from 'react-icons/fi';

interface LocationEditFormProps {
    initialData?: {
        country?:  string;
        address?:  string;
        address2?: string;
        city?:     string;
        state?:    string;
        zipCode?:  string;
        phone?:    string;
    };
    saving?:   boolean;
    onCancel:  () => void;
    onUpdate:  (data: any) => void;
}

// Phone verification ke 3 states
type PhoneState = 'idle' | 'otp_sent' | 'verified';

export default function LocationEditForm({
    initialData,
    saving,
    onCancel,
    onUpdate,
}: LocationEditFormProps) {
    const [formData, setFormData] = useState({
        country:  initialData?.country  || 'India',
        address:  initialData?.address  || '',
        address2: initialData?.address2 || '',
        city:     initialData?.city     || '',
        state:    initialData?.state    || '',
        zipCode:  initialData?.zipCode  || '',
        phone:    initialData?.phone    || '',
    });

    // Phone OTP state
    const [phoneState, setPhoneState]   = useState<PhoneState>(
        initialData?.phone ? 'verified' : 'idle'
    );
    const [otp, setOtp]                 = useState('');
    const [otpError, setOtpError]       = useState('');
    const [otpLoading, setOtpLoading]   = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Phone badla → verify dobara karni padegi
        if (name === 'phone' && value !== initialData?.phone) {
            setPhoneState('idle');
            setOtp('');
            setOtpError('');
        }
    };

    // ── OTP bhejo ─────────────────────────────────────────────────────
    const handleSendOtp = async () => {
        const phone = formData.phone.trim();
        if (!/^\d{10}$/.test(phone)) {
            setOtpError('10-digit phone number enter karo (no spaces, no +91)');
            return;
        }
        setOtpError('');
        setOtpLoading(true);
        try {
            const res  = await fetch('/api/phone-verify/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone }),
            });
            const data = await res.json();
            if (data.success) {
                setPhoneState('otp_sent');
                // 30 second resend cooldown
                setResendTimer(30);
                const interval = setInterval(() => {
                    setResendTimer(t => {
                        if (t <= 1) { clearInterval(interval); return 0; }
                        return t - 1;
                    });
                }, 1000);
            } else {
                setOtpError(data.message || 'OTP send karne mein error aaya');
            }
        } catch {
            setOtpError('Network error. Dobara try karo.');
        } finally {
            setOtpLoading(false);
        }
    };

    // ── OTP verify karo ───────────────────────────────────────────────
    const handleVerifyOtp = async () => {
        if (otp.length !== 6) {
            setOtpError('6-digit OTP enter karo');
            return;
        }
        setOtpError('');
        setOtpLoading(true);
        try {
            const res  = await fetch('/api/phone-verify/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: formData.phone.trim(), otp }),
            });
            const data = await res.json();
            if (data.success) {
                setPhoneState('verified');
                setOtp('');
            } else {
                setOtpError(data.message || 'Invalid OTP');
            }
        } catch {
            setOtpError('Network error. Dobara try karo.');
        } finally {
            setOtpLoading(false);
        }
    };

    // Save sirf tab hoga jab phone verified ho (ya phone field empty ho)
    const canSave = !formData.phone || phoneState === 'verified';

    return (
        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm animate-in fade-in duration-300">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Location</h3>

            <div className="space-y-6">

                {/* Country */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Country</label>
                        <select
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
                        >
                            <option>India</option>
                            <option>United States</option>
                            <option>United Kingdom</option>
                            <option>Canada</option>
                            <option>Australia</option>
                        </select>
                    </div>
                </div>

                <p className="text-xs text-gray-500 italic">
                    We take your privacy seriously. Only your city and country will be shared with clients.
                </p>

                {/* Address */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Address</label>
                        <input
                            type="text" name="address" value={formData.address} onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Address 2</label>
                        <input
                            type="text" name="address2" placeholder="Apt/Suite" value={formData.address2} onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
                        />
                    </div>
                </div>

                {/* City + State */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">City</label>
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text" name="city" value={formData.city} onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">State/Province</label>
                        <input
                            type="text" name="state" value={formData.state} onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
                        />
                    </div>
                </div>

                {/* ZIP */}
                <div className="space-y-2 max-w-xs">
                    <label className="text-sm font-semibold text-gray-700">ZIP/Postal code</label>
                    <input
                        type="text" name="zipCode" value={formData.zipCode} onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
                    />
                </div>

                {/* ── PHONE + OTP SECTION ─────────────────────────────────────── */}
                <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700">
                        Phone{' '}
                        {phoneState === 'verified' && (
                            <span className="ml-2 inline-flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                <FiCheck size={11} /> Verified
                            </span>
                        )}
                    </label>

                    {/* Phone input row */}
                    <div className="flex items-stretch max-w-md gap-2">
                        <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 border-r-0 rounded-l-lg bg-gray-50 text-sm shrink-0">
                            <img src="https://flagcdn.com/w20/in.png" alt="India" className="w-5" />
                            <span className="text-gray-600">+91</span>
                        </div>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            maxLength={10}
                            placeholder="10-digit number"
                            disabled={phoneState === 'verified'}
                            className={`flex-1 px-4 py-2 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all ${
                                phoneState === 'verified'
                                    ? 'rounded-r-lg bg-gray-50 text-gray-500 cursor-not-allowed'
                                    : 'rounded-r-lg'
                            }`}
                        />
                        {/* Send OTP / Change button */}
                        {phoneState === 'idle' && (
                            <button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={otpLoading || !formData.phone}
                                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
                            >
                                {otpLoading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Sending…
                                    </span>
                                ) : 'Send OTP'}
                            </button>
                        )}
                        {phoneState === 'verified' && (
                            <button
                                type="button"
                                onClick={() => { setPhoneState('idle'); setOtp(''); setOtpError(''); }}
                                className="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
                            >
                                Change
                            </button>
                        )}
                    </div>

                    {/* OTP input — sirf otp_sent state mein dikhao */}
                    {phoneState === 'otp_sent' && (
                        <div className="max-w-md space-y-2 animate-in fade-in duration-200">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <FiShield size={13} className="text-orange-500" />
                                <span>OTP +91 {formData.phone}Sent to your phone. It will expire in 10 minutes</span>
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={e => { setOtp(e.target.value.replace(/\D/g, '').slice(0, 6)); setOtpError(''); }}
                                    placeholder="6-digit OTP"
                                    maxLength={6}
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm tracking-widest font-mono"
                                />
                                <button
                                    type="button"
                                    onClick={handleVerifyOtp}
                                    disabled={otpLoading || otp.length !== 6}
                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
                                >
                                    {otpLoading ? (
                                        <span className="flex items-center gap-2">
                                            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Verifying…
                                        </span>
                                    ) : 'Verify'}
                                </button>
                            </div>
                            {/* Resend */}
                            <button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={resendTimer > 0 || otpLoading}
                                className="text-xs text-orange-500 hover:underline disabled:opacity-50 disabled:no-underline"
                            >
                                {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                            </button>
                        </div>
                    )}

                    {/* Error message */}
                    {otpError && (
                        <p className="text-xs text-red-500 font-medium">{otpError}</p>
                    )}
                </div>
                {/* ───────────────────────────────────────────────────────────── */}

                {/* Save / Cancel */}
                <div className="flex items-center gap-4 pt-4">
                    <button
                        onClick={() => onUpdate(formData)}
                        disabled={saving || !canSave}
                        className="px-6 py-2 bg-[#14A800] hover:bg-[#128e00] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-sm flex items-center gap-2"
                    >
                        {saving ? (
                            <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving…</>
                        ) : 'Save'}
                    </button>
                    <button
                        onClick={onCancel}
                        disabled={saving}
                        className="px-6 py-2 text-[#14A800] hover:bg-gray-50 font-semibold rounded-lg transition-colors text-sm"
                    >
                        Cancel
                    </button>

                    {/* Phone verify reminder */}
                    {formData.phone && phoneState !== 'verified' && (
                        <p className="text-xs text-amber-600 font-medium">
                            ⚠  Verify your phone first to save
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}