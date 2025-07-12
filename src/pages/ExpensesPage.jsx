import { useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import {
  BarChart,
  LineChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import CountUp from "react-countup";

const ExpensesPage = ({ user }) => {
  const [expenses, setExpenses] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [totalexpenses, setTotalExpenses] = useState(0);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  useEffect(() => {
    if (user) {
      fetchExpenses();
    }
  }, [user]);

  const fetchExpenses = async () => {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .eq("type", "expense")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching expenses:", error);
      return;
    }

    setExpenses(data);
    setTotalExpenses(data.reduce((sum, tx) => sum + tx.amount, 0));
    processData(data);
  };

  const processData = (data) => {
    // Process category data
    const categoryTotals = data.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    const categoryChartData = Object.entries(categoryTotals).map(
      ([category, amount]) => ({
        name: category,
        value: amount,
      })
    );

    setCategoryData(categoryChartData);

    // Process monthly data
    const monthlyTotals = data.reduce((acc, expense) => {
      const month = new Date(expense.created_at).toLocaleString("default", {
        month: "short",
      });
      acc[month] = (acc[month] || 0) + expense.amount;
      return acc;
    }, {});

    const monthlyChartData = Object.entries(monthlyTotals).map(
      ([month, amount]) => ({
        name: month,
        amount: amount,
      })
    );

    setMonthlyData(monthlyChartData);
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-6 text-gray-400">
        Expenses Overview
      </h1>
      <div className="bg-black/30 backdrop-blur-sm border border-red-500/40 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex gap-5 my-auto items-center">
          <span>
            <h3 className="text-sm text-gray-700">Total Expenses</h3>
            <p className="text-xl font-bold text-red-700">
              KES{" "}
              <CountUp
                start={0}
                end={totalexpenses}
                duration={1.5}
                separator=","
              />
            </p>
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monthly Expenses Chart */}
        <div className="p-4 bg-black/30 border border-gray-500/40 text-white rounded-2xl  mt-4 shadow">
          <h2 className="text-lg font-semibold mb-4">Monthly Expenses</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
              >
                <defs>
                  <linearGradient
                    id="expenseGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#FF5F6D" stopOpacity={1} />
                    <stop offset="100%" stopColor="#FFC371" stopOpacity={0.8} />
                  </linearGradient>
                </defs>

                <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#ccc" />
                <YAxis
                  stroke="#ccc"
                  tickFormatter={(val) => `KES ${val.toLocaleString()}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  labelStyle={{ color: "#9ca3af" }}
                />
                <Legend wrapperStyle={{ color: "#d1d5db" }} />
                <Bar
                  dataKey="amount"
                  fill="url(#expenseGradient)"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution Chart */}
        <div className="p-4 bg-black/30 border border-gray-500/40 text-white rounded-2xl  mt-4 shadow">
          <h2 className="text-lg font-semibold mb-4">Expense Categories</h2>
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
                  fill="#8884d8"
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
        <h2 className="text-lg font-semibold mb-4">Expense Tranactions</h2>
        {expenses.length === 0 ? (
          <p className="text-sm text-gray-500">No expense tranactions yet</p>
        ) : (
          <ul className=" divide-gray-300">
            {expenses.map((tx) => (
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
};

export default ExpensesPage;
