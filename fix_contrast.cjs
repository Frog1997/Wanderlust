const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // 1. Fix modal overlays
  // Replace: "bg-neutral-900/60" with "bg-black/50 dark:bg-black/70"
  content = content.replace(/bg-neutral-900\/60/g, 'bg-black/50 dark:bg-black/70');
  
  // Replace: "bg-black/20 dark:bg-black/40" (in Sidebar) with "bg-black/50 dark:bg-black/70"
  content = content.replace(/bg-black\/20 dark:bg-black\/40/g, 'bg-black/50 dark:bg-black/70');

  // 2. Fix input field borders
  // We want to replace dark:border-neutral-700 with dark:border-neutral-600 ONLY in input/textarea/select classNames.
  // A simple regex might be tricky. Let's look for border-neutral-200 dark:border-neutral-700 followed by focus:
  content = content.replace(/border-neutral-200 dark:border-neutral-700([^"']*?)focus:/g, 'border-neutral-300 dark:border-neutral-600$1focus:');
  
  // What about other inputs that might not have focus: right after?
  // Let's replace 'dark:border-neutral-700' with 'dark:border-neutral-600' inside any className that contains 'bg-white dark:bg-neutral-900' and 'focus:outline-none'
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated: ' + file);
  }
});
