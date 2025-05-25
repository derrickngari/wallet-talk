import { supabase } from './supabase'

export const saveTransaction = async (saveTransaction, userId) => {
    const { type, amount, category, description, currency } = saveTransaction;

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
        ]);

        if (error){
            console.error('Failed to save transaction:', error.message);
        } else {
            console.log('Transaction saved successfully:', data);
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