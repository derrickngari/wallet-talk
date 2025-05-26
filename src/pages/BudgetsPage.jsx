import { useEffect, useState } from "react"
import { supabase } from "../services/supabase"
import { toast } from "react-toastify"

const BudgetsPage = ({ user }) => {
  const [budgets, setBudgets] = useState([])
  const [category, setCategory] = useState('')
  const [amount,setAmount] = useState('')
  const [period, setPeriod] = useState('monthly')

  useEffect(()=> {
    if (user?.id) fetchBudgets()
  }, [user])

  const fetchBudgets = async () => {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', user.id)

      if (error) toast.error('Failed to fetch budgets.')
      else setBudgets(data)
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
        fetchBudgets()
      }
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
        {budgets.map((b) => (
          <div key={b.id} className="bg-white p-4  rounded shadow">
            <h1 className="text-lg font-semibold capitalize">{b.category}</h1>
            <p className="text-sm text-gray-500">Limit: KES {b.amount} / {b.period}</p>

            {/* progress bar */}
            <div className="h-2 bg-gray-200 rounded mt-2">
              <div
                className="h-2 bg-[#F59E0B] rounded"
                style={{ width: '30%'}}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1 py-2 mx-auto">KES 300 spent</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BudgetsPage