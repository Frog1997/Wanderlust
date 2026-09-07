const fs = require('fs');
let content = fs.readFileSync('src/components/MemberSettlementModal.tsx', 'utf8');

const importAnchor = `import { formatMoney } from '../services/currency';`;
const importInjection = `import { formatMoney, convertCurrency } from '../services/currency';`;
content = content.replace(importAnchor, importInjection);

const propsAnchor = `  settlement: TripSettlementResult;
}`;
const propsInjection = `  settlement: TripSettlementResult;
  settlementCurrency: string;
  rates: Record<string, number>;
}`;
content = content.replace(propsAnchor, propsInjection);

const compAnchor = `  onClose,
  settlement,
}) => {`;
const compInjection = `  onClose,
  settlement,
  settlementCurrency,
  rates,
}) => {`;
content = content.replace(compAnchor, compInjection);

// Replace trip.baseCurrency with settlementCurrency globally in this file
content = content.replace(/trip\.baseCurrency/g, "settlementCurrency");

// Fix exp.convertedAmount manually
content = content.replace(/exp\.convertedAmount/g, "convertCurrency(exp.amount, exp.originalCurrency, settlementCurrency, rates)");

fs.writeFileSync('src/components/MemberSettlementModal.tsx', content);
console.log("MemberSettlementModal updated successfully.");
