const fs = require('fs');
const path = require('path');

const walk = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.html')) {
      results.push(file);
    }
  });
  return results;
};

const files = walk('./src');
files.push('./index.html');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Primary color replacement
  content = content.replace(/\bteal-/g, 'primary-');

  // Regex replacer helper to handle optional opacity
  const replaceClass = (oldClass, newDarkClass) => {
    // Matches "bg-white" or "bg-white/50"
    const regex = new RegExp(`\\b${oldClass}(?:\\/(\\d+))?\\b`, 'g');
    content = content.replace(regex, (match, opacity) => {
      if (opacity) {
        return `${oldClass}/${opacity} dark:${newDarkClass}/${opacity}`;
      }
      return `${oldClass} dark:${newDarkClass}`;
    });
  };

  replaceClass('bg-white', 'bg-neutral-900');
  replaceClass('bg-stone-50', 'bg-neutral-950');
  replaceClass('bg-slate-50', 'bg-neutral-950');
  replaceClass('bg-stone-100', 'bg-neutral-800');
  replaceClass('bg-stone-200', 'bg-neutral-700');
  
  replaceClass('text-stone-900', 'text-white');
  replaceClass('text-slate-900', 'text-white');
  replaceClass('text-stone-800', 'text-neutral-200');
  replaceClass('text-stone-700', 'text-neutral-300');
  replaceClass('text-stone-600', 'text-neutral-400');
  replaceClass('text-stone-500', 'text-neutral-500');
  replaceClass('text-stone-400', 'text-neutral-600');

  replaceClass('border-stone-100', 'border-neutral-800');
  replaceClass('border-stone-200', 'border-neutral-700');
  replaceClass('border-stone-300', 'border-neutral-600');

  replaceClass('hover:bg-stone-50', 'hover:bg-neutral-800');
  replaceClass('hover:bg-stone-100', 'hover:bg-neutral-700');
  replaceClass('hover:bg-white', 'hover:bg-neutral-800');
  replaceClass('hover:text-stone-900', 'hover:text-white');
  replaceClass('hover:text-stone-700', 'hover:text-neutral-200');

  // Fix duplicates if any
  content = content.replace(/dark:bg-neutral-900 dark:bg-neutral-900/g, 'dark:bg-neutral-900');

  fs.writeFileSync(file, content);
});
console.log('Refactoring complete.');
