import React, { useState } from 'react';
import { Trip, Collaborator } from '../types';
import { 
  TripSettlementResult, 
  generateMemberSettlementText, 
  SettlementTransfer 
} from '../services/settlement';
import { formatMoney, convertCurrency } from '../services/currency';
import { AnimalAvatar } from './AnimalAvatar';
import { 
  Users, 
  X, 
  Copy, 
  Check, 
  ArrowUpRight, 
  ArrowDownRight, 
  Receipt, 
  CreditCard, 
  Utensils, 
  Hotel, 
  Train, 
  ShoppingBag, 
  Ticket, 
  DollarSign,
  ArrowRight
} from 'lucide-react';

interface MemberSettlementModalProps {
  trip: Trip;
  isOpen: boolean;
  selectedMemberName: string;
  onSelectMember: (name: string) => void;
  onClose: () => void;
  settlement: TripSettlementResult;
  settlementCurrency: string;
  rates: Record<string, number>;
}

export const MemberSettlementModal: React.FC<MemberSettlementModalProps> = ({
  trip,
  isOpen,
  selectedMemberName,
  onSelectMember,
  onClose,
  settlement,
  settlementCurrency,
  rates,
}) => {
  const [activeTab, setActiveTab] = useState<'paid' | 'shared'>('paid');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentMember = trip.collaborators.find((c) => c.name === selectedMemberName) || trip.collaborators[0];
  const memberName = currentMember ? currentMember.name : selectedMemberName;
  const summary = settlement.getMemberSummary(memberName);

  if (!summary) return null;

  const { totalPaid, totalConsumed, balance, paidExpenses, sharedExpenses, transfersIn, transfersOut } = summary;

  const handleCopy = () => {
    const text = generateMemberSettlementText(trip.title, settlementCurrency, summary);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'food':
        return <Utensils className="w-4 h-4 text-amber-600" />;
      case 'lodging':
        return <Hotel className="w-4 h-4 text-purple-600" />;
      case 'transport':
        return <Train className="w-4 h-4 text-emerald-600" />;
      case 'shopping':
        return <ShoppingBag className="w-4 h-4 text-pink-600" />;
      case 'ticket':
        return <Ticket className="w-4 h-4 text-blue-600" />;
      default:
        return <DollarSign className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />;
    }
  };

  return (
    <div
      id="member-settlement-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/70 backdrop-blur-sm animate-in fade-in"
    >
      <div
        id="member-settlement-modal-card"
        className="bg-white dark:bg-neutral-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="p-5 bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-primary-50 dark:bg-primary-950/50 text-primary-600 rounded-xl">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 dark:text-white text-base">個人分帳結算明細</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                點選同行夥伴查看個別先付項目、分攤明細與轉帳結算
              </p>
            </div>
          </div>
          <button
            id="btn-close-settlement-modal"
            onClick={onClose}
            className="p-1.5 text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Member Selector Pills */}
        <div className="px-5 py-3 bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-bold text-neutral-400 dark:text-neutral-500 whitespace-nowrap mr-1">
            切換夥伴：
          </span>
          {trip.collaborators.map((c) => {
            const isSelected = c.name === memberName;
            const memberBal = settlement.balances[c.name] || 0;
            return (
              <button
                key={c.id}
                id={`tab-member-${c.id}`}
                onClick={() => {
                  onSelectMember(c.name);
                  setCopied(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                    : 'bg-neutral-50 dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300'
                }`}
              >
                <AnimalAvatar avatar={c.avatar} name={c.name} color={c.color} size="xs" />
                <span>{c.name}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : memberBal > 0
                      ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50'
                      : memberBal < 0
                      ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/50'
                      : 'text-neutral-400'
                  }`}
                >
                  {memberBal > 0 ? `+${Math.round(memberBal)}` : memberBal < 0 ? `${Math.round(memberBal)}` : '0'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 space-y-5 overflow-y-auto flex-1">
          {/* Member Profile & Net Balance Card */}
          <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AnimalAvatar avatar={currentMember?.avatar} name={memberName} color={currentMember?.color} size="xl" />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-neutral-900 dark:text-white text-base">{memberName}</h4>
                  {currentMember?.role === 'owner' && (
                    <span className="text-[10px] bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 font-bold px-1.5 py-0.5 rounded">
                      主辦發起人
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  共代付 {paidExpenses.length} 筆 • 參與分攤 {sharedExpenses.length} 筆
                </p>
              </div>
            </div>

            {/* Quick Action: Copy details text */}
            <button
              id="btn-copy-member-settlement"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-bold text-neutral-700 dark:text-neutral-200 transition-all shadow-sm"
              title="複製個人分帳結果到剪貼簿"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">已複製個人分帳文字！</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-neutral-500" />
                  <span>複製結算單 (LINE/備忘錄)</span>
                </>
              )}
            </button>
          </div>

          {/* 3 Metric Cards: Paid / Consumed / Net */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Total Paid Box */}
            <div className="p-4 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
              <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs font-bold">
                <span>先墊付總金額</span>
                <ArrowUpRight className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="mt-2 text-lg font-black text-neutral-900 dark:text-white">
                {formatMoney(totalPaid, settlementCurrency)}
              </div>
              <div className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-0.5">
                由 {memberName} 先刷卡或付現
              </div>
            </div>

            {/* Total Consumed Box */}
            <div className="p-4 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
              <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs font-bold">
                <span>個人應分攤自付</span>
                <ArrowDownRight className="w-4 h-4 text-rose-500" />
              </div>
              <div className="mt-2 text-lg font-black text-neutral-900 dark:text-white">
                {formatMoney(totalConsumed, settlementCurrency)}
              </div>
              <div className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-0.5">
                此人實際享受消費份額
              </div>
            </div>

            {/* Net Balance Box */}
            <div
              className={`p-4 rounded-xl border shadow-sm ${
                balance > 0.01
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
                  : balance < -0.01
                  ? 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800'
                  : 'bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold">
                <span
                  className={
                    balance > 0.01
                      ? 'text-emerald-800 dark:text-emerald-300'
                      : balance < -0.01
                      ? 'text-rose-800 dark:text-rose-300'
                      : 'text-neutral-500'
                  }
                >
                  結算淨額 (Net)
                </span>
                <CreditCard className="w-4 h-4 opacity-75" />
              </div>
              <div
                className={`mt-2 text-lg font-black ${
                  balance > 0.01
                    ? 'text-emerald-700 dark:text-emerald-300'
                    : balance < -0.01
                    ? 'text-rose-600 dark:text-rose-300'
                    : 'text-neutral-600 dark:text-neutral-400'
                }`}
              >
                {balance > 0.01
                  ? `應收回 +${formatMoney(balance, settlementCurrency)}`
                  : balance < -0.01
                  ? `應支付 -${formatMoney(Math.abs(balance), settlementCurrency)}`
                  : '完全平帳 $0'}
              </div>
              <div className="text-[11px] opacity-80 mt-0.5">
                {balance > 0.01
                  ? '他人需匯款給此成員'
                  : balance < -0.01
                  ? '此成員需轉帳給代付者'
                  : '帳目已完全平衡'}
              </div>
            </div>
          </div>

          {/* Transfers Recommendations */}
          {(transfersIn.length > 0 || transfersOut.length > 0) && (
            <div className="p-4 bg-primary-50/40 dark:bg-primary-950/20 rounded-xl border border-primary-100 dark:border-primary-900/50 space-y-2.5">
              <div className="text-xs font-bold text-primary-900 dark:text-primary-300 flex items-center gap-1.5">
                <ArrowRight className="w-3.5 h-3.5 text-primary-600" />
                <span>相關轉帳清算建議</span>
              </div>
              <div className="space-y-2">
                {transfersIn.map((t, i) => (
                  <div
                    key={`in-${i}`}
                    className="p-2.5 bg-white dark:bg-neutral-900 rounded-lg border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-between text-xs font-bold"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-700 dark:text-neutral-300">{t.from}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                      <span className="text-emerald-700 dark:text-emerald-400">應轉帳給 {memberName}</span>
                    </div>
                    <span className="text-emerald-600 font-mono text-sm">
                      +{formatMoney(t.amount, settlementCurrency)}
                    </span>
                  </div>
                ))}
                {transfersOut.map((t, i) => (
                  <div
                    key={`out-${i}`}
                    className="p-2.5 bg-white dark:bg-neutral-900 rounded-lg border border-rose-200 dark:border-rose-900/60 flex items-center justify-between text-xs font-bold"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-rose-700 dark:text-rose-400">{memberName}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                      <span className="text-neutral-700 dark:text-neutral-300">應轉帳給 {t.to}</span>
                    </div>
                    <span className="text-rose-600 font-mono text-sm">
                      -{formatMoney(t.amount, settlementCurrency)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Itemized Lists with Tabs */}
          <div className="space-y-3">
            {/* Tabs */}
            <div className="flex items-center border-b border-neutral-200 dark:border-neutral-800">
              <button
                id="tab-view-paid-expenses"
                onClick={() => setActiveTab('paid')}
                className={`pb-2.5 px-3 text-xs font-bold transition-all relative ${
                  activeTab === 'paid'
                    ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600'
                    : 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-400'
                }`}
              >
                由其先代付的項目 ({paidExpenses.length})
              </button>
              <button
                id="tab-view-shared-expenses"
                onClick={() => setActiveTab('shared')}
                className={`pb-2.5 px-3 text-xs font-bold transition-all relative ${
                  activeTab === 'shared'
                    ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600'
                    : 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-400'
                }`}
              >
                參與分攤的項目 ({sharedExpenses.length})
              </button>
            </div>

            {/* Tab 1: Paid Expenses List */}
            {activeTab === 'paid' && (
              <div className="space-y-2">
                {paidExpenses.length === 0 ? (
                  <div className="text-center py-8 bg-neutral-50 dark:bg-neutral-950 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800 text-xs text-neutral-400">
                    此成員尚未代付任何費用項目
                  </div>
                ) : (
                  paidExpenses.map((exp) => {
                    const splitCount = exp.splitWith.length || 1;
                    const othersShare = convertCurrency(exp.amount, exp.originalCurrency, settlementCurrency, rates) * ((splitCount - (exp.splitWith.includes(memberName) ? 1 : 0)) / splitCount);

                    return (
                      <div
                        key={exp.id}
                        className="p-3 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                            {getCategoryIcon(exp.category)}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-neutral-900 dark:text-white">
                              {exp.title}
                            </div>
                            <div className="text-[11px] text-neutral-400 dark:text-neutral-500 flex items-center gap-1.5 mt-0.5">
                              <span>{exp.date}</span>
                              <span>•</span>
                              <span>分攤成員: {exp.splitWith.join(', ')}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs font-bold text-neutral-900 dark:text-white">
                            {formatMoney(convertCurrency(exp.amount, exp.originalCurrency, settlementCurrency, rates), settlementCurrency)}
                          </div>
                          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                            他人應還：{formatMoney(othersShare, settlementCurrency)}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Tab 2: Shared Expenses List */}
            {activeTab === 'shared' && (
              <div className="space-y-2">
                {sharedExpenses.length === 0 ? (
                  <div className="text-center py-8 bg-neutral-50 dark:bg-neutral-950 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800 text-xs text-neutral-400">
                    此成員尚未參與任何分攤項目
                  </div>
                ) : (
                  sharedExpenses.map(({ expense: exp, shareAmount }) => (
                    <div
                      key={exp.id}
                      className="p-3 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                          {getCategoryIcon(exp.category)}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-neutral-900 dark:text-white">
                            {exp.title}
                          </div>
                          <div className="text-[11px] text-neutral-400 dark:text-neutral-500 flex items-center gap-1.5 mt-0.5">
                            <span>{exp.date}</span>
                            <span>•</span>
                            <span>由 {exp.paidBy} 先付 (共 {exp.splitWith.length} 人分攤)</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-bold text-rose-600 dark:text-rose-400">
                          應負擔 {formatMoney(shareAmount, settlementCurrency)}
                        </div>
                        <div className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5">
                          總額：{formatMoney(convertCurrency(exp.amount, exp.originalCurrency, settlementCurrency, rates), settlementCurrency)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-700 flex justify-between items-center">
          <div className="text-xs text-neutral-400 dark:text-neutral-500">
            可點選頂部切換不同成員查看
          </div>
          <button
            id="btn-close-settlement-modal-bottom"
            onClick={onClose}
            className="px-5 py-2 bg-neutral-900 hover:bg-black dark:bg-white dark:text-neutral-900 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};
