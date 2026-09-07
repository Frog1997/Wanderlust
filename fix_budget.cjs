const fs = require('fs');
let content = fs.readFileSync('src/components/BudgetView.tsx', 'utf8');

// Add Search icon
content = content.replace("Trash2,", "Trash2, Search,");

// Add state variables
const stateAnchor = `  // New Expense Form State
  const [title, setTitle] = useState('');`;
const stateInjection = `  const [searchQuery, setSearchQuery] = useState('');
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  // New Expense Form State
  const [title, setTitle] = useState('');`;
content = content.replace(stateAnchor, stateInjection);

// Modify handleSaveExpense
const saveAnchor = `  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || amount <= 0) return;

    const converted = convertCurrency(amount, currency, trip.baseCurrency, currencyRates);

    const newExpense: Expense = {
      id: \`exp-\${Date.now()}\`,
      date,
      title: title.trim(),
      category,
      amount,
      originalCurrency: currency,
      convertedAmount: converted,
      paidBy,
      splitWith: splitWith.length > 0 ? splitWith : [paidBy],
      notes: notes.trim() || undefined,
    };

    onUpdateTrip({
      ...trip,
      expenses: [newExpense, ...trip.expenses],
    });

    // Reset
    setTitle('');
    setAmount(0);
    setNotes('');
    setIsAddingExpense(false);
  };`;
const saveInjection = `  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || amount <= 0) return;

    const converted = convertCurrency(amount, currency, trip.baseCurrency, currencyRates);

    const expenseData: Expense = {
      id: editingExpenseId || \`exp-\${Date.now()}\`,
      date,
      title: title.trim(),
      category,
      amount,
      originalCurrency: currency,
      convertedAmount: converted,
      paidBy,
      splitWith: splitWith.length > 0 ? splitWith : [paidBy],
      notes: notes.trim() || undefined,
    };

    onUpdateTrip({
      ...trip,
      expenses: editingExpenseId 
        ? trip.expenses.map(exp => exp.id === editingExpenseId ? expenseData : exp)
        : [expenseData, ...trip.expenses],
    });

    // Reset
    resetForm();
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpenseId(expense.id);
    setTitle(expense.title);
    setAmount(expense.amount);
    setCurrency(expense.originalCurrency);
    setCategory(expense.category);
    setPaidBy(expense.paidBy);
    setSplitWith(expense.splitWith);
    setDate(expense.date);
    setNotes(expense.notes || '');
    setIsAddingExpense(true);
  };

  const resetForm = () => {
    setEditingExpenseId(null);
    setTitle('');
    setAmount(0);
    setNotes('');
    setIsAddingExpense(false);
  };`;
content = content.replace(saveAnchor, saveInjection);

// Fix modal close button to reset form
content = content.replace(/onClick=\{\(\) => setIsAddingExpense\(false\)\}/g, "onClick={resetForm}");

fs.writeFileSync('src/components/BudgetView.tsx', content);
