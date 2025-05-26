import { useEffect, useState } from 'react'
import { getTransactions } from '../services/transactionService'

const TransactionList = ({ user }) => {
    const [transactions, setTransactions] = useState([])

    useEffect(() => {
        if (user) {
            getTransactions(user.id).then((data) => setTransactions(data))
        }
    }, [user, transactions])

  return (
    <div className='p-4 bg-white rounded-2xl shadow-md mt-4'>
        <h2 className='text-lg font-semibold mb-2'>Your Transactions</h2>
        {transactions.length === 0 ? (
            <p className='text-sm text-gray-500'> No transactions yet.</p>
        ): (
            <ul className='divide-y divide-gray-200'>
                {transactions.map((tx) => (
                    <li key={tx.id} className='py-3 flex justify-between items-center'>
                        <div>
                            <p className='text-sm font-medium capitalize'>{tx.category || 'Uncategorized'}</p>
                            <p className='text-xs text-gray-500 sentence-cap'>{tx.description}</p>
                        </div>
                        <div className="text-right">
                            <p className={`text-sm font-semibold ${tx.type == 'income' ? 'text-green-600' : 'text-red-500'}`}>
                                {tx.type === 'income' ? '+' : '-'} KES {tx.amount}
                            </p>
                            {tx.created_at && (
                                <p className='text-xs text-gray-400 mt-1\'>
                                    {new Date(tx.created_at).toLocaleString()}
                                </p>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        )}
    </div>
  )
}

export default TransactionList