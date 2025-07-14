import { supabase } from './supabase'

export const saveTransaction = async (saveTransaction, userId) => {
    const { type, amount, category, description, currency } = saveTransaction

    const { data, error } = await supabase
        .from('transactions')
        .insert([
            {
                user_id: userId,
                type,
                amount,
                category,
                description,
                currency
            }
        ])

        if (error){
            console.error('Failed to save transaction:', error.message)
        } else {
            console.log('Transaction saved successfully:', data)
        }

        return { data, error} 
}

export const getTransactions = async (userId) => {
    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

        if (error) {
            console.error('Failed to get transactions:', error.message);
            return []
        }

        return data
}

export const getTransactionById = async (transactionId, userId) => {
    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', transactionId)
        .eq('user_id', userId)
        .single()

        if (error) {
            console.error('Failed to get transaction:', error.message);
            return []
        }

        return data
    }

    export const deleteTransaction = async (transactionId, userId) => {
        const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('id', transactionId)
            .eq('user_id', userId)

        if (error) {
            console.error('Failed to delete transaction:', error.message);
            return []
        }

        return
    }

    export const updateTrasnaction = async (transactionId, userId, transactionData) => {
        const { error } = await supabase
            .from('transactions')
            .update(transactionData)
            .eq('id', transactionId)
            .eq('user_id', userId)

        if (error){
            console.error('Failed to update transaction:', error.message);
            return []
        }
        return
    }