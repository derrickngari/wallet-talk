import { useEffect, useState } from 'react'
import { MoonIcon, SunIcon } from 'lucide-react';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(
    localStorage.getItem('theme') === 'dark'
  )

  useEffect(() => {
    const root = window.document.documentElement
    if (isDark) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="text-sm  px-3 py-2 rounded-2xl bg-gray-200 dark:bg-gray-800 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 transition"
    >
      {isDark ? <MoonIcon size={13} /> : <SunIcon size={13} />}
    </button>
  )
}

export default ThemeToggle
