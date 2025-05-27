import { useEffect, useState } from "react"
import { supabase } from "../services/supabase"
import { toast } from "react-toastify"
import BudgetCard from "./BudgetCard"

const BudgetsPage = ({ user, refreshCount }) => {
  const [budgets, setBudgets] = useState([])
  const [expenses, setExpenses] = useState([])
  const [category, setCategory] = useState('')
  const [amount,setAmount] = useState('')
  const [period, setPeriod] = useState('monthly')

  useEffect(()=> {
    if (user?.id) fetchBudgetsAndExppenses()
  }, [user, refreshCount])

  const fetchBudgetsAndExppenses = async () => {
    try {const { data: budgetsData, error: budgetsError } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', user.id)

      if (budgetsError) toast.error('Failed to fetch budgets.')
      setBudgets(budgetsData)

      const { data:expenseData, error: expenseError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', 'expense')

      if (expenseError) toast.error('Failed to fetch expenses.')
      setExpenses(expenseData)
    } catch (err) {
      toast.error('Failed to fetch budgets or expenses')
    }
  }

  const handleAddBudget = async (e) => {
    e.preventDefault()
    if (!category || !amount) return toast.warning('Please fill all fields.')

    const { error } = await supabase
      .from('budgets')
      .insert([
        {
          user_id: user.id,
          category,
          amount: parseFloat(amount),
          period
        }
      ])

      if (error) {
        toast.error('Failed to add budget')
      } else{
        toast.success('Budget added')
        setCategory('')
        setAmount('')
        setPeriod('monthly')
        fetchBudgetsAndExppenses()
      }
  }

  const getSpentAmount = (category) => {
    return expenses
      .filter((exp) => exp.category === category)
      .reduce((sum, exp) => sum + exp.amount, 0)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Budgets</h1>

      <form onSubmit={handleAddBudget} className="mb-6 flex flex-col md:flex-row  gap-4">
        <input 
          type="text" 
          placeholder="Category"
          value={category}
          onChange={(e)=> setCategory(e.target.value)}
          className="px-3 py-2 border rounded outline-none w-full" 
        />
        <input 
          type="number" 
          placeholder="Amount (KES)"
          value={amount}
          onChange={(e)=> setAmount(e.target.value)}
          className="px-3 py-2 border rounded outline-none w-full" 
        />
        <select
          value={period}
          onChange={(e)=> setPeriod(e.target.value)}
          className="px-3 py-2 border rounded w-full"
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
        <button
          type="submit"
          className="bg-[#F59E0B] text-white px-4 py-2 rounded"
        >
          Add Bugdet
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {budgets.map((b) => {
          const spent = getSpentAmount(b.category)
          const percent = Math.min((spent / b.amount) * 100, 100).toFixed(0)

          return (
            <BudgetCard 
              spent={spent} 
              percent={percent} 
              b={b}
            />
        ) 
        })}
      </div>
    </div>
  )
}

export default BudgetsPage