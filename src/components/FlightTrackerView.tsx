import React, { useState, useEffect } from 'react';
import { Trip, FlightInfo } from '../types';
import { 
  Plane, 
  Plus, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  Luggage, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  ShieldCheck, 
  Trash2,
  BellRing,
  Globe2
} from 'lucide-react';

interface FlightTrackerViewProps {
  trip: Trip;
  onUpdateTrip: (updated: Trip) => void;
}

export const FlightTrackerView: React.FC<FlightTrackerViewProps> = ({
  trip,
  onUpdateTrip,
}) => {
  const [isAddingFlight, setIsAddingFlight] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Form State
  const [flightNumber, setFlightNumber] = useState('');
  const [airline, setAirline] = useState('長榮航空 EVA Air');
  const [depAirport, setDepAirport] = useState('TPE (桃園機場 T2)');
  const [depCity, setDepCity] = useState('台北 Taipei');
  const [depTime, setDepTime] = useState('2025-10-15 09:00');
  const [arrAirport, setArrAirport] = useState('NRT (成田機場 T1)');
  const [arrCity, setArrCity] = useState('東京 Tokyo');
  const [arrTime, setArrTime] = useState('2025-10-15 13:15');
  const [terminal, setTerminal] = useState('T2');
  const [gate, setGate] = useState('C5');
  const [seat, setSeat] = useState('15A');
  const [bookingRef, setBookingRef] = useState('');

  // Clock ticker
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSaveFlight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!flightNumber.trim()) return;

    const newFlight: FlightInfo = {
      id: `fl-${Date.now()}`,
      flightNumber: flightNumber.trim().toUpperCase(),
      airline,
      departureAirport: depAirport,
      departureCity: depCity,
      departureTime: depTime,
      arrivalAirport: arrAirport,
      arrivalCity: arrCity,
      arrivalTime: arrTime,
      terminal,
      gate,
      baggageClaim: 'Belt ' + Math.floor(Math.random() * 6 + 1),
      status: 'ON_TIME',
      seat,
      bookingRef: bookingRef.trim() || 'BK' + Math.floor(100000 + Math.random() * 900000),
    };

    onUpdateTrip({
      ...trip,
      flights: [...trip.flights, newFlight],
    });

    setIsAddingFlight(false);
    setFlightNumber('');
  };

  const handleDeleteFlight = (id: string) => {
    onUpdateTrip({
      ...trip,
      flights: trip.flights.filter((f) => f.id !== id),
    });
  };

  const getStatusBadge = (status: FlightInfo['status']) => {
    switch (status) {
      case 'ON_TIME':
        return <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200">準點 ON TIME</span>;
      case 'BOARDING':
        return <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-lg border border-amber-200 animate-pulse">登機中 BOARDING</span>;
      case 'DELAYED':
        return <span className="px-2.5 py-1 bg-rose-50 text-rose-700 text-xs font-bold rounded-lg border border-rose-200">延誤 DELAYED</span>;
      case 'LANDED':
        return <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-200">已抵達 LANDED</span>;
      default:
        return <span className="px-2.5 py-1 bg-stone-100 dark:bg-neutral-800 text-stone-700 dark:text-neutral-300 text-xs font-bold rounded-lg">待確認 SCHEDULED</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Timezone Clocks */}
      <div className="bg-gradient-to-r from-stone-900 via-primary-950 to-stone-900 text-white p-6 rounded-2xl shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary-300 text-xs font-bold">
              <Globe2 className="w-4 h-4" />
              <span>跨國雙時區即時時鐘 (Dual Timezone Clock)</span>
            </div>
            <h2 className="text-xl font-black text-white">航班即時狀態雷達與登機提醒</h2>
          </div>

          {/* Dual Clocks */}
          <div className="flex items-center gap-4">
            <div className="bg-white/10 dark:bg-neutral-900/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/15 text-center">
              <div className="text-[10px] text-stone-300 font-bold uppercase">台北 (GMT+8)</div>
              <div className="text-lg font-mono font-bold text-white mt-0.5">
                {currentTime.toLocaleTimeString('zh-TW', { timeZone: 'Asia/Taipei', hour12: false })}
              </div>
            </div>
            <div className="bg-white/10 dark:bg-neutral-900/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/15 text-center">
              <div className="text-[10px] text-primary-300 font-bold uppercase">東京 (GMT+9)</div>
              <div className="text-lg font-mono font-bold text-primary-200 mt-0.5">
                {currentTime.toLocaleTimeString('zh-TW', { timeZone: 'Asia/Tokyo', hour12: false })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Flight Radar Notice Bar */}
      <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-start gap-3 text-xs text-emerald-900">
        <BellRing className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold">即時起降提醒：</span>
          <p className="leading-relaxed">
            國際線航班建議於起飛前 2.5 ~ 3 小時抵達機場辦理報到手續與託運行李。請隨時留意機場廣播與登機門最新動態。
          </p>
        </div>
      </div>

      {/* Flight Cards List Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
          <Plane className="w-5 h-5 text-primary-600" />
          <span>機票與航班資訊 ({trip.flights.length} 班)</span>
        </h3>

        <button
          onClick={() => setIsAddingFlight(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>新增航班</span>
        </button>
      </div>

      {/* Flight Cards Grid */}
      <div className="space-y-4">
        {trip.flights.map((flight) => (
          <div
            key={flight.id}
            className="bg-white dark:bg-neutral-900 rounded-2xl border border-stone-200 dark:border-neutral-700 shadow-sm overflow-hidden hover:border-stone-300 dark:border-neutral-600 hover:shadow-md transition-all"
          >
            {/* Ticket Header Banner */}
            <div className="p-4 sm:p-5 bg-stone-50/80 dark:bg-neutral-950/80 border-b border-stone-200 dark:border-neutral-700 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center font-bold">
                  <Plane className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-black text-stone-900 dark:text-white">{flight.flightNumber}</span>
                    <span className="text-xs text-stone-500 dark:text-neutral-500 font-semibold">{flight.airline}</span>
                  </div>
                  <div className="text-xs text-stone-400 dark:text-neutral-600">訂位代碼: {flight.bookingRef || 'TBD'}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {getStatusBadge(flight.status)}
                <button
                  onClick={() => handleDeleteFlight(flight.id)}
                  className="p-1.5 text-stone-300 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all"
                  title="刪除航班"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Flight Flightpath Diagram */}
            <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Departure */}
              <div>
                <div className="text-xs font-bold text-stone-400 dark:text-neutral-600 uppercase tracking-wider">出發 Departure</div>
                <div className="text-2xl font-black text-stone-900 dark:text-white mt-1">{flight.departureCity}</div>
                <div className="text-xs text-stone-500 dark:text-neutral-500 font-medium mt-0.5">{flight.departureAirport}</div>
                <div className="mt-2 text-sm font-mono font-bold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-lg inline-block">
                  {flight.departureTime}
                </div>
              </div>

              {/* Middle Plane route illustration */}
              <div className="text-center py-2 flex flex-col items-center justify-center">
                <div className="text-[11px] text-stone-400 dark:text-neutral-600 font-semibold mb-1">飛行時間 約 3 小時 15 分</div>
                <div className="w-full flex items-center justify-center gap-2 text-primary-500">
                  <div className="h-0.5 flex-1 bg-stone-200 dark:bg-neutral-700 border-dashed border-b border-primary-300"></div>
                  <Plane className="w-5 h-5 rotate-90" />
                  <div className="h-0.5 flex-1 bg-stone-200 dark:bg-neutral-700 border-dashed border-b border-primary-300"></div>
                </div>
                <div className="text-[11px] text-emerald-600 font-bold mt-1">直飛航班 (Direct Flight)</div>
              </div>

              {/* Arrival */}
              <div className="md:text-right">
                <div className="text-xs font-bold text-stone-400 dark:text-neutral-600 uppercase tracking-wider">抵達 Arrival</div>
                <div className="text-2xl font-black text-stone-900 dark:text-white mt-1">{flight.arrivalCity}</div>
                <div className="text-xs text-stone-500 dark:text-neutral-500 font-medium mt-0.5">{flight.arrivalAirport}</div>
                <div className="mt-2 text-sm font-mono font-bold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-lg inline-block">
                  {flight.arrivalTime}
                </div>
              </div>
            </div>

            {/* Boarding Details Strip */}
            <div className="px-5 py-3.5 bg-stone-50 dark:bg-neutral-950 border-t border-stone-100 dark:border-neutral-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-stone-400 dark:text-neutral-600 block text-[10px] uppercase font-bold">航廈 Terminal</span>
                <span className="font-bold text-stone-800 dark:text-neutral-200">{flight.terminal || 'T2'}</span>
              </div>
              <div>
                <span className="text-stone-400 dark:text-neutral-600 block text-[10px] uppercase font-bold">登機門 Gate</span>
                <span className="font-bold text-primary-600">{flight.gate || '尚未公告'}</span>
              </div>
              <div>
                <span className="text-stone-400 dark:text-neutral-600 block text-[10px] uppercase font-bold">座位 Seat</span>
                <span className="font-bold text-stone-800 dark:text-neutral-200">{flight.seat || '未選位'}</span>
              </div>
              <div>
                <span className="text-stone-400 dark:text-neutral-600 block text-[10px] uppercase font-bold">行李轉盤 Baggage</span>
                <span className="font-bold text-stone-800 dark:text-neutral-200">{flight.baggageClaim || '轉盤 4'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Flight Modal */}
      {isAddingFlight && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-neutral-900 w-full max-w-lg rounded-2xl shadow-2xl border border-stone-200 dark:border-neutral-700 overflow-hidden">
            <div className="p-5 bg-stone-50 dark:bg-neutral-950 border-b border-stone-200 dark:border-neutral-700 flex justify-between items-center">
              <h4 className="font-bold text-stone-900 dark:text-white text-base">新增機票 / 航班行程</h4>
              <button
                onClick={() => setIsAddingFlight(false)}
                className="text-stone-400 dark:text-neutral-600 hover:text-stone-600 dark:text-neutral-400 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveFlight} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-neutral-300 mb-1">航班代碼 (Flight #) *</label>
                  <input
                    type="text"
                    required
                    placeholder="例如：BR198, JX800"
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-neutral-700 text-sm uppercase font-mono font-bold focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-neutral-300 mb-1">航空公司</label>
                  <input
                    type="text"
                    placeholder="例如：星宇航空, 長榮航空"
                    value={airline}
                    onChange={(e) => setAirline(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-neutral-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Departure */}
              <div className="p-3 bg-stone-50 dark:bg-neutral-950 rounded-xl border border-stone-200 dark:border-neutral-700 space-y-2">
                <span className="text-xs font-bold text-primary-700">出發地資訊</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="出發城市 (例如：台北)"
                    value={depCity}
                    onChange={(e) => setDepCity(e.target.value)}
                    className="px-3 py-1.5 bg-white dark:bg-neutral-900 rounded-lg border border-stone-200 dark:border-neutral-700 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="出發機場 (例如：TPE 桃園)"
                    value={depAirport}
                    onChange={(e) => setDepAirport(e.target.value)}
                    className="px-3 py-1.5 bg-white dark:bg-neutral-900 rounded-lg border border-stone-200 dark:border-neutral-700 text-xs"
                  />
                </div>
                <input
                  type="text"
                  placeholder="出發日期時間 (YYYY-MM-DD HH:mm)"
                  value={depTime}
                  onChange={(e) => setDepTime(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white dark:bg-neutral-900 rounded-lg border border-stone-200 dark:border-neutral-700 text-xs font-mono"
                />
              </div>

              {/* Arrival */}
              <div className="p-3 bg-stone-50 dark:bg-neutral-950 rounded-xl border border-stone-200 dark:border-neutral-700 space-y-2">
                <span className="text-xs font-bold text-primary-700">目的地資訊</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="抵達城市 (例如：東京)"
                    value={arrCity}
                    onChange={(e) => setArrCity(e.target.value)}
                    className="px-3 py-1.5 bg-white dark:bg-neutral-900 rounded-lg border border-stone-200 dark:border-neutral-700 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="抵達機場 (例如：NRT 成田)"
                    value={arrAirport}
                    onChange={(e) => setArrAirport(e.target.value)}
                    className="px-3 py-1.5 bg-white dark:bg-neutral-900 rounded-lg border border-stone-200 dark:border-neutral-700 text-xs"
                  />
                </div>
                <input
                  type="text"
                  placeholder="抵達日期時間 (YYYY-MM-DD HH:mm)"
                  value={arrTime}
                  onChange={(e) => setArrTime(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white dark:bg-neutral-900 rounded-lg border border-stone-200 dark:border-neutral-700 text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-neutral-300 mb-1">航廈 Terminal</label>
                  <input
                    type="text"
                    placeholder="T2"
                    value={terminal}
                    onChange={(e) => setTerminal(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-neutral-700 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-neutral-300 mb-1">登機門 Gate</label>
                  <input
                    type="text"
                    placeholder="C5"
                    value={gate}
                    onChange={(e) => setGate(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-neutral-700 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-neutral-300 mb-1">座位號 Seat</label>
                  <input
                    type="text"
                    placeholder="12A"
                    value={seat}
                    onChange={(e) => setSeat(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-neutral-700 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddingFlight(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 dark:text-neutral-400 hover:bg-stone-100 dark:hover:bg-neutral-700 dark:bg-neutral-800"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-primary-600 hover:bg-primary-700 text-white shadow-sm"
                >
                  儲存航班
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
