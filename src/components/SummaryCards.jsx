import { useEffect, useState } from 'react'
import { getTransactions } from '../services/transactionService'
import CountUp from 'react-countup'
import { ChevronDoubleDownIcon, ChevronDoubleUpIcon, ScaleIcon } from '@heroicons/react/24/outline'

const SummaryCards = ({ user, refreshCount }) => {
    const [totalIncome, setTotalIncome] = useState(0)
    const [totalExpense, setTotalExpense] = useState(0)
    const [balance, setBalance] = useState(0)
    

    useEffect(()=> {
        const fetchData = async () => {
            if (!user) return

            const transactions = await getTransactions(user.id)

            const income = transactions
                .filter(tx => tx.type === 'income')
                .reduce((sum, tx) => sum + tx.amount, 0)

            const expense = transactions
                .filter(tx => tx.type === 'expense')
                .reduce((sum, tx) => sum + tx.amount, 0)

            setTotalIncome(income)
            setTotalExpense(expense)
            setBalance(income - expense)
        }

        fetchData()
    }, [user, refreshCount])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-6">
  {/* Income Card */}
  <div className="bg-black/30 backdrop-blur-sm border border-green-400/40  rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
    <div className="flex items-center gap-4">
      <div className="p-3 rounded-full bg-green-800/30">
        <ChevronDoubleUpIcon className="h-6 w-6 text-green-500" />
      </div>
      <div>
        <h3 className="text-sm text-gray-300 font-medium">Income</h3>
        <p className="text-xl font-semibold text-green-400">
          KES <CountUp start={0} end={totalIncome} duration={1.5} separator="," />
        </p>
      </div>
    </div>
  </div>

  {/* Expense Card */}
  <div className="bg-black/30 backdrop-blur-sm border border-red-500/40 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
    <div className="flex items-center gap-4">
      <div className="p-3 rounded-full bg-red-800/30">
        <ChevronDoubleDownIcon className="h-6 w-6 text-red-500" />
      </div>
      <div>
        <h3 className="text-sm text-gray-300 font-medium">Expenses</h3>
        <p className="text-xl font-semibold text-red-400">
          KES <CountUp start={0} end={totalExpense} duration={1.5} separator="," />
        </p>
      </div>
    </div>
  </div>

  {/* Balance Card */}
  <div className=" bg-black/30 backdrop-blur-sm border border-indigo-400/40  rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
    <div className="flex items-center gap-4">
      <div className="p-3 rounded-full bg-indigo-800/30">
        <ScaleIcon className="h-6 w-6 text-indigo-500" />
      </div>
      <div>
        <h3 className="text-sm text-gray-600 dark:text-gray-300 font-medium">Balance</h3>
        <p className={`text-xl font-semibold ${balance >= 0 ? 'text-indigo-700 dark:text-indigo-400' : 'text-red-700 dark:text-red-400'}`}>
          KES <CountUp start={0} end={balance} duration={1.5} separator="," />
        </p>
      </div>
    </div>
  </div>
</div>


  )
}

export default SummaryCards