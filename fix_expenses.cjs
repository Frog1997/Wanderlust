const fs = require('fs');

let content = fs.readFileSync('src/components/BudgetView.tsx', 'utf8');

const filterLogic = `          {/* Expense Items */}
          <div className="space-y-3">
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="搜尋消費記錄 (名稱、備註)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            </div>
            {trip.expenses.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-neutral-900 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-600 p-6">
                <DollarSign className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                <p className="text-xs text-neutral-500 dark:text-neutral-500">尚無任何支出記錄，點擊上方按鈕記錄第一筆花費。</p>
              </div>
            ) : (() => {
                const filteredExpenses = trip.expenses.filter(exp => 
                  exp.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                  (exp.notes && exp.notes.toLowerCase().includes(searchQuery.toLowerCase()))
                );

                if (filteredExpenses.length === 0) {
                  return (
                    <div className="text-center py-8 text-neutral-500 text-sm">
                      找不到符合「{searchQuery}」的消費記錄
                    </div>
                  );
                }

                return filteredExpenses.map((exp) => (`;

const replaceTarget = `          {/* Expense Items */}
          <div className="space-y-3">
            {trip.expenses.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-neutral-900 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-600 p-6">
                <DollarSign className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                <p className="text-xs text-neutral-500 dark:text-neutral-500">尚無任何支出記錄，點擊上方按鈕記錄第一筆花費。</p>
              </div>
            ) : (
              trip.expenses.map((exp) => (`

if (content.includes(replaceTarget)) {
    content = content.replace(replaceTarget, filterLogic);
} else {
    console.log("Failed to find replaceTarget for filtering");
}

const editBtn = `                    <div className="flex flex-col sm:flex-row items-center sm:gap-1 gap-2">
                      <button
                        onClick={() => handleEditExpense(exp)}
                        className="p-1.5 text-neutral-300 dark:text-neutral-500 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
                        title="編輯"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(exp.id)}
                        className="p-1.5 text-neutral-300 dark:text-neutral-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all"
                        title="刪除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ));
            })()}
          </div>`;

const replaceBtnTarget = `                    <button
                      onClick={() => setDeleteConfirmId(exp.id)}
                      className="p-1.5 text-neutral-300 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>`;

if (content.includes(replaceBtnTarget)) {
    content = content.replace(replaceBtnTarget, editBtn);
} else {
    console.log("Failed to find replaceBtnTarget for buttons");
}

fs.writeFileSync('src/components/BudgetView.tsx', content);
console.log("Completed");
