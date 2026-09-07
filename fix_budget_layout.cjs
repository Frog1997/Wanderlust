const fs = require('fs');

let content = fs.readFileSync('src/components/BudgetView.tsx', 'utf8');

const targetLayout = `<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                        日期
                      </label>
                      <DatePicker
                        selected={date ? new Date(date) : null}
                        onChange={(d) => {
                          if (d) {
                            const tzOffset = d.getTimezoneOffset() * 60000;
                            const localISOTime = (new Date(d.getTime() - tzOffset)).toISOString().split('T')[0];
                            setDate(localISOTime);
                          }
                        }}
                        dateFormat="yyyy-MM-dd"
                        placeholderText="選擇日期"
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
                      
                      {/* Chips styled selector for Payer */}
                      <div className="flex overflow-x-auto gap-2 pb-1 hide-scrollbar">
                        {trip.collaborators.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setPaidBy(c.name);
                            }}
                            className={\`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border \${
                              paidBy === c.name
                                ? 'bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300 border-primary-500 shadow-sm ring-1 ring-primary-500'
                                : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                            }\`}
                          >
                            <div className="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/60 text-primary-700 dark:text-primary-400 flex items-center justify-center text-[10px]">
                              {c.name.charAt(0).toUpperCase()}
                            </div>
                            <span>{c.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>`;

const replaceLayout = `<div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                        日期
                      </label>
                      <DatePicker
                        selected={date ? new Date(date) : null}
                        onChange={(d) => {
                          if (d) {
                            const tzOffset = d.getTimezoneOffset() * 60000;
                            const localISOTime = (new Date(d.getTime() - tzOffset)).toISOString().split('T')[0];
                            setDate(localISOTime);
                          }
                        }}
                        dateFormat="yyyy-MM-dd"
                        placeholderText="選擇日期"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-600 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-neutral-900"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
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
                      
                      {/* Chips styled selector for Payer */}
                      <div className="flex flex-wrap gap-2 pb-1">
                        {trip.collaborators.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setPaidBy(c.name);
                            }}
                            className={\`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border \${
                              paidBy === c.name
                                ? 'bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300 border-primary-500 shadow-sm ring-1 ring-primary-500'
                                : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                            }\`}
                          >
                            <div className="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/60 text-primary-700 dark:text-primary-400 flex items-center justify-center text-[10px]">
                              {c.name.charAt(0).toUpperCase()}
                            </div>
                            <span>{c.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>`;

if (content.includes(targetLayout)) {
  content = content.replace(targetLayout, replaceLayout);
  fs.writeFileSync('src/components/BudgetView.tsx', content);
  console.log("BudgetView layout updated successfully.");
} else {
  console.log("BudgetView string not found.");
}
