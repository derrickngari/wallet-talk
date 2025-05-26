import { useState } from 'react'
import { supabase } from '../services/supabase'
import logo from '../assets/wallet-talk-logo.svg'
import { ToastContainer, toast } from 'react-toastify'


const AuthForm = ({ onAuthSuccess }) => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSignUp, setIsSignUp] = useState(false)
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
  e.preventDefault()
  setError('')

  try {
    if (isSignUp) {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name, 
          },
        },
      });

      if (signUpError) throw signUpError

      // After signup, insert into the users table
      const userId = data.user?.id
      if (userId) {
        const { error: insertError } = await supabase
          .from('users')
          .insert([{ id: userId, email, full_name: name }])

        if (insertError) {
          throw insertError
        }
      }

      toast.success('Signup successful! Please check your email to confirm.');
    } else {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError

      toast.success('Login successful!')
      onAuthSuccess(data.user)
    }
  } catch (err) {
    setError(err.message)
    toast.error(err.message)
  }
}


  return (
    <div className='flex items-center justify-center flex-col'>
        <ToastContainer />
        <div className="flex flex-col sm:flex-col sm:justify-between  gap-4 mb-4">
            {/* <div className="flex absolute left-5 top-6 justify-between items-center gap-3">
                <img
                    src={logo}
                    alt="WalletTalk Logo"
                    className="w-44 h-auto items-center object-contain drop-shadow-sm"
                />
            </div> */}
                  </div>
        <div className='max-w-sm mx-auto p-6 bg-white rounded-2xl shadow-md flex items-center justify-center flex-col mt-40'>
            <img src={logo} alt="Wallet Talk Logo" className="w-32 h-auto mx-auto mb-3 items-center ml-35" />
            <h2 className='text-2xl font-semibold mb-4'>
                {isSignUp ? 'Sign Up' : 'Sign In'}
            </h2>

            <form onSubmit={handleSubmit} className='space-y-4'>
                {isSignUp && 
                <input type="text"
                        placeholder='Enter Your Name'
                        value={name}
                        onChange={(e)=> setName(e.target.value)}
                        className='w-full border px-3 py-2 rounded outline-0'
                />}
                <input type="email"
                        placeholder='Enter Your Email'
                        value={email}
                        onChange={(e)=> setEmail(e.target.value)}
                        className='w-full border px-3 py-2 rounded outline-0'
                />
                <input type='password'
                        placeholder='Enter Your Password'
                        value={password}
                        onChange={(e)=> setPassword(e.target.value)}
                        className='w-full border px-3 py-2 rounded outline-0'
                />
                <button
                    type='submit'
                    className='w-full bg-[#F59E0B] text-white py-2 rounded hover:bg-[#f59f0be3]'
                >
                    {isSignUp ? 'Sign Up' : 'Sign In'}
                </button>
            </form>
            {error && <p className='text-red-500 mt-2 text-sm'>{error}</p>}
            <p className='mt-4 text-sm text-gray-500 text-center'>
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{" "}
                <button className='text-[#F59E0B] underline cursor-pointer pl-2 outline-0' onClick={() => setIsSignUp(!isSignUp)}>
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
            </p>
        </div>
    </div>
  )
}

export default AuthForm