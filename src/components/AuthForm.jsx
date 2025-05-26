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
    e.preventDefault();
    setError(null);

    try {
      if (isSignUp) {
        // Sign up with full_name stored in user_metadata
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
          },
        })

        if (signUpError) throw signUpError

        toast.success('Signup successful! Please check your email to confirm.')
      } else {
        // Sign in
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError

        const user = data.user

        // Write to the users table only after successful login
        const { error: insertError } = await supabase
          .from('users')
          .upsert([
            {
              id: user.id,
              email: user.email,
              full_name: user.user_metadata?.full_name || '', // fallback
            },
          ])

        if (insertError) throw insertError

        toast.success('Login successful!')
        onAuthSuccess(user)
      }
    } catch (err) {
      setError(err.message)
      toast.error(err.message)
    }
  };

  return (
    <div className="flex items-center justify-center flex-col min-h-screen bg-gray-50 px-4">
      <ToastContainer />
      <div className="max-w-sm mx-auto p-6 bg-white rounded-2xl shadow-md w-full">
        <img src={logo} alt="WalletTalk Logo" className="w-32 h-auto mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-4 text-center">
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <input
              type="text"
              placeholder="Enter Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border px-3 py-2 rounded outline-none"
              required
            />
          )}
          <input
            type="email"
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded outline-none"
            required
          />
          <input
            type="password"
            placeholder="Enter Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded outline-none"
            required
          />
          <button
            type="submit"
            className="w-full bg-[#F59E0B] text-white py-2 rounded hover:bg-[#f59f0be3]"
          >
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        {error && <p className="text-red-500 mt-2 text-sm text-center">{error}</p>}

        <p className="mt-4 text-sm text-gray-500 text-center">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            className="text-[#F59E0B] underline cursor-pointer"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm
