const fs = require('fs');
let content = fs.readFileSync('src/components/BudgetView.tsx', 'utf8');

const target = `<MemberSettlementModal
          trip={trip}
          isOpen={!!selectedSettlementMember}
          selectedMemberName={selectedSettlementMember}
          onSelectMember={(name) => setSelectedSettlementMember(name)}
          onClose={() => setSelectedSettlementMember(null)}
          settlement={settlement}
        />`;

const replace = `<MemberSettlementModal
          trip={trip}
          isOpen={!!selectedSettlementMember}
          selectedMemberName={selectedSettlementMember}
          onSelectMember={(name) => setSelectedSettlementMember(name)}
          onClose={() => setSelectedSettlementMember(null)}
          settlement={settlement}
          settlementCurrency={settlementCurrency}
          rates={currencyRates}
        />`;

if(content.includes(target)) {
    content = content.replace(target, replace);
    fs.writeFileSync('src/components/BudgetView.tsx', content);
    console.log("Fixed MemberSettlementModal props");
} else {
    console.log("Could not find MemberSettlementModal to update props");
}
