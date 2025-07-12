import { useState } from 'react'
import { saveTransaction } from '../services/transactionService'
import { toast } from 'react-hot-toast'

const TransactionForm = ({ user, onSave }) => {
    const [type, setType] = useState('expense')
    const [amount, setAmount] = useState('')
    const [category, setCategory] = useState('')
    const [description, setDescription] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!user?.id) {
            toast.warning('You must be logged in to add a transaction')
            return
        }

        if (!amount || isNaN(amount)) {
            toast.error('Please enter a valid amount.')
            return
        }

        const transaction = {
            type,
            amount: parseFloat(amount),
            category,
            description,
            currency: 'KES'
        }

        const { error } = await saveTransaction(transaction, user.id)

        if (error){
            toast.error('Failed to save transaction.')
            return
        } else{
            toast.success('Transaction saved successfully.')
            onSave && onSave()
            setAmount('')
            setCategory('')
            setDescription('')
        }
    }
  return (
    <form onSubmit={handleSubmit} className="bg-black/30 border border-gray-500/40 text-white p-6 rounded-xl shadow-md space-y-4 my-6">
  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Add Transaction</h2>

  <div className="flex gap-4">
    <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
      <input type="radio" name="type" value="expense" checked={type === 'expense'} onChange={() => setType('expense')} />
      Expense
    </label>
    <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
      <input type="radio" name="type" value="income" checked={type === 'income'} onChange={() => setType('income')} />
      Income
    </label>
  </div>

  <input
    type="number"
    placeholder="Amount (e.g. 500)"
    className="w-full text-gray-400 border border-gray-500/30 text-sm bg-gray-900 px-2 py-1 rounded outline-none"
    value={amount}
    onChange={(e) => setAmount(e.target.value)}
    required
  />

  <input
    type="text"
    placeholder="Category (e.g. food, salary)"
    className="w-full text-gray-400 border border-gray-500/30 text-sm bg-gray-900 px-2 py-1 rounded outline-none"
    value={category}
    onChange={(e) => setCategory(e.target.value)}
    required
  />

  <textarea
    placeholder="Description (optional)"
    className="w-full text-gray-400 border border-gray-500/30 text-sm bg-gray-900 px-2 py-1 rounded outline-none"
    value={description}
    onChange={(e) => setDescription(e.target.value)}
  />

  <button
    type="submit"
    className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition"
  >
    Save Transaction
  </button>
</form>
  )
}

export default TransactionForm