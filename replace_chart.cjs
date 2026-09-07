const fs = require('fs');

let content = fs.readFileSync('src/components/BudgetView.tsx', 'utf8');

// 1. Add recharts import
const rechartsImport = "import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';\n";
content = content.replace("import { convertCurrency,", rechartsImport + "import { convertCurrency,");

// 2. Prepare chart data
const oldCategoryTotals = `  // Category breakdown
  const categoryTotals: Record<Expense['category'], number> = {
    food: 0,
    lodging: 0,
    transport: 0,
    shopping: 0,
    ticket: 0,
    other: 0,
  };
  trip.expenses.forEach((exp) => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.convertedAmount;
  });`;

const newCategoryTotals = `  // Category breakdown
  const categoryTotals: Record<Expense['category'], number> = {
    food: 0,
    lodging: 0,
    transport: 0,
    shopping: 0,
    ticket: 0,
    other: 0,
  };
  trip.expenses.forEach((exp) => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.convertedAmount;
  });

  const pieChartData = [
    { name: '餐飲美食', value: categoryTotals.food, color: '#f59e0b' },
    { name: '交通通行', value: categoryTotals.transport, color: '#10b981' },
    { name: '飯店住宿', value: categoryTotals.lodging, color: '#a855f7' },
    { name: '購物商場', value: categoryTotals.shopping, color: '#ec4899' },
    { name: '景點門票', value: categoryTotals.ticket, color: '#3b82f6' },
    { name: '其他雜支', value: categoryTotals.other, color: '#9ca3af' },
  ].filter(item => item.value > 0);`;

content = content.replace(oldCategoryTotals, newCategoryTotals);

// 3. Replace the chart render
const oldChartRender = `<div className="space-y-3">
              {[
                { label: '餐飲美食', val: categoryTotals.food, color: 'bg-amber-500' },
                { label: '交通通行', val: categoryTotals.transport, color: 'bg-emerald-500' },
                { label: '飯店住宿', val: categoryTotals.lodging, color: 'bg-purple-500' },
                { label: '購物商場', val: categoryTotals.shopping, color: 'bg-pink-500' },
                { label: '景點門票', val: categoryTotals.ticket, color: 'bg-blue-500' },
                { label: '其他雜支', val: categoryTotals.other, color: 'bg-neutral-400' },
              ]
                .filter((item) => item.val > 0)
                .map((cat) => {
                  const pct = totalSpent > 0 ? Math.round((cat.val / totalSpent) * 100) : 0;
                  return (
                    <div key={cat.label} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                        <span>{cat.label}</span>
                        <span>{formatMoney(cat.val, trip.baseCurrency)} ({pct}%)</span>
                      </div>
                      <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div className={\`h-full \${cat.color} rounded-full\`} style={{ width: \`\${pct}%\` }} />
                      </div>
                    </div>
                  );
                })}
            </div>`;

const newChartRender = `            <div className="h-64 w-full mt-4">
              {pieChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={\`cell-\${index}\`} fill={entry.color} stroke="transparent" />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      formatter={(value: number) => formatMoney(value, trip.baseCurrency)}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      iconType="circle"
                      wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 dark:text-neutral-500 space-y-2">
                  <PieChart className="w-8 h-8 opacity-20" />
                  <p className="text-xs">尚無消費記錄</p>
                </div>
              )}
            </div>`;

content = content.replace(oldChartRender, newChartRender);

fs.writeFileSync('src/components/BudgetView.tsx', content);
