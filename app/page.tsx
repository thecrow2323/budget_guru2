'use client';

import { useState, useEffect } from 'react';
import { TransactionForm } from '@/components/TransactionForm';
import { TransactionList } from '@/components/TransactionList';
import { ExpenseChart } from '@/components/ExpenseChart';
import { CategoryChart } from '@/components/CategoryChart';
import { BudgetSetup } from '@/components/BudgetSetup';
import { BudgetOverview } from '@/components/BudgetOverview';
import { BudgetChart } from '@/components/BudgetChart';
import { FinanceStats } from '@/components/FinanceStats';
import { Sidebar } from '@/components/Sidebar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Transaction, Budget } from '@/types/finance';
import { transactionApi, budgetApi } from '@/lib/api';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from database on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [transactionsData, budgetsData] = await Promise.all([
          transactionApi.getAll(),
          budgetApi.getAll()
        ]);
        
        // Convert MongoDB _id to id for compatibility
        const normalizedTransactions = transactionsData.map(t => ({
          ...t,
          id: t._id || t.id
        }));
        
        const normalizedBudgets = budgetsData.map(b => ({
          ...b,
          id: b._id || b.id
        }));
        
        setTransactions(normalizedTransactions);
        setBudgets(normalizedBudgets);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load data. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleAddTransaction = async (transaction: Transaction) => {
    try {
      if (editingTransaction) {
        const updated = await transactionApi.update(editingTransaction._id || editingTransaction.id!, transaction);
        setTransactions(prev => 
          prev.map(t => (t._id || t.id) === (editingTransaction._id || editingTransaction.id) ? { ...updated, id: updated._id } : t)
        );
        setEditingTransaction(undefined);
        setActiveTab('overview');
      } else {
        const created = await transactionApi.create(transaction);
        setTransactions(prev => [...prev, { ...created, id: created._id }]);
      }
      
      // Refresh budgets to update spending
      const updatedBudgets = await budgetApi.getAll();
      setBudgets(updatedBudgets.map(b => ({ ...b, id: b._id || b.id })));
    } catch (err) {
      console.error('Error saving transaction:', err);
      setError('Failed to save transaction. Please try again.');
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setActiveTab('add');
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await transactionApi.delete(id);
      setTransactions(prev => prev.filter(t => (t._id || t.id) !== id));
      
      // Refresh budgets to update spending
      const updatedBudgets = await budgetApi.getAll();
      setBudgets(updatedBudgets.map(b => ({ ...b, id: b._id || b.id })));
    } catch (err) {
      console.error('Error deleting transaction:', err);
      setError('Failed to delete transaction. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setEditingTransaction(undefined);
    setActiveTab('overview');
  };

  const handleSaveBudgets = async (newBudgets: Omit<Budget, 'spent' | 'remaining' | 'percentage'>[]) => {
    try {
      const savedBudgets = await budgetApi.saveAll(newBudgets);
      setBudgets(savedBudgets.map(b => ({ ...b, id: b._id || b.id })));
    } catch (err) {
      console.error('Error saving budgets:', err);
      setError('Failed to save budgets. Please try again.');
    }
  };

  const retryLoad = () => {
    window.location.reload();
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-20 min-h-[60vh]">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Loading your financial data</h3>
              <p className="text-muted-foreground">Please wait while we fetch your information...</p>
            </div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center py-20 min-h-[60vh]">
          <div className="max-w-md mx-auto">
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button onClick={retryLoad} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            <div className="space-y-6">
              <FinanceStats transactions={transactions} />
            </div>
            <ExpenseChart transactions={transactions} />
          </div>
        );
      
      case 'categories':
        return (
          <div className="space-y-6">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Category Analysis
              </h2>
              <p className="text-muted-foreground mt-2 text-lg">
                Understand where your money goes with detailed category breakdowns
              </p>
            </div>
            <CategoryChart transactions={transactions} />
          </div>
        );
      
      case 'budget':
        return (
          <div className="space-y-8">
            <div className="flex flex-col items-center md:items-start md:flex-row md:justify-between gap-4">
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Budget Management
                </h2>
                <p className="text-muted-foreground mt-2 text-lg">
                  Set and track your monthly spending goals
                </p>
              </div>
              <BudgetSetup budgets={budgets} onSaveBudgets={handleSaveBudgets} />
            </div>
            <div className="grid gap-8">
              <BudgetOverview budgets={budgets} />
              {budgets.length > 0 && <BudgetChart budgets={budgets} />}
            </div>
          </div>
        );
      
      case 'add':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
              </h2>
              <p className="text-muted-foreground mt-2 text-lg">
                {editingTransaction ? 'Update your transaction details' : 'Record a new income or expense'}
              </p>
            </div>
            <TransactionForm
              onSubmit={handleAddTransaction}
              editingTransaction={editingTransaction}
              onCancel={handleCancelEdit}
            />
          </div>
        );
      
      case 'transactions':
        return (
          <div className="space-y-6">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Transaction History
              </h2>
              <p className="text-muted-foreground mt-2 text-lg">
                View and manage all your financial transactions
              </p>
            </div>
            <TransactionList
              transactions={transactions}
              onEdit={handleEditTransaction}
              onDelete={handleDeleteTransaction}
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex">
      {/* Fixed Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Scrollable Main Content */}
      <div className="flex-1 md:ml-72 overflow-y-auto h-screen">
        <div className="container mx-auto px-4 py-8 md:px-8 md:py-12 max-w-7xl">
          {/* Header */}
          <div className="mb-12 mt-16 md:mt-0">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent mb-4">
                Personal Finance
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Complete financial management with expense tracking, budgeting, and intelligent insights
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8 flex flex-col items-center md:items-stretch">
            <div className="w-full max-w-6xl mx-auto">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}