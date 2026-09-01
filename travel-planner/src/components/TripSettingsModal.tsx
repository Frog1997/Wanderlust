import React, { useState } from 'react';
import { Trip } from '../types';
import { 
  Settings, 
  Plus, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Image as ImageIcon, 
  Compass,
  Check,
  Sparkles
} from 'lucide-react';
import { POPULAR_CURRENCIES } from '../services/storage';
import { CurrencyDropdown } from './CurrencyDropdown';

interface TripSettingsModalProps {
  trip: Trip;
  savedTrips: Trip[];
  isOpen: boolean;
  onClose: () => void;
  onSelectTrip: (trip: Trip) => void;
  onUpdateTrip: (updated: Trip) => void;
  onCreateNewTrip: (newTrip: Trip) => void;
}

const TEMPLATE_PRESETS: Partial<Trip>[] = [
  {
    title: '京都與奈良古都漫遊 4 天 3 夜',
    destination: '日本 京都 (Kyoto, Japan)',
    countryCode: 'JP',
    baseCurrency: 'TWD',
    targetCurrency: 'JPY',
    totalBudget: 60000,
    coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: '曼谷米其林美食與水療放鬆 5 天 4 夜',
    destination: '泰國 曼谷 (Bangkok, Thailand)',
    countryCode: 'TH',
    baseCurrency: 'TWD',
    targetCurrency: 'THB',
    totalBudget: 45000,
    coverImage: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: '首爾弘大聖水洞時尚探索 5 天 4 夜',
    destination: '韓國 首爾 (Seoul, Korea)',
    countryCode: 'KR',
    baseCurrency: 'TWD',
    targetCurrency: 'KRW',
    totalBudget: 55000,
    coverImage: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=1200&q=80',
  },
];

