import { useState, useEffect, useRef } from "react"
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'

const ExportDropdown = ({ onExport }) => {
    const [open, setOpen] = useState(false)
    const menuRef = useRef()


    // close dropdown when you click outside
    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)){
                setOpen(false)
            }
            document.addEventListener('mousedown', handler)
            return () => document.removeEventListener('mousedown', handler)
        }
    }, [])
    
  return (
    <div className="relative inline-block text-left" ref={menuRef}>
        <button
            title="Download"
            onClick={() => setOpen(!open)}
            className='bg-[#6366F1] flex gap-2 text-white px-2 py-1 rounded text-xs hover:bg[#eda307]'
        >
            <ArrowDownTrayIcon className='h-4'/>
        </button>

        {open && (
            <div className="absolute right-0 mt-2 w-44 bg-gray-100 rounded-md shadow-lg z-10">
                <ul className="p-2 text-sm text-gray-700">
                    <li>
                        <button
                            onClick={() => {
                                onExport('pdf')
                                setOpen(false)
                            }}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                        >
                            Export to PDF
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => {
                                    onExport('xlsx')
                                    setOpen(false)
                                }}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                        >
                            Export to Excel
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => {
                                    onExport('csv')
                                    setOpen(false)
                                }}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                        >
                            Export to CSV
                        </button>
                    </li>
                </ul>
            </div>
        )}
    </div>
  )
}

export default ExportDropdown