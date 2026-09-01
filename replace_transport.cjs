const fs = require('fs');
const content = fs.readFileSync('src/components/ItineraryView.tsx', 'utf8');

const targetStr = `              {/* Transport to next option */}
              <div className="p-3 bg-stone-50 dark:bg-neutral-950 rounded-xl border border-stone-200 dark:border-neutral-700">
                <label className="block text-xs font-bold text-stone-700 dark:text-neutral-300 mb-2">
                  抵達下一個點之交通方式
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={transportMode}
                    onChange={(e) => setTransportMode(e.target.value as any)}
                    className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-neutral-700 text-xs bg-white dark:bg-neutral-900"
                  >
                    <option value="walk">🚶 步行 Walk</option>
                    <option value="subway">🚇 地鐵 Subway</option>
                    <option value="bus">🚌 公車 Bus</option>
                    <option value="taxi">🚕 計程車 Taxi</option>
                    <option value="bullet_train">🚄 新幹線 / 鐵路</option>
                  </select>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={transportDuration}
                      onChange={(e) => setTransportDuration(Number(e.target.value))}
                      className="w-16 px-2 py-1.5 rounded-lg border border-stone-200 dark:border-neutral-700 text-xs bg-white dark:bg-neutral-900 text-center"
                    />
                    <span className="text-xs text-stone-600 dark:text-neutral-400">分鐘</span>
                  </div>
                </div>
                
                {/* Transport Routes */}
                <div className="mt-3 space-y-2">
                  <label className="block text-[11px] font-bold text-stone-600 dark:text-neutral-400">
                    交通方式詳情與導航網址 (可加入多筆)
                  </label>
                  {transportRoutes.map((route, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="例如: 搭乘東急東橫線"
                        value={route.label}
                        onChange={(e) => {
                          const newRoutes = [...transportRoutes];
                          newRoutes[i] = { ...newRoutes[i], label: e.target.value };
                          setTransportRoutes(newRoutes);
                        }}
                        className="w-1/3 px-2 py-1.5 rounded-lg border border-stone-200 dark:border-neutral-700 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <input
                        type="url"
                        placeholder="Google Maps 路線網址..."
                        value={route.url}
                        onChange={(e) => {
                          const newRoutes = [...transportRoutes];
                          newRoutes[i] = { ...newRoutes[i], url: e.target.value };
                          setTransportRoutes(newRoutes);
                        }}
                        className="w-2/3 px-2 py-1.5 rounded-lg border border-stone-200 dark:border-neutral-700 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newRoutes = [...transportRoutes];
                          newRoutes.splice(i, 1);
                          setTransportRoutes(newRoutes);
                        }}
                        className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setTransportRoutes([...transportRoutes, { label: '', url: '' }])}
                    className="flex items-center gap-1 px-3 py-1 text-[11px] font-bold text-stone-500 bg-stone-100 hover:bg-stone-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    加入交通網址
                  </button>
                </div>
              </div>`;

