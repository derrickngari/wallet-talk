import React from 'react'

const BudgetCard = ({ spent, b, percent }) => {
    
  return (
    <div key={b.id} className="bg-white p-4  rounded shadow">
        <h3 className="text-lg font-semibold capitalize">{b.category}</h3>
        <p className="text-sm text-gray-500">Limit: KES {b.amount} / {b.period}</p>

        {/* progress bar */}
        <div className="h-2 bg-gray-200 rounded mt-2">
            <div
            className={`h-2 ${percent < 100 ? 'bg-[#F59E0B]' : 'bg-red-500' } rounded`}
            style={{ width: `${percent}%` }}
            />
        </div>
        <p className="text-xs text-gray-500 mt-1 py-2 mx-auto">
            KES {spent} spent - {percent}% used
        </p>
    </div>
  )
}

export default BudgetCard