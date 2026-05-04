'use client';

import { ChevronDown, X, SlidersHorizontal, Smile, ChevronsDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
type SidebarItem = {
  label: string;
  value: string;
};

interface NavbarProps {
  activeSection: string;
  isSettingsOpen: boolean;
  isAnySettingsActive: boolean;
  sidebarItems: SidebarItem[];
  settingsItems: SidebarItem[];
  handleSectionChange: (section: string) => void;
  handleSettingsToggle: () => void;
}

const Navbar = ({
  activeSection,
  isAnySettingsActive,
  sidebarItems,
  settingsItems,
  handleSectionChange,
}: NavbarProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSettingsOpen, setMobileSettingsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close desktop dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const handleSettingsItemClick = (section: string) => {
    handleSectionChange(section);
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    setMobileSettingsOpen(false);
  };

  const handleMainItemClick = (section: string) => {
    handleSectionChange(section);
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="flex-1 p-4 overflow-visible scrollbar-hide" aria-label="Dashboard sections">

        {/* ── Desktop Layout (md+) ── */}
        <div className="hidden md:flex items-center gap-1">
          {sidebarItems.map((item) => (
            <button
              type="button"
              key={item.value}
              onClick={() => handleMainItemClick(item.value)}
              className={`whitespace-nowrap px-4 py-3 rounded-lg font-medium transition-all duration-200 ${activeSection === item.value
                ? 'bg-[#FF6B35] text-white shadow-sm'
                : 'text-[#6B7280] hover:bg-[#F7FAFC] hover:text-[#1A1D23]'
                }`}
            >
              {item.label}
            </button>
          ))}

          {/* Desktop Settings Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              className={`whitespace-nowrap px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${isAnySettingsActive
                ? 'bg-[#FF6B35] text-white shadow-sm'
                : 'text-[#6B7280] hover:bg-[#F7FAFC] hover:text-[#1A1D23]'
                }`}
            >
              <span>Settings</span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            <div
              className={`absolute top-full left-0 mt-1 z-[999] bg-white border border-[#E2E8F0] rounded-lg shadow-xl min-w-[210px] transition-all duration-200 ease-in-out ${dropdownOpen
                ? 'opacity-100 pointer-events-auto translate-y-0'
                : 'opacity-0 pointer-events-none -translate-y-2'
                }`}
            >
              {settingsItems.map((item) => (
                <button
                  type="button"
                  key={item.value}
                  onClick={() => handleSettingsItemClick(item.value)}
                  className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-all duration-150 first:rounded-t-lg last:rounded-b-lg ${activeSection === item.value
                    ? 'bg-[#FF6B35] text-white'
                    : 'text-[#6B7280] hover:bg-[#F7FAFC] hover:text-[#1A1D23]'
                    }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Mobile Hamburger Button (< md) ── */}
        <div className="flex md:hidden items-center justify-between">
          {/* Show active section label */}
          <span className="text-[#1A1D23] font-semibold text-sm">
            {[...sidebarItems, ...settingsItems].find((i) => i.value === activeSection)?.label ?? 'Menu'}
          </span>



          <button
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="p-2 rounded-lg text-[#6B7280] hover:bg-[#F7FAFC] hover:text-[#1A1D23] transition-colors duration-200"
          >
            {mobileMenuOpen ? <X size={22} /> : <ChevronsDown size={22} />}
          </button>
        </div>
      </nav>

      {/* ── Mobile Menu Overlay ── */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm md:hidden transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        aria-hidden="true"
      />

      {/* Slide-down panel */}
      <div
        ref={mobileMenuRef}
        className={`fixed top-0 left-0 right-0 z-[70] md:hidden bg-white shadow-2xl rounded-b-2xl transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
          <span className="text-[#1A1D23] font-bold text-base">Navigation</span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-lg text-[#6B7280] hover:bg-[#F7FAFC] hover:text-[#1A1D23] transition-colors duration-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Main Nav Items */}
        <div className="px-4 py-3 flex flex-col gap-1">
          {sidebarItems.map((item) => (
            <button
              type="button"
              key={item.value}
              onClick={() => handleMainItemClick(item.value)}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium text-sm transition-all duration-150 ${activeSection === item.value
                ? 'bg-[#FF6B35] text-white shadow-sm'
                : 'text-[#6B7280] hover:bg-[#F7FAFC] hover:text-[#1A1D23]'
                }`}
            >
              {item.label}
            </button>
          ))}

          {/* Mobile Settings Accordion */}
          <button
            type="button"
            onClick={() => setMobileSettingsOpen((prev) => !prev)}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium text-sm flex items-center justify-between transition-all duration-150 ${isAnySettingsActive
              ? 'bg-[#FF6B35] text-white shadow-sm'
              : 'text-[#6B7280] hover:bg-[#F7FAFC] hover:text-[#1A1D23]'
              }`}
          >
            <span>Settings</span>
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${mobileSettingsOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Accordion Content */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${mobileSettingsOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
          >
            <div className="pl-4 flex flex-col gap-1 pb-1">
              {settingsItems.map((item) => (
                <button
                  type="button"
                  key={item.value}
                  onClick={() => handleSettingsItemClick(item.value)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${activeSection === item.value
                    ? 'bg-[#FF6B35] text-white'
                    : 'text-[#6B7280] hover:bg-[#F7FAFC] hover:text-[#1A1D23]'
                    }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Safe-area bottom padding for iOS */}
        <div className="h-4" />
      </div>
    </>
  );
};

export default Navbar;