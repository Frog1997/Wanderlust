const fs = require('fs');

let content = fs.readFileSync('src/components/BudgetView.tsx', 'utf8');

// Add settlementCurrency state
const stateAnchor = `const [searchQuery, setSearchQuery] = useState('');`;
const stateInjection = `const [settlementCurrency, setSettlementCurrency] = useState(trip.targetCurrency || trip.baseCurrency || 'JPY');
  const [searchQuery, setSearchQuery] = useState('');`;
if(content.includes(stateAnchor)) {
    content = content.replace(stateAnchor, stateInjection);
}

// Update settlement calculation
const calcAnchor = `const settlement = calculateTripSettlement(trip.collaborators, trip.expenses);`;
const calcInjection = `const settlement = calculateTripSettlement(trip.collaborators, trip.expenses, settlementCurrency, currencyRates);`;
if(content.includes(calcAnchor)) {
    content = content.replace(calcAnchor, calcInjection);
}

// Pass to MemberSettlementModal
const modalAnchor = `<MemberSettlementModal
        trip={trip}
        isOpen={!!selectedSettlementMember}
        selectedMemberName={selectedSettlementMember || ''}
        onSelectMember={setSelectedSettlementMember}
        onClose={() => setSelectedSettlementMember(null)}
        settlement={settlement}
      />`;
const modalInjection = `<MemberSettlementModal
        trip={trip}
        isOpen={!!selectedSettlementMember}
        selectedMemberName={selectedSettlementMember || ''}
        onSelectMember={setSelectedSettlementMember}
        onClose={() => setSelectedSettlementMember(null)}
        settlement={settlement}
        settlementCurrency={settlementCurrency}
        rates={currencyRates}
      />`;
if(content.includes(modalAnchor)) {
    content = content.replace(modalAnchor, modalInjection);
}

// Add dropdown to AA card
const headerAnchor = `<div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary-600" />
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">同行夥伴 AA 分帳結算</h3>
              </div>
              <button`;
const headerInjection = `<div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary-600" />
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">同行夥伴 AA 分帳結算</h3>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={settlementCurrency}
                  onChange={(e) => setSettlementCurrency(e.target.value)}
                  className="px-2 py-1 text-xs rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  {POPULAR_CURRENCIES.map(c => (
                    <option key={c.code} value={c.code}>{c.code}</option>
                  ))}
                </select>
                <button`;
if(content.includes(headerAnchor)) {
    content = content.replace(headerAnchor, headerInjection);
}

// Update generateAllSettlementText to use settlementCurrency
const copyAnchor = `const text = generateAllSettlementText(trip.title, trip.baseCurrency, trip.collaborators, settlement);`;
const copyInjection = `const text = generateAllSettlementText(trip.title, settlementCurrency, trip.collaborators, settlement);`;
if(content.includes(copyAnchor)) {
    content = content.replace(copyAnchor, copyInjection);
}

fs.writeFileSync('src/components/BudgetView.tsx', content);
console.log("BudgetView updated successfully.");
