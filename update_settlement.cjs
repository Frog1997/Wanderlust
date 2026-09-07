const fs = require('fs');

let content = fs.readFileSync('src/services/settlement.ts', 'utf8');

const importTarget = `import { formatMoney } from './currency';`;
const importReplace = `import { formatMoney, convertCurrency, getCachedRates } from './currency';`;
content = content.replace(importTarget, importReplace);

const fnTarget = `export function calculateTripSettlement(
  collaborators: Collaborator[],
  expenses: Expense[]
): TripSettlementResult {`;
const fnReplace = `export function calculateTripSettlement(
  collaborators: Collaborator[],
  expenses: Expense[],
  settlementCurrency?: string,
  rates: Record<string, number> = getCachedRates().rates
): TripSettlementResult {`;
content = content.replace(fnTarget, fnReplace);

const costTarget = `  expenses.forEach((exp) => {
    const totalCost = exp.convertedAmount;`;
const costReplace = `  expenses.forEach((exp) => {
    // Use target currency if specified, else use base currency (which is convertedAmount if no settlementCurrency is passed)
    const totalCost = settlementCurrency 
      ? convertCurrency(exp.amount, exp.originalCurrency, settlementCurrency, rates) 
      : exp.convertedAmount;`;
content = content.replace(costTarget, costReplace);

const shareTarget = `        return {
          expense: e,
          shareAmount: Math.round((e.convertedAmount / splitList.length) * 100) / 100,
        };`;
const shareReplace = `        return {
          expense: e,
          shareAmount: Math.round(((settlementCurrency ? convertCurrency(e.amount, e.originalCurrency, settlementCurrency, rates) : e.convertedAmount) / splitList.length) * 100) / 100,
        };`;
content = content.replace(shareTarget, shareReplace);

fs.writeFileSync('src/services/settlement.ts', content);
console.log("Updated settlement.ts");