const replacement = `              {/* Transport to next option */}
              <div className="p-3 bg-stone-50 dark:bg-neutral-950 rounded-xl border border-stone-200 dark:border-neutral-700 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-stone-700 dark:text-neutral-300">
                    抵達下一個點之交通方式
                  </label>
                  <button
                    type="button"
                    onClick={() => setTransportOptions([...transportOptions, { mode: 'car', durationMinutes: 15, routes: [] }])}
                    className="flex items-center gap-1 px-2 py-1 text-[11px] font-bold text-primary-600 bg-primary-50 hover:bg-primary-100 dark:bg-primary-950/30 dark:hover:bg-primary-950/50 rounded-lg transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    新增備選方案
                  </button>
                </div>

                {transportOptions.map((opt, optIndex) => (
                  <div key={optIndex} className="p-2 border border-stone-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 relative">
                    {transportOptions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newOpts = [...transportOptions];
                          newOpts.splice(optIndex, 1);
                          setTransportOptions(newOpts);
                        }}
                        className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg z-10"
                        title="移除此方案"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    
                    <div className="grid grid-cols-2 gap-2 pr-8">
                      <select
                        value={opt.mode}
                        onChange={(e) => {
                          const newOpts = [...transportOptions];
                          newOpts[optIndex] = { ...newOpts[optIndex], mode: e.target.value as any };
                          setTransportOptions(newOpts);
                        }}
                        className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-neutral-700 text-xs bg-white dark:bg-neutral-900"
                      >
                        <option value="walk">🚶 步行 Walk</option>
                        <option value="subway">🚇 地鐵 Subway</option>
                        <option value="bus">🚌 公車 Bus</option>
                        <option value="taxi">🚕 計程車 Taxi</option>
                        <option value="bullet_train">🚄 新幹線 / 鐵路</option>
                        <option value="car">🚗 自駕 / 租車</option>
                      </select>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={opt.durationMinutes}
                          onChange={(e) => {
                            const newOpts = [...transportOptions];
                            newOpts[optIndex] = { ...newOpts[optIndex], durationMinutes: Number(e.target.value) };
                            setTransportOptions(newOpts);
                          }}
                          className="w-16 px-2 py-1.5 rounded-lg border border-stone-200 dark:border-neutral-700 text-xs bg-white dark:bg-neutral-900 text-center"
                        />
                        <span className="text-xs text-stone-600 dark:text-neutral-400">分鐘</span>
                      </div>
                    </div>
                    
                    {/* Transport Routes */}
                    <div className="mt-3 space-y-2">
                      <label className="block text-[11px] font-bold text-stone-600 dark:text-neutral-400">
                        交通方式詳情與導航網址 (可加入多筆)
                      </label>
                      {(opt.routes || []).map((route, i) => (
                        <div key={i} className="flex gap-2">
                          <input
                            type="text"
                            placeholder="例如: 停車場A、搭乘銀座線"
                            value={route.label}
                            onChange={(e) => {
                              const newOpts = [...transportOptions];
                              const newRoutes = [...(newOpts[optIndex].routes || [])];
                              newRoutes[i] = { ...newRoutes[i], label: e.target.value };
                              newOpts[optIndex] = { ...newOpts[optIndex], routes: newRoutes };
                              setTransportOptions(newOpts);
                            }}
                            className="w-1/3 px-2 py-1.5 rounded-lg border border-stone-200 dark:border-neutral-700 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                          <input
                            type="url"
                            placeholder="Google Maps 路線或地點網址..."
                            value={route.url}
                            onChange={(e) => {
                              const newOpts = [...transportOptions];
                              const newRoutes = [...(newOpts[optIndex].routes || [])];
                              newRoutes[i] = { ...newRoutes[i], url: e.target.value };
                              newOpts[optIndex] = { ...newOpts[optIndex], routes: newRoutes };
                              setTransportOptions(newOpts);
                            }}
                            className="w-2/3 px-2 py-1.5 rounded-lg border border-stone-200 dark:border-neutral-700 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newOpts = [...transportOptions];
                              const newRoutes = [...(newOpts[optIndex].routes || [])];
                              newRoutes.splice(i, 1);
                              newOpts[optIndex] = { ...newOpts[optIndex], routes: newRoutes };
                              setTransportOptions(newOpts);
                            }}
                            className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          const newOpts = [...transportOptions];
                          newOpts[optIndex] = { ...newOpts[optIndex], routes: [...(newOpts[optIndex].routes || []), { label: '', url: '' }] };
                          setTransportOptions(newOpts);
                        }}
                        className="flex items-center gap-1 px-3 py-1 text-[11px] font-bold text-stone-500 bg-stone-100 hover:bg-stone-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        加入路線或地點網址
                      </button>
                    </div>
                  </div>
                ))}
              </div>`;

if(content.includes(targetStr)) {
  fs.writeFileSync('src/components/ItineraryView.tsx', content.replace(targetStr, replacement));
  console.log('Successfully replaced transport rendering section');
} else {
  console.error('Target string not found!');
  // To help debug, find some part of it
  console.log(content.includes("抵達下一個點之交通方式"));
}
