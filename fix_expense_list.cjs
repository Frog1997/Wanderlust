const fs = require('fs');
let content = fs.readFileSync('src/components/BudgetView.tsx', 'utf8');

const target1 = `<div className="relative mb-4">
              <input
                type="text"
                placeholder="搜尋消費記錄 (名稱、備註)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            </div>`;

const replace1 = `<div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="搜尋消費記錄 (名稱、備註)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              </div>
              <div className="w-full sm:w-[130px] flex-shrink-0">
                <CurrencyDropdown
                  value={settlementCurrency}
                  onChange={(val) => setSettlementCurrency(val)}
                  variant="form"
                />
              </div>
            </div>`;

if(content.includes(target1)) {
    content = content.replace(target1, replace1);
    console.log("Updated search bar with currency dropdown.");
}

const target2 = `<div className="text-right">
                      <div className="text-sm font-bold text-neutral-900 dark:text-white">
                        {formatMoney(exp.convertedAmount, trip.baseCurrency)}
                      </div>
                      {exp.originalCurrency !== trip.baseCurrency && (
                        <div className="text-[11px] text-neutral-400 dark:text-neutral-600">
                          {formatMoney(exp.amount, exp.originalCurrency)}
                        </div>
                      )}
                    </div>`;

const replace2 = `<div className="text-right">
                      <div className="text-sm font-bold text-neutral-900 dark:text-white">
                        {formatMoney(convertCurrency(exp.amount, exp.originalCurrency, settlementCurrency, currencyRates), settlementCurrency)}
                      </div>
                      {exp.originalCurrency !== settlementCurrency && (
                        <div className="text-[11px] text-neutral-400 dark:text-neutral-600">
                          {formatMoney(exp.amount, exp.originalCurrency)}
                        </div>
                      )}
                    </div>`;

if(content.includes(target2)) {
    content = content.replace(target2, replace2);
    console.log("Updated expense item conversion.");
}

fs.writeFileSync('src/components/BudgetView.tsx', content);
