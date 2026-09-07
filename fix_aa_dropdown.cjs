const fs = require('fs');
let content = fs.readFileSync('src/components/BudgetView.tsx', 'utf8');

const target = `<select
                  value={settlementCurrency}
                  onChange={(e) => setSettlementCurrency(e.target.value)}
                  className="px-2 py-1 text-xs rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  {POPULAR_CURRENCIES.map(c => (
                    <option key={c.code} value={c.code}>{c.code}</option>
                  ))}
                </select>`;

const replace = `<div className="w-[120px]">
                  <CurrencyDropdown
                    value={settlementCurrency}
                    onChange={(val) => setSettlementCurrency(val)}
                    variant="form"
                  />
                </div>`;

if(content.includes(target)) {
    content = content.replace(target, replace);
    fs.writeFileSync('src/components/BudgetView.tsx', content);
    console.log("Replaced AA dropdown");
} else {
    console.log("Target AA dropdown not found");
}
