const fs = require('fs');
let content = fs.readFileSync('src/components/BudgetView.tsx', 'utf8');

const target = `              <button
                id="btn-open-member-manage"
                onClick={() => setIsMemberModalOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-950/50 hover:bg-primary-100 dark:hover:bg-primary-900/60 rounded-xl border border-primary-200 dark:border-primary-800 transition-all"
                title="新增或修改成員名單"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>成員管理</span>
              </button>
            </div>`;

const replace = `              <button
                id="btn-open-member-manage"
                onClick={() => setIsMemberModalOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-950/50 hover:bg-primary-100 dark:hover:bg-primary-900/60 rounded-xl border border-primary-200 dark:border-primary-800 transition-all"
                title="新增或修改成員名單"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>成員管理</span>
              </button>
              </div>
            </div>`;

if(content.includes(target)) {
    content = content.replace(target, replace);
    fs.writeFileSync('src/components/BudgetView.tsx', content);
    console.log("Fixed missing div");
} else {
    console.log("Could not find target to add div");
}
