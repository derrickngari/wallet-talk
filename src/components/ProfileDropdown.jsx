import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Cog6ToothIcon, ExclamationCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline"

const ProfileDropdown = ({ fullName, onLogout }) => {
    const [open, setOpen] = useState(false)
    const dropDownRef = useRef()
    const navigate = useNavigate()

    const initials =fullName 
    ?  fullName
        .split(' ')
        .flatMap((name) => name[0]?.toUpperCase())
        .join('')
        .slice(0, 2)
    : 'U'

    useEffect(()=>{
        const handlClickOutside = (e) =>{
            if (dropDownRef.current && !dropDownRef.current.contains(e.target)) {
                setOpen(false)
            }
        }

        document.addEventListener('mousedown', handlClickOutside)
        return () => document.removeEventListener('mousedown', handlClickOutside)
    }, [])

  return (
    <div className="relative" ref={dropDownRef}>
        <button
            onClick={()=> setOpen(!open)}
            className="w-10 h-10 rounded-full absolute right-0 top-[-25px] bg-purple-600 text-gray-300 font-bold flex items-center justify-center focus:outline-none"
            title="Profile"
        >
            {initials}
        </button>
        {open && (
            <div className="absolute right-0 mt-8 w-48 p-4 bg-black/80 border border-gray-500/40 text-white rounded-2xl shadow-md overflow-hidden z-20">
                <button
                    onClick={() => {
                        navigate('/dashboard/profile')
                        setOpen(false)
                    }}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                    <span className="flex text-gray-400 justify-between">
                        Profile Settings
                        <Cog6ToothIcon className="h-5 w-5"/>
                    </span>
                </button>
                <button
                    onClick={onLogout}
                    className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                >
                    <span className="flex justify-between">
                        Log out
                        <ExclamationCircleIcon className="h-5 w-5"/>
                    </span>
                </button>
                <button
                    className="block w-full px-4 py-2 text-left text-sm text-sky-500 hover:bg-gray-100"
                >
                    <span className="flex justify-between">
                        Reset
                        <ExclamationTriangleIcon className="h-5 w-5"/>
                    </span>
                </button>
            </div>
        )}
    </div>
  )
}

export default ProfileDropdown