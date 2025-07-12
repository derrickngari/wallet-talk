import { useNavigate } from 'react-router'

const NotFound = ({ user }) => {
  const navigate = useNavigate()

  return (
    <div className='flex flex-col justify-center items-center min-h-[50vh]'>
      <h1 className='text-5xl text-gray-300'>404 | NotFound</h1>
      <button
        className='bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded cursor-pointer mt-12 mx-auto'
        onClick={user ? navigate('/dashboard') : () => navigate('/')}
      >
        Home Page
      </button>
    </div>
  )
}

export default NotFound