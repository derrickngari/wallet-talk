import React, { useEffect, useState } from 'react'
import { getTransactions } from '../services/transactionService'
import { supabase } from '../services/supabase'
import CountUp from 'react-countup'

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

    // const totalBalance = totalIncome - totalExpense
    // setBalance(totalBalance)

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 my-6'>
        <div className="bg-green-100 border-l-4 border-green-500 py-10 px-8 rounded shadow-md transition transform duration-500 ease-out hover:scale-105 ">
            <h3 className='text-sm text-gray-700'>Total Income</h3>
            <p className='text-xl font-bold text-green-700'>KES <CountUp start={0} end={totalIncome} duration={1.5} separator=',' /></p>
        </div>
        <div className="bg-red-100 border-l-4 border-red-500 py-10 px-8 rounded shadow-md transition transform duration-500 ease-out hover:scale-105 ">
            <h3 className='text-sm text-gray-700'>Total Expenses</h3>
            <p className='text-xl font-bold text-red-700'>KES <CountUp start={0} end={totalExpense} duration={1.5} separator=',' /></p>
        </div>
        <div className="bg-indigo-100 border-l-4 border-indigo-500 py-10 px-8 rounded shadow-md transition transform duration-500 ease-out hover:scale-105 ">
            <h3 className='text-sm text-gray-700'>Balance</h3>
            <p className={`text-xl font-bold ${balance >= 0 ? 'text-indigo-700' : 'text-red-700'}`}>
                KES <CountUp start={0} end={balance} duration={1.5} separator=',' />
            </p>
        </div>
        
    </div>
  )
}

export default SummaryCards