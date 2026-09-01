import React from 'react';
import { 
  X, 
  RefreshCw, 
  MapPin, 
  Thermometer, 
  Droplets, 
  Wind, 
  Sun, 
  CloudSun, 
  Cloud, 
  CloudRain, 
  CloudDrizzle, 
  CloudSnow, 
  CloudLightning, 
  CloudFog,
  Umbrella,
  WifiOff,
  Calendar
} from 'lucide-react';
import { TripWeatherData, DailyForecast } from '../services/weather';

interface WeatherDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  weatherData: TripWeatherData | null;
  isLoading: boolean;
  onRefresh: () => void;
  selectedDate?: string;
}

export const WeatherIcon: React.FC<{
  type: DailyForecast['iconType'];
  className?: string;
}> = ({ type, className = 'w-5 h-5' }) => {
  switch (type) {
    case 'sun':
      return <Sun className={`${className} text-amber-400`} />;
    case 'cloud-sun':
      return <CloudSun className={`${className} text-amber-300`} />;
    case 'cloud':
      return <Cloud className={`${className} text-stone-400 dark:text-neutral-400`} />;
    case 'drizzle':
      return <CloudDrizzle className={`${className} text-sky-400`} />;
    case 'rain':
      return <CloudRain className={`${className} text-blue-500`} />;
    case 'snow':
      return <CloudSnow className={`${className} text-sky-200`} />;
    case 'lightning':
      return <CloudLightning className={`${className} text-yellow-400`} />;
    case 'fog':
      return <CloudFog className={`${className} text-stone-400`} />;
    default:
      return <Sun className={`${className} text-amber-400`} />;
  }
};

export const WeatherDetailModal: React.FC<WeatherDetailModalProps> = ({
  isOpen,
  onClose,
  weatherData,
  isLoading,
  onRefresh,
  selectedDate,
}) => {
  if (!isOpen) return null;

  const current = weatherData?.current;

  // Format date helper
  const formatDayLabel = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const weekdays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
      const month = d.getMonth() + 1;
      const day = d.getDate();
      return {
        dateText: `${month}/${day}`,
        weekday: weekdays[d.getDay()],
      };
    } catch {
      return { dateText: dateStr, weekday: '' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-neutral-900 w-full max-w-xl rounded-3xl shadow-2xl border border-stone-200 dark:border-neutral-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-sky-600 via-primary-600 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/15 backdrop-blur-xs rounded-xl">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg text-white tracking-tight">
                  {weatherData?.cityName || '目的地即時天氣'}
                </h3>
                {weatherData?.isCachedOffline && (
                  <span className="px-2 py-0.5 bg-white/20 text-[10px] font-bold rounded-full flex items-center gap-1">
                    <WifiOff className="w-3 h-3" /> 離線快取
                  </span>
                )}
              </div>
              <p className="text-xs text-sky-100 mt-0.5">
                {weatherData?.updatedAt ? `更新於 ${new Date(weatherData.updatedAt).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}` : '獲取最新天氣資訊中'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all disabled:opacity-50"
              title="重新整理氣象資料"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Current Conditions Card */}
          {current ? (
            <div className="p-4 bg-stone-50 dark:bg-neutral-950 rounded-2xl border border-stone-200 dark:border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white dark:bg-neutral-900 rounded-2xl shadow-xs border border-stone-200/60 dark:border-neutral-800 flex items-center justify-center">
                  <WeatherIcon type={current.iconType} className="w-10 h-10" />
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-stone-900 dark:text-white font-mono">
                      {current.temp}°C
                    </span>
                    <span className="text-sm font-bold text-stone-600 dark:text-neutral-300">
                      {current.weatherText}
                    </span>
                  </div>
                  <div className="text-xs text-stone-400 dark:text-neutral-500 mt-0.5">
                    體感溫度 {current.apparentTemp}°C
                  </div>
                </div>
              </div>

              {/* Extra Stats */}
              <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
                <div className="px-3 py-2 bg-white dark:bg-neutral-900 rounded-xl border border-stone-100 dark:border-neutral-800 flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-sky-500 flex-shrink-0" />
                  <div>
                    <div className="text-[10px] text-stone-400 dark:text-neutral-500">相對濕度</div>
                    <div className="text-xs font-bold text-stone-800 dark:text-neutral-200">{current.humidity}%</div>
                  </div>
                </div>
                <div className="px-3 py-2 bg-white dark:bg-neutral-900 rounded-xl border border-stone-100 dark:border-neutral-800 flex items-center gap-2">
                  <Wind className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <div>
                    <div className="text-[10px] text-stone-400 dark:text-neutral-500">風速</div>
                    <div className="text-xs font-bold text-stone-800 dark:text-neutral-200">{current.windSpeed} km/h</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-stone-400 dark:text-neutral-600">
              {isLoading ? '載入氣象資料中...' : '目前無法取得即時天氣，請檢查網路連線'}
            </div>
          )}

          {/* Daily Forecast List */}
          {weatherData && weatherData.daily.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-stone-500 dark:text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  未來 14 天天氣預報
                </h4>
                {selectedDate && (
                  <span className="text-[11px] text-primary-600 dark:text-primary-400 font-medium">
                    當前查看：{selectedDate}
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                {weatherData.daily.map((day) => {
                  const { dateText, weekday } = formatDayLabel(day.date);
                  const isCurrentDay = day.date === selectedDate;

                  return (
                    <div
                      key={day.date}
                      className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                        isCurrentDay
                          ? 'bg-primary-50 dark:bg-primary-950/40 border-primary-300 dark:border-primary-800 shadow-xs'
                          : 'bg-white dark:bg-neutral-900 border-stone-100 dark:border-neutral-800 hover:border-stone-200 dark:hover:border-neutral-700'
                      }`}
                    >
                      {/* Date & Weekday */}
                      <div className="flex items-center gap-2.5 w-24 flex-shrink-0">
                        <span className={`text-xs font-bold font-mono ${isCurrentDay ? 'text-primary-700 dark:text-primary-300' : 'text-stone-800 dark:text-neutral-200'}`}>
                          {dateText}
                        </span>
                        <span className="text-[11px] text-stone-400 dark:text-neutral-500">
                          {weekday}
                        </span>
                      </div>

                      {/* Icon & Weather Condition */}
                      <div className="flex items-center gap-2 flex-1 min-w-0 px-2">
                        <WeatherIcon type={day.iconType} className="w-4 h-4 flex-shrink-0" />
                        <span className="text-xs font-medium text-stone-700 dark:text-neutral-300 truncate">
                          {day.weatherText}
                        </span>
                      </div>

                      {/* Rain Probability */}
                      <div className="flex items-center gap-1 text-[11px] text-sky-600 dark:text-sky-400 font-mono w-16 justify-end">
                        <Umbrella className="w-3 h-3 flex-shrink-0" />
                        <span>{day.precipProbability}%</span>
                      </div>

                      {/* Temp Range */}
                      <div className="text-right font-mono text-xs w-24 flex-shrink-0">
                        <span className="font-bold text-stone-900 dark:text-white">
                          {day.tempMax}°
                        </span>
                        <span className="text-stone-400 dark:text-neutral-500 mx-1">/</span>
                        <span className="text-stone-500 dark:text-neutral-400">
                          {day.tempMin}°
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Attribution & Tech Info */}
          <div className="pt-2 border-t border-stone-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-stone-400 dark:text-neutral-600">
            <span>免費開源 API：Open-Meteo Weather</span>
            <span>支援離線快取 • 免金鑰</span>
          </div>
        </div>
      </div>
    </div>
  );
};
