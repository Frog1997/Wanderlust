const fs = require('fs');
let content = fs.readFileSync('src/components/BudgetView.tsx', 'utf8');

const target = `{balance > 0.01
                            ? \`應收 +\${formatMoney(balance, trip.baseCurrency)}\`
                            : balance < -0.01
                            ? \`應付 -\${formatMoney(Math.abs(balance), trip.baseCurrency)}\`
                            : '結算平衡 $0'}`;

const replace = `{balance > 0.01
                            ? \`應收 +\${formatMoney(balance, settlementCurrency)}\`
                            : balance < -0.01
                            ? \`應付 -\${formatMoney(Math.abs(balance), settlementCurrency)}\`
                            : '結算平衡 $0'}`;

if(content.includes(target)) {
    content = content.replace(target, replace);
    fs.writeFileSync('src/components/BudgetView.tsx', content);
    console.log("Fixed balance formatting in BudgetView");
} else {
    console.log("Could not find balance formatting");
}
