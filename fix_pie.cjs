const fs = require('fs');

let content = fs.readFileSync('src/components/BudgetView.tsx', 'utf8');

const anchor = `  trip.expenses.forEach((exp) => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.convertedAmount;
  });`;

const insertion = `

  const pieChartData = [
    { name: '餐飲美食', value: categoryTotals.food, color: '#f59e0b' },
    { name: '交通通行', value: categoryTotals.transport, color: '#10b981' },
    { name: '飯店住宿', value: categoryTotals.lodging, color: '#a855f7' },
    { name: '購物商場', value: categoryTotals.shopping, color: '#ec4899' },
    { name: '景點門票', value: categoryTotals.ticket, color: '#3b82f6' },
    { name: '其他雜支', value: categoryTotals.other, color: '#9ca3af' },
  ].filter(item => item.value > 0);
`;

content = content.replace(anchor, anchor + insertion);

fs.writeFileSync('src/components/BudgetView.tsx', content);
