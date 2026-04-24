'use client';

import { ChevronDown } from 'lucide-react';
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
  // ✅ Local state se dropdown control — parent se independent
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ✅ Bahar click karne pe dropdown band ho jaye
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ✅ Item click pe section change karo aur dropdown band karo
  const handleSettingsItemClick = (section: string) => {
    handleSectionChange(section);
    setDropdownOpen(false); // dropdown turant band
  };

  // ✅ Koi aur tab click karo to dropdown band ho
  const handleMainItemClick = (section: string) => {
    handleSectionChange(section);
    setDropdownOpen(false);
  };

  return (
    <nav
      className="flex-1 p-4 overflow-visible scrollbar-hide"
      aria-label="Dashboard sections"
    >
      <div className="flex items-center">

        {/* Main Navigation Items */}
        {sidebarItems.map((item) => (
          <button
            type="button"
            key={item.value}
            onClick={() => handleMainItemClick(item.value)}
            className={`whitespace-nowrap px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeSection === item.value
                ? 'bg-[#FF6B35] text-white shadow-sm'
                : 'text-[#6B7280] hover:bg-[#F7FAFC] hover:text-[#1A1D23]'
            }`}
          >
            {item.label}
          </button>
        ))}

        {/* Settings Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            className={`whitespace-nowrap px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
              isAnySettingsActive
                ? 'bg-[#FF6B35] text-white shadow-sm'
                : 'text-[#6B7280] hover:bg-[#F7FAFC] hover:text-[#1A1D23]'
            }`}
          >
            <span>Settings</span>
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${
                dropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          <div
            className={`absolute top-full left-0 mt-1 z-[999] bg-white border border-[#E2E8F0] rounded-lg shadow-xl min-w-[210px] transition-all duration-200 ease-in-out ${
              dropdownOpen
                ? 'opacity-100 pointer-events-auto translate-y-0'
                : 'opacity-0 pointer-events-none -translate-y-2'
            }`}
          >
            {settingsItems.map((item) => (
              <button
                type="button"
                key={item.value}
                onClick={() => handleSettingsItemClick(item.value)}
                className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-all duration-150 first:rounded-t-lg last:rounded-b-lg ${
                  activeSection === item.value
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
    </nav>
  );
};

export default Navbar;