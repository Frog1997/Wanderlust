const fs = require('fs');

let content = fs.readFileSync('src/components/BudgetView.tsx', 'utf8');

const targetStr = `                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                        類別
                      </label>
                      <div className="relative">
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className="appearance-none w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-600 text-sm bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 pr-8"
                      >
                        <option value="food">🍜 餐飲美食</option>
                        <option value="lodging">🏨 飯店住宿</option>
                        <option value="transport">🚆 交通通行</option>
                        <option value="shopping">🛍️ 購物商場</option>
                        <option value="ticket">🎫 景點門票</option>
                        <option value="other">📌 其他雜支</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                    </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                        日期
                      </label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 dark:border-neutral-600 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
                        由誰先代付 (Payer)
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsMemberModalOpen(true)}
                        className="text-[11px] font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400 flex items-center gap-1"
                      >
                        <UserPlus className="w-3 h-3" />
                        <span>新增/管理成員</span>
                      </button>
                    </div>
                    <div className="relative">
                      <select
                      value={paidBy}
                      onChange={(e) => setPaidBy(e.target.value)}
                      className="appearance-none w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-600 text-sm bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 pr-8"
                    >
                      {trip.collaborators.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                    </div>
                  </div>`;

const newStr = `                  </div>

                  {/* Category Grid */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-2">
                      消費類別
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {[
                        { id: 'food', icon: '🍜', label: '餐飲美食' },
                        { id: 'lodging', icon: '🏨', label: '飯店住宿' },
                        { id: 'transport', icon: '🚆', label: '交通通行' },
                        { id: 'shopping', icon: '🛍️', label: '購物商場' },
                        { id: 'ticket', icon: '🎫', label: '景點門票' },
                        { id: 'other', icon: '📌', label: '其他雜支' },
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setCategory(cat.id as any);
                          }}
                          className={\`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl border transition-all \${
                            category === cat.id
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300 shadow-sm ring-1 ring-primary-500'
                              : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-500 hover:border-neutral-300 dark:hover:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                          }\`}
                        >
                          <span className="text-xl mb-1.5">{cat.icon}</span>
                          <span className="text-[10px] font-bold tracking-wider">{cat.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                        日期
                      </label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-600 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-neutral-900"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
                          由誰先代付 (Payer)
                        </label>
                        <button
                          type="button"
                          onClick={() => setIsMemberModalOpen(true)}
                          className="text-[11px] font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400 flex items-center gap-1"
                        >
                          <UserPlus className="w-3 h-3" />
                          <span>管理成員</span>
                        </button>
                      </div>
                      <div className="relative">
                        <select
                          value={paidBy}
                          onChange={(e) => setPaidBy(e.target.value)}
                          className="appearance-none w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-600 text-sm bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 pr-8"
                        >
                          {trip.collaborators.map((c) => (
                            <option key={c.id} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, newStr);
  fs.writeFileSync('src/components/BudgetView.tsx', content);
  console.log("Success");
} else {
  console.log("Target not found");
}
