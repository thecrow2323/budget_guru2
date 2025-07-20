"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Budget } from "@/types/finance";
import { formatCurrency, EXPENSE_CATEGORIES } from "@/lib/finance-utils";
import { PiggyBank, Plus, Trash2, Target } from "lucide-react";

interface BudgetSetupProps {
  budgets: Budget[];
  onSaveBudgets: (
    budgets: Omit<Budget, "spent" | "remaining" | "percentage">[]
  ) => void;
}

export function BudgetSetup({ budgets, onSaveBudgets }: BudgetSetupProps) {
  const [localBudgets, setLocalBudgets] = useState<
    Omit<Budget, "spent" | "remaining" | "percentage">[]
  >(budgets.map((b) => ({ id: b.id, category: b.category, amount: b.amount })));
  const [newCategory, setNewCategory] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const availableCategories = EXPENSE_CATEGORIES.filter(
    (cat) => !localBudgets.some((budget) => budget.category === cat)
  );

  const addBudget = () => {
    if (newCategory && newAmount && Number(newAmount) > 0) {
      const budget = {
        id: Date.now().toString(),
        category: newCategory,
        amount: Number(newAmount),
      };
      setLocalBudgets([...localBudgets, budget]);
      setNewCategory("");
      setNewAmount("");
    }
  };

  const removeBudget = (id: string) => {
    setLocalBudgets(localBudgets.filter((b) => b.id !== id));
  };

  const updateBudgetAmount = (id: string, amount: string) => {
    setLocalBudgets(
      localBudgets.map((b) =>
        b.id === id ? { ...b, amount: Number(amount) || 0 } : b
      )
    );
  };

  const handleSave = () => {
    onSaveBudgets(localBudgets);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setLocalBudgets(
      budgets.map((b) => ({ id: b.id, category: b.category, amount: b.amount }))
    );
    setNewCategory("");
    setNewAmount("");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <PiggyBank className="h-4 w-4" />
          Setup Budget
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Budget Setup
          </DialogTitle>
          <DialogDescription>
            Set monthly spending limits for different categories to track your
            financial goals.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add New Budget */}
          {availableCategories.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Add New Budget</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={newCategory} onValueChange={setNewCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Monthly Budget</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={newAmount}
                      onChange={(e) => setNewAmount(e.target.value)}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={addBudget}
                      disabled={
                        !newCategory || !newAmount || Number(newAmount) <= 0
                      }
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Current Budgets */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current Budgets</CardTitle>
            </CardHeader>
            <CardContent>
              {localBudgets.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No budgets set up yet. Add your first budget above.
                </div>
              ) : (
                <div className="space-y-3">
                  {localBudgets.map((budget) => (
                    <div
                      key={budget.id}
                      className="flex items-center gap-3 p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{budget.category}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          step="0.01"
                          value={budget.amount}
                          onChange={(e) =>
                            updateBudgetAmount(
                              budget.id as string,
                              e.target.value
                            )
                          }
                          className="w-32"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeBudget(budget.id as string)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center font-semibold">
                      <span>Total Monthly Budget:</span>
                      <span>
                        {formatCurrency(
                          localBudgets.reduce((sum, b) => sum + b.amount, 0)
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1">
              Save Budgets
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
