import { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import CountUp from 'react-countup'

const ExpensesPage = ({ user }) => {
  const [expenses, setExpenses] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [monthlyData, setMonthlyData] = useState([])
  const [totalexpenses, setTotalExpenses] = useState(0)

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  useEffect(() => {
    if (user) {
      fetchExpenses()
    }
  }, [user])

  const fetchExpenses = async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .eq('type', 'expense')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching expenses:', error)
      return
    }

    setExpenses(data)
    setTotalExpenses(data.reduce((sum, tx) => sum + tx.amount, 0))
    processData(data)
  };

  const processData = (data) => {
    // Process category data
    const categoryTotals = data.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    }, {})

    const categoryChartData = Object.entries(categoryTotals).map(([category, amount]) => ({
      name: category,
      value: amount
    }))

    setCategoryData(categoryChartData);

    // Process monthly data
    const monthlyTotals = data.reduce((acc, expense) => {
      const month = new Date(expense.created_at).toLocaleString('default', { month: 'short' })
      acc[month] = (acc[month] || 0) + expense.amount
      return acc
    }, {})

    const monthlyChartData = Object.entries(monthlyTotals).map(([month, amount]) => ({
      name: month,
      amount: amount
    }))

    setMonthlyData(monthlyChartData)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Expenses Overview</h1>
      <div className="bg-red-100 border-l-4 border-red-500 py-10 px-8 rounded shadow-md transition transform duration-500 ease-out hover:scale-105  mb-6">
        <h3 className='text-sm text-gray-700'>Total Expenses</h3>
        <p className='text-xl font-bold text-red-700'>KES <CountUp start={0} end={totalexpenses} duration={1.5} separator=',' /></p>
        </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monthly Expenses Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Monthly Expenses</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Expense Categories</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="bg-white p-4 mt-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold mb-4">Expense Transactions</h2>
        {expenses.length === 0 ? (
          <p className='text-sm text-gray-500'>No income tranactions yet</p>
        ): (
          <ul className='divide-y divide-gray-300'>
            {expenses.map((tx) => (
              <li key={tx.id} className='py-3 flex justify-between items-start'>
                <div>
                  <p className='text-sm font-medium capitalize'>{tx.category}</p>
                  <p className='text-xs text-gray-500 sentence-cap'>{tx.description}</p>
                </div>
                <div className='text-right'>
                  <p className='text-sm font-semibold text-red-600'>- KES {tx.amount}</p>
                  <p className='text-xs text-gray-400 mt-1'>
                    {new Date(tx.created_at).toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default ExpensesPage; 