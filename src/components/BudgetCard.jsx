import React from 'react'

const BudgetCard = ({ spent, b, percent }) => {
    
  return (
    <div key={b.id} className="p-4 bg-black/30 border border-gray-500/40 text-white rounded-2xl  mt-4 shadow">
        <h3 className="text-lg font-semibold capitalize">{b.category}</h3>
        <p className="text-sm text-gray-500">Limit: KES {b.amount} / {b.period}</p>

        {/* progress bar */}
        <div className="h-1.5 bg-gray-800 rounded mt-2">
            <div
            className={`h-2 ${percent < 100 ? 'bg-purple-600' : 'bg-red-500' } rounded`}
            style={{ width: `${percent}%` }}
            />
        </div>
        <p className="text-xs text-gray-500 mt-1 py-2 mx-auto">
            KES {spent} spent - {percent.toFixed(0)}% used
        </p>
    </div>
  )
}

export default BudgetCard