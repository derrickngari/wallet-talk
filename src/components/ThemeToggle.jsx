import { useEffect, useState } from 'react'

const ThemeToggle = () => {
    const [isDark, setIsdark] = useState(
        localStorage.getItem('theme') === 'dark'
    )

    useEffect(()=> {
        const root = window.document.documentElement

        if (isDark){
            root.classList.add('dark')
            localStorage.setItem('theme', 'dark')
        } else{
            root.classList.remove('dark')
            localStorage.setItem('theme', 'light')
        }

    }, [isDark])

  return (
    <button
        onClick={()=> setIsdark(!isDark)}
        className='text-sm px-3 py-2 rounded bg-grey-200 dark:bg-gray-800 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 transition'
    >
        {isDark ? '🌛 Dark': '🌞 Light'}
    </button>
    
  )
}

export default ThemeToggle