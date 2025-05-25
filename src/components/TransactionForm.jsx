import React, { useState } from 'react'
import { saveTransaction } from '../services/transactionService'
import { toast } from 'react-toastify'
import { Input } from 'postcss'

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
    <form onSubmit={handleSubmit} className='bg-white p-6 rounded-xl shadow-md space-y-4 my-6'>
        <h2 className="text-lg font-semibold text-gray-800">Add Transaction</h2>

        <div className='flex gap-4'>
            <label htmlFor="expense" className="flex items-center gap-2">
                <input 
                    type="radio"
                    name='type'
                    value='expense'
                    checked={type === 'expense'}
                    onChange={(e) => setType('expense')} 
                />
                Expense
            </label>    
            <label htmlFor="income" className="flex items-center gap-2">
                <input 
                    type="radio"
                    name='type'
                    value='income'
                    checked={type === 'income'}
                    onChange={(e) => setType('income')} 
                />
                Income
            </label>    
        </div>  

        <input
            type='number'
            placeholder='Amount (e.g. 500)'
            className='w-full border rounded px-3 py-2 outline-0'  
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
        />
        <input
            type='text'
            placeholder='Category (e.g. food, salary)'
            className='w-full border rounded px-3 py-2 outline-0'  
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
        /> 
        <textarea
            placeholder='Description (optional)'
            className='w-full border rounded px-3 py-2 outline-0' 
            value={description}
            onChange={(e)=> setDescription(e.target.value)}
        />

        <button
            type='submit'
            className='bg-[#F59E0B] text-white px-4 py-2 rounded hover:bg-blue-700'
        >
            Save Transaction
        </button>
    </form>
  )
}

export default TransactionForm