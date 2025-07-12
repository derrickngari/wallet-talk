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

const IncomePage = ({ user }) => {
  const [income, setIncome] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [monthlyData, setMonthlyData] = useState([])
  const [totalIncome, setTotalIncome] = useState(0)

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  useEffect(() => {
    if (user) {
      fetchIncome()
    }
  }, [user])

  const fetchIncome = async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .eq('type', 'income')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching income:', error)
      return
    }

    setIncome(data)
    setTotalIncome(data.reduce((sum, tx) => sum + tx.amount, 0))
    processData(data)
  }

  const processData = (data) => {
    // Process category data
    const categoryTotals = data.reduce((acc, income) => {
      acc[income.category] = (acc[income.category] || 0) + income.amount;
      return acc
    }, {})

    const categoryChartData = Object.entries(categoryTotals).map(([category, amount]) => ({
      name: category,
      value: amount
    }))

    setCategoryData(categoryChartData)

    // Process monthly data
    const monthlyTotals = data.reduce((acc, income) => {
      const month = new Date(income.created_at).toLocaleString('default', { month: 'short' })
      acc[month] = (acc[month] || 0) + income.amount
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
      <h1 className="text-2xl text-gray-300 font-bold mb-6">Income Overview</h1>
      <div className="bg-black/30 backdrop-blur-sm border border-green-400/40  rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex gap-6 my-auto items-center">
          <span>
            <h3 className="text-sm text-slate-500">Total Income</h3>
            <p className="text-xl font-bold text-green-700">
              KES{" "}
              <CountUp
                start={0}
                end={totalIncome}
                duration={1.5}
                separator=","
              />
            </p>
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monthly Income Chart */}
        <div className="p-4 bg-black/30 border border-gray-500/40 text-white rounded-2xl  mt-4 shadow">
          <h2 className="text-lg text-gray-200 font-semibold mb-4">
            Monthly Income
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
  <BarChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
    <CartesianGrid stroke="rgba(255, 255, 255, 0.05)" />
    <XAxis dataKey="name" stroke="#ccc" />
    <YAxis 
      stroke="#ccc" 
      tickFormatter={(val) => `KES ${val.toLocaleString()}`} 
    />
    <Tooltip 
      contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px", color: "#fff" }}
      labelStyle={{ color: "#9ca3af" }}
    />
    <Legend 
      wrapperStyle={{ color: "#d1d5db" }}
    />
    <Bar dataKey="amount" fill="#00C49F" radius={[8, 8, 0, 0]} />
  </BarChart>
</ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution Chart */}
        <div className="p-4 bg-black/30 border border-gray-500/40 text-white rounded-2xl shadow-md mt-4">
          <h2 className="text-lg font-semibold mb-4">Income Sources</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#00C49F"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="p-4 bg-black/30 border border-gray-500/40 text-white rounded-2xl shadow-md mt-4">
        <h2 className="text-lg font-semibold mb-4">Income Tranactions</h2>
        {income.length === 0 ? (
          <p className="text-sm text-gray-500">No income tranactions yet</p>
        ) : (
          <ul className=" divide-gray-300">
            {income.map((tx) => (
              <li
                key={tx.id}
                className="py-3 border-b border-gray-400/10 flex justify-between items-start"
              >
                <div>
                  <p className="text-sm font-medium capitalize">
                    {tx.category}
                  </p>
                  <p className="text-xs text-gray-500 sentence-cap">
                    {tx.description}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-green-600">
                    + KES {tx.amount}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(tx.created_at).toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default IncomePage