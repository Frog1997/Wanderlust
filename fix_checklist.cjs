const fs = require('fs');
let content = fs.readFileSync('src/components/ChecklistView.tsx', 'utf8');

const target = `<div className="flex gap-2">
              <input
                type="text"
                placeholder="物品名稱..."
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                className="flex-1 px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-600 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-neutral-50 dark:bg-neutral-950"
              />
              <div className="w-1/3">
                <AutocompleteInput`;

const replace = `<div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="物品名稱..."
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                className="flex-1 px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-600 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-neutral-50 dark:bg-neutral-950"
              />
              <div className="w-full sm:w-1/3">
                <AutocompleteInput`;

if(content.includes(target)) {
    content = content.replace(target, replace);
    fs.writeFileSync('src/components/ChecklistView.tsx', content);
    console.log("Updated ChecklistView");
} else {
    console.log("ChecklistView target not found");
}
