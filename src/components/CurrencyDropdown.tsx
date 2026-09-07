import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';

export interface CurrencyItem {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

export const CURRENCY_OPTIONS: CurrencyItem[] = [
  { code: 'TWD', name: '新台幣', symbol: 'NT$', flag: '🇹🇼' },
  { code: 'JPY', name: '日圓', symbol: '¥', flag: '🇯🇵' },
  { code: 'USD', name: '美元', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: '歐元', symbol: '€', flag: '🇪🇺' },
  { code: 'KRW', name: '韓元', symbol: '₩', flag: '🇰🇷' },
  { code: 'THB', name: '泰銖', symbol: '฿', flag: '🇹🇭' },
  { code: 'GBP', name: '英鎊', symbol: '£', flag: '🇬🇧' },
  { code: 'SGD', name: '新加坡幣', symbol: 'S$', flag: '🇸🇬' },
  { code: 'HKD', name: '港幣', symbol: 'HK$', flag: '🇭🇰' },
  { code: 'AUD', name: '澳幣', symbol: 'A$', flag: '🇦🇺' },
  { code: 'CAD', name: '加幣', symbol: 'C$', flag: '🇨🇦' },
  { code: 'CNY', name: '人民幣', symbol: '¥', flag: '🇨🇳' },
  { code: 'VND', name: '越南盾', symbol: '₫', flag: '🇻🇳' },
];

export function getCurrencyInfo(code: string): CurrencyItem {
  const found = CURRENCY_OPTIONS.find((c) => c.code.toUpperCase() === code.toUpperCase());
  if (found) return found;
  return { code, name: code, symbol: code, flag: '🌐' };
}

interface CurrencyDropdownProps {
  value: string;
  onChange: (code: string) => void;
  variant?: 'glass' | 'form';
  className?: string;
}

export const CurrencyDropdown: React.FC<CurrencyDropdownProps> = ({
  value,
  onChange,
  variant = 'glass',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const current = getCurrencyInfo(value);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Focus search when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearch('');
    }
  }, [isOpen]);

  const filtered = CURRENCY_OPTIONS.filter(
    (c) =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase())
  );

  const isGlass = variant === 'glass';

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl text-left transition-all cursor-pointer select-none ${
          isGlass
            ? 'bg-white/15 hover:bg-white/20 active:bg-white/25 border border-white/20 text-white shadow-xs focus:ring-2 focus:ring-primary-400'
            : 'bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white shadow-xs focus:ring-2 focus:ring-primary-500'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg leading-none flex-shrink-0" role="img" aria-label={current.name}>
            {current.flag}
          </span>
          <span className="font-mono font-bold text-sm tracking-wide">
            {current.code}
          </span>
          <span
            className={`text-xs truncate ${
              isGlass ? 'text-neutral-300' : 'text-neutral-500 dark:text-neutral-400'
            }`}
          >
            {current.name}
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span
            className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
              isGlass
                ? 'bg-white/20 text-white'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
            }`}
          >
            {current.symbol}
          </span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              isGlass ? 'text-neutral-300' : 'text-neutral-400 dark:text-neutral-500'
            } ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {/* Floating Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute z-50 mt-2 w-full min-w-[240px] rounded-2xl shadow-2xl overflow-hidden border animate-in fade-in zoom-in-95 duration-150 ${
            isGlass
              ? 'bg-neutral-900/95 backdrop-blur-xl border-white/15 text-white'
              : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white'
          }`}
        >
          {/* Quick Search */}
          <div
            className={`p-2 border-b flex items-center gap-2 ${
              isGlass ? 'border-white/10' : 'border-neutral-100 dark:border-neutral-800'
            }`}
          >
            <Search
              className={`w-3.5 h-3.5 ${
                isGlass ? 'text-neutral-400' : 'text-neutral-400 dark:text-neutral-500'
              }`}
            />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="搜尋幣別或國家..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full text-xs bg-transparent focus:outline-none placeholder:text-neutral-400 dark:placeholder:text-neutral-500 ${
                isGlass ? 'text-white' : 'text-neutral-900 dark:text-white'
              }`}
            />
          </div>

          {/* List */}
          <div className="max-h-60 overflow-y-auto p-1.5 space-y-0.5 scrollbar-thin">
            {filtered.length > 0 ? (
              filtered.map((item) => {
                const isSelected = item.code.toUpperCase() === value.toUpperCase();
                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => {
                      onChange(item.code);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all cursor-pointer ${
                      isSelected
                        ? isGlass
                          ? 'bg-primary-600/40 text-white font-bold border border-primary-500/40'
                          : 'bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300 font-bold'
                        : isGlass
                        ? 'hover:bg-white/10 text-neutral-200 hover:text-white'
                        : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg leading-none" role="img" aria-label={item.name}>
                        {item.flag}
                      </span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-bold">{item.code}</span>
                          <span className="text-[11px] opacity-75">{item.name}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono opacity-60">{item.symbol}</span>
                      {isSelected && (
                        <Check
                          className={`w-4 h-4 ${
                            isGlass ? 'text-primary-400' : 'text-primary-600 dark:text-primary-400'
                          }`}
                        />
                      )}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-3 text-center text-xs text-neutral-400 dark:text-neutral-500">
                找不到相關幣別
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
