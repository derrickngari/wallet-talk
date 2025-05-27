import { useEffect, useState } from 'react'
import { getTransactions } from '../services/transactionService'
import ExportDropdown from './ExportDropdown'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const TransactionList = ({ user }) => {
    const [transactions, setTransactions] = useState([])
    const [filtered, setFiltered] = useState([])

    const [categoryFilter, setCategoryFilter] = useState('')
    const [minAmount, setMinAmount] = useState('')
    const [maxAmount, setMaxAmount] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    useEffect(() => {
        if (user) {
            getTransactions(user.id).then((data) => {
                setTransactions(data)
                setFiltered(data)
            })
        }
    }, [user])

    const handleReset = () => {
        setCategoryFilter('')
        setMinAmount('')
        setMaxAmount('')
        setStartDate('')
        setEndDate('')
        setFiltered(transactions)
    }

    const handleFilter = () => {
        const filteredData = transactions.filter((tx) => {
            const categoryMatch = !categoryFilter || tx.category.toLowerCase().includes(categoryFilter.toLowerCase())
            const amountMatch = 
                (!minAmount || tx.amount >= parseFloat(minAmount)) &&
                (!maxAmount || tx.amount <= parseFloat(maxAmount))
            const date = new Date(tx.created_at)
            const start = startDate ? new Date(startDate) : null
            const end = endDate ? new Date(endDate) : null
            const dateMatch = (!start || date >= start) && (!end || date <= end)

            return categoryMatch && amountMatch && dateMatch
        })
        setFiltered(filteredData)
    }

    useEffect(() => {
        handleFilter()
    }, [categoryFilter, minAmount, maxAmount, startDate, endDate])


    //export to csv
    const exportToCSV = () => {
        const headers =['Type', 'Category', 'Amount', 'Description', 'Date']
        const rows = filtered.map(tx => [
            tx.type,
            tx.category,
            tx.amount,
            tx.currency || 'KES',
            tx.description,
            new Date(tx.created_at).toLocaleDateString()
        ])
        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.setAttribute('download', 'tranactions.csv')
        document.body.appendChild(link)
        link.click()
        document.removeChild(link)


    }

    //export to pdf
    const exportToPDF = async () => {
        const doc = new jsPDF()

        const logoUrl = 'https://res.cloudinary.com/ddvozdtkg/image/upload/v1748012471/ChatGPT_Image_May_23_2025_04_30_39_PM_j2bxju.png'

        // log image as base 64
        const getBase64ImageFromURL = async (url) => {
            const res = await fetch(url)
            const blob = await res.blob()
            return new Promise((reslove) => {
                const reader = new FileReader()
                reader.onloadend = () => reslove(reader.result)
                reader.readAsDataURL(blob)
            })
        }
        const logoBase64 = await getBase64ImageFromURL(logoUrl)

        // add logo to PDFtranactionlist
        doc.addImage(logoBase64, 'PNG', 10, 10, 40, 20)
        doc.setFontSize(16)
        doc.text('WalletTalk Transactions Report', 60, 20)

        const tableData = filtered.map(tx => [
            tx.type,
            tx.category,
            tx.amount,
            tx.currency || 'KES',
            tx.description,
            new Date(tx.created_at).toLocaleDateString()
        ])

        doc.autoTable({
            startY: 40,
            head: [['Type', 'Category', 'Amount', 'Currencry', 'Description', 'Date']],
            body: tableData,
            theme: 'striped',
            styles: { fontSize: 10 }
        })

        doc.save('transactions.pdf')
    }

    // export to xlsx
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filtered)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Tranactions')
        XLSX.writeFile(workbook, 'transactions.xlsx')
    }

  return (
    <div className='p-4 bg-white rounded-2xl shadow-md mt-4'>
        <div className='flex justify-between items-center mb-4'>
            <h2 className='text-lg font-semibold '>Your Transactions</h2>
            <ExportDropdown onExport={(format) => {
                if (format === 'pdf') exportToPDF()
                else if (format === 'xlsx') exportToExcel()
                else if (format === 'csv') exportToCSV()
            }} />
        </div>

        {/* filters */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
            <input 
                type="text"
                placeholder='Search by category'
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className='border px-3 py-2 rounded' 
            />
            <input 
                type="number"
                placeholder='Min amount'
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                className='border px-3 py-2 rounded' 
            />
            <input 
                type="number"
                placeholder='Max amount'
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                className='border px-3 py-2 rounded' 
            />
            <input 
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className='border px-3 py-2 rounded' 
            />
            <input 
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className='border px-3 py-2 rounded' 
            />
            <button
            onClick={handleReset}
            className='bg-gray-200 text-sm rounded px-3 py-2 hover:bg-gray-200'
            >Reset</button>
        </div>


        {filtered.length === 0 ? (
            <p className='text-sm text-gray-500'> No transactions yet.</p>
        ): (
            <ul className='divide-y divide-gray-200'>
                {filtered.map((tx) => (
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