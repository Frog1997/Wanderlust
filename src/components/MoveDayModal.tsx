import React from 'react';
import { X, Calendar, ArrowRight, Check, MapPin, Clock } from 'lucide-react';
import { DayPlan, ItineraryItem } from '../types';

interface MoveDayModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ItineraryItem | null;
  currentDayNumber: number;
  days: DayPlan[];
  onSelectDay: (targetDayNumber: number) => void;
}

export const MoveDayModal: React.FC<MoveDayModalProps> = ({
  isOpen,
  onClose,
  item,
  currentDayNumber,
  days,
  onSelectDay,
}) => {
  if (!isOpen || !item) return null;

  // Format date helper: YYYY-MM-DD -> "10/15 (週三)"
  const formatDateLabel = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const weekdays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
      const month = d.getMonth() + 1;
      const day = d.getDate();
      return `${month}/${day} ${weekdays[d.getDay()]}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-neutral-900 w-full max-w-lg rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-neutral-900 via-primary-950 to-neutral-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-2xl">
              <Calendar className="w-5 h-5 text-primary-300" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white tracking-tight">
                移動行程至其他天
              </h3>
              <p className="text-xs text-neutral-300 mt-0.5">
                選擇您想將此活動移往的目標日期
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Item Preview */}
        <div className="p-4 bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-100 dark:border-neutral-800">
          <div className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 mb-1.5 uppercase tracking-wider">
            欲移動的行程項目
          </div>
          <div className="p-3 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-md bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {item.time} {item.endTime ? `- ${item.endTime}` : ''}
                </span>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  目前在第 {currentDayNumber} 天
                </span>
              </div>
              <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                {item.title}
              </h4>
              {item.locationName && (
                <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  <MapPin className="w-3 h-3 flex-shrink-0 text-neutral-400" />
                  <span className="truncate">{item.locationName}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Day Plans List */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1">
          <div className="text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-2">
            請選擇移至哪一天：
          </div>

          {days.map((day) => {
            const isCurrent = day.dayNumber === currentDayNumber;
            const dateLabel = formatDateLabel(day.date);

            return (
              <div
                key={day.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  isCurrent
                    ? 'bg-neutral-50 dark:bg-neutral-950/60 border-neutral-200 dark:border-neutral-800 opacity-60'
                    : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-primary-400 dark:hover:border-primary-600 hover:shadow-md cursor-pointer group'
                }`}
                onClick={() => {
                  if (!isCurrent) {
                    onSelectDay(day.dayNumber);
                  }
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-mono flex-shrink-0 transition-colors ${
                      isCurrent
                        ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                        : 'bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300 group-hover:bg-primary-600 group-hover:text-white'
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase leading-none">DAY</span>
                    <span className="text-base font-black leading-none mt-0.5">
                      {day.dayNumber}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-neutral-500 dark:text-neutral-400">
                        {dateLabel}
                      </span>
                      <span className="text-[11px] text-neutral-400 dark:text-neutral-500">
                        • {day.items.length} 個行程
                      </span>
                    </div>
                    <div className="text-sm font-bold text-neutral-900 dark:text-white truncate mt-0.5">
                      {day.themeTitle || `第 ${day.dayNumber} 天行程`}
                    </div>
                  </div>
                </div>

                {isCurrent ? (
                  <span className="px-2.5 py-1 bg-neutral-200/70 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-xs font-semibold rounded-lg flex items-center gap-1 flex-shrink-0">
                    <Check className="w-3.5 h-3.5" />
                    目前天數
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectDay(day.dayNumber);
                    }}
                    className="px-3 py-1.5 bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 group-hover:bg-primary-600 group-hover:text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-all flex-shrink-0 shadow-xs"
                  >
                    <span>移至此天</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all cursor-pointer"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
};