export const TripSettingsModal: React.FC<TripSettingsModalProps> = ({
  trip,
  savedTrips,
  isOpen,
  onClose,
  onSelectTrip,
  onUpdateTrip,
  onCreateNewTrip,
}) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'switch' | 'create' | 'aiImport'>('edit');

  // Edit current trip state
  const [title, setTitle] = useState(trip.title);
  const [destination, setDestination] = useState(trip.destination);
  const [startDate, setStartDate] = useState(trip.startDate);
  const [endDate, setEndDate] = useState(trip.endDate);
  const [totalBudget, setTotalBudget] = useState(trip.totalBudget);
  const [baseCurrency, setBaseCurrency] = useState(trip.baseCurrency);
  const [targetCurrency, setTargetCurrency] = useState(trip.targetCurrency);
  const [coverImage, setCoverImage] = useState(trip.coverImage);

  // AI Import state
  const [aiJsonStr, setAiJsonStr] = useState('');

  React.useEffect(() => {
    setTitle(trip.title);
    setDestination(trip.destination);
    setStartDate(trip.startDate);
    setEndDate(trip.endDate);
    setTotalBudget(trip.totalBudget);
    setBaseCurrency(trip.baseCurrency);
    setTargetCurrency(trip.targetCurrency);
    setCoverImage(trip.coverImage);
  }, [trip]);

  if (!isOpen) return null;

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTrip({
      ...trip,
      title,
      destination,
      startDate,
      endDate,
      totalBudget: Number(totalBudget),
      baseCurrency,
      targetCurrency,
      coverImage,
    });
    onClose();
  };

  const handleApplyPreset = (preset: Partial<Trip>) => {
    const newTrip: Trip = {
      id: `trip-${Date.now()}`,
      title: preset.title || '新旅程',
      destination: preset.destination || '海外目的地',
      countryCode: preset.countryCode || 'JP',
      startDate: '2025-11-10',
      endDate: '2025-11-14',
      coverImage: preset.coverImage || 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
      baseCurrency: preset.baseCurrency || 'TWD',
      targetCurrency: preset.targetCurrency || 'JPY',
      totalBudget: preset.totalBudget || 50000,
      shareCode: `TRIP-${Math.floor(1000 + Math.random() * 9000)}`,
      offlineReady: false,
      collaborators: trip.collaborators,
      flights: [],
      attractions: [],
      expenses: [],
      days: [
        {
          id: `day-${Date.now()}-1`,
          dayNumber: 1,
          date: '2025-11-10',
          themeTitle: '抵達目的地與市區初訪',
          items: [],
        },
        {
          id: `day-${Date.now()}-2`,
          dayNumber: 2,
          date: '2025-11-11',
          themeTitle: '經典名勝與代表美食巡禮',
          items: [],
        },
        {
          id: `day-${Date.now()}-3`,
          dayNumber: 3,
          date: '2025-11-12',
          themeTitle: '私房巷弄探店與購物商圈',
          items: [],
        },
      ],
    };

    onCreateNewTrip(newTrip);
    onClose();
  };

  const handleCreateBlankTrip = () => {
    handleApplyPreset({
      title: '全新空白行程',
      destination: '請設定目的地',
    });
  };

  const handleImportAIJson = () => {
    try {
      const parsed = JSON.parse(aiJsonStr);
      if (!parsed.title || !Array.isArray(parsed.days)) {
        alert('無效的行程格式，請確認包含 title 與 days 陣列。');
        return;
      }
      
      const newTrip: Trip = {
        id: `trip-${Date.now()}`,
        title: parsed.title,
        destination: parsed.destination || '未指定',
        countryCode: parsed.countryCode || 'JP',
        startDate: parsed.startDate || '2025-01-01',
        endDate: parsed.endDate || '2025-01-05',
        coverImage: parsed.coverImage || 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
        baseCurrency: parsed.baseCurrency || 'TWD',
        targetCurrency: parsed.targetCurrency || 'JPY',
        totalBudget: parsed.totalBudget || 50000,
        shareCode: `TRIP-${Math.floor(1000 + Math.random() * 9000)}`,
        offlineReady: false,
        collaborators: trip.collaborators, // keep current user
        flights: parsed.flights || [],
        attractions: parsed.attractions || [],
        expenses: parsed.expenses || [],
        days: parsed.days.map((d: any, i: number) => ({
          id: `day-${Date.now()}-${i}`,
          dayNumber: d.dayNumber || i + 1,
          date: d.date || `2025-01-0${i + 1}`,
          themeTitle: d.themeTitle || `第 ${i + 1} 天`,
          items: d.items?.map((item: any, j: number) => ({
            ...item,
            id: `item-${Date.now()}-${i}-${j}`
          })) || []
        })),
      };

      onCreateNewTrip(newTrip);
      setAiJsonStr('');
      onClose();
    } catch (err) {
      alert('JSON 解析失敗，請確認格式是否為正確的 JSON 格式。');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-neutral-900 w-full max-w-lg rounded-2xl shadow-2xl border border-stone-200 dark:border-neutral-700 overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 bg-stone-50 dark:bg-neutral-950 border-b border-stone-200 dark:border-neutral-700 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary-600" />
            <h3 className="font-bold text-stone-900 dark:text-white text-base">行程設定與旅行庫管理</h3>
          </div>
          <button onClick={onClose} className="text-stone-400 dark:text-neutral-600 hover:text-stone-600 dark:text-neutral-400 font-bold">
            ✕
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-stone-200 dark:border-neutral-700 bg-stone-50/50 dark:bg-neutral-950/50 p-1 overflow-x-auto scrollbar-none whitespace-nowrap">
          <button
            onClick={() => setActiveTab('edit')}
            className={`px-3 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'edit' ? 'bg-white dark:bg-neutral-900 text-primary-600 shadow-sm' : 'text-stone-600 dark:text-neutral-400 hover:text-stone-900 dark:hover:text-white dark:text-white'
            }`}
          >
            目前行程
          </button>
          <button
            onClick={() => setActiveTab('switch')}
            className={`px-3 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'switch' ? 'bg-white dark:bg-neutral-900 text-primary-600 shadow-sm' : 'text-stone-600 dark:text-neutral-400 hover:text-stone-900 dark:hover:text-white dark:text-white'
            }`}
          >
            我的旅程 ({savedTrips.length})
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`px-3 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'create' ? 'bg-white dark:bg-neutral-900 text-primary-600 shadow-sm' : 'text-stone-600 dark:text-neutral-400 hover:text-stone-900 dark:hover:text-white dark:text-white'
            }`}
          >
            探索預設範本
          </button>
          <button
            onClick={() => setActiveTab('aiImport')}
            className={`px-3 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'aiImport' ? 'bg-white dark:bg-neutral-900 text-primary-600 shadow-sm' : 'text-stone-600 dark:text-neutral-400 hover:text-stone-900 dark:hover:text-white dark:text-white'
            }`}
          >
            ✨ AI 匯入
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {activeTab === 'edit' && (
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-neutral-300 mb-1">行程標題 *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-neutral-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-neutral-300 mb-1">目的地城市與國家 *</label>
                <input
                  type="text"
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-neutral-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-neutral-300 mb-1">出發日期</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-neutral-700 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-neutral-300 mb-1">結束日期</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-neutral-700 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-neutral-300 mb-1">總預算</label>
                  <input
                    type="number"
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-neutral-700 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-neutral-300 mb-1">本國幣別 (Base)</label>
                  <CurrencyDropdown
                    value={baseCurrency}
                    onChange={setBaseCurrency}
                    variant="form"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-neutral-300 mb-1">當地幣別 (Local)</label>
                  <CurrencyDropdown
                    value={targetCurrency}
                    onChange={setTargetCurrency}
                    variant="form"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-neutral-300 mb-1">封面圖片網址</label>
                <input
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-neutral-700 text-xs focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 dark:text-neutral-400 hover:bg-stone-100 dark:hover:bg-neutral-700 dark:bg-neutral-800"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-primary-600 hover:bg-primary-700 text-white shadow-sm"
                >
                  儲存修改
                </button>
              </div>
            </form>
          )}

          {activeTab === 'switch' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-stone-700 dark:text-neutral-300">已儲存的旅行專案</h4>
                <button
                  onClick={handleCreateBlankTrip}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>建立全新空白行程</span>
                </button>
              </div>
              <div className="space-y-3">
                {savedTrips.map((st) => (
                <div
                  key={st.id}
                  onClick={() => {
                    onSelectTrip(st);
                    onClose();
                  }}
                  className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                    st.id === trip.id
                      ? 'bg-primary-50 border-primary-300 shadow-sm'
                      : 'bg-white dark:bg-neutral-900 border-stone-200 dark:border-neutral-700 hover:border-stone-300 dark:border-neutral-600 hover:bg-stone-50 dark:hover:bg-neutral-800 dark:bg-neutral-950'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img src={st.coverImage} alt={st.title} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <h4 className="text-sm font-bold text-stone-900 dark:text-white">{st.title}</h4>
                      <p className="text-xs text-stone-500 dark:text-neutral-500">{st.destination} • {st.days.length} 天</p>
                    </div>
                  </div>

                  {st.id === trip.id && (
                    <span className="p-1 bg-primary-600 text-white rounded-full">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
              ))}
            </div>
            </div>
          )}

          {activeTab === 'create' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-stone-700 dark:text-neutral-300">選擇人氣海外行程範本建立</h4>
              {TEMPLATE_PRESETS.map((preset, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-stone-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:border-primary-300 hover:shadow-md transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img src={preset.coverImage} alt={preset.title} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <h4 className="text-sm font-bold text-stone-900 dark:text-white">{preset.title}</h4>
                      <p className="text-xs text-stone-500 dark:text-neutral-500">{preset.destination}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleApplyPreset(preset)}
                    className="px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition-all whitespace-nowrap shadow-sm"
                  >
                    套用範本
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'aiImport' && (
            <div className="space-y-4">
              <div className="bg-primary-50/50 p-4 rounded-xl border border-primary-100 text-xs text-primary-900 space-y-2 leading-relaxed">
                <p className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-primary-600" />
                  <span>透過第三方 AI (如 ChatGPT, Claude) 匯入</span>
                </p>
                <p>您可以先與其他 AI 助手規劃行程，並要求對方嚴格輸出以下 JSON 結構，複製貼上即可一鍵匯入為新旅程：</p>
                <div className="relative group mt-2">
                  <pre className="p-3 bg-stone-900 text-primary-300 rounded-lg overflow-x-auto text-[10px] font-mono leading-normal">
{`{
  "title": "我的 AI 規劃行程",
  "destination": "東京",
  "days": [
    {
      "dayNumber": 1,
      "themeTitle": "淺草文化之旅",
      "items": [
        {
          "title": "雷門",
          "time": "10:00",
          "category": "sightseeing"
        }
      ]
    }
  ]
}`}
                  </pre>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-neutral-300 mb-2">貼上 AI 產生的 JSON</label>
                <textarea
                  rows={8}
                  placeholder="請在此貼上 JSON 程式碼..."
                  value={aiJsonStr}
                  onChange={(e) => setAiJsonStr(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl border border-stone-200 dark:border-neutral-700 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 bg-stone-50 dark:bg-neutral-950"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 dark:text-neutral-400 hover:bg-stone-100 dark:hover:bg-neutral-700 dark:bg-neutral-800"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleImportAIJson}
                  disabled={!aiJsonStr.trim()}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white shadow-sm"
                >
                  確認匯入並建立
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
