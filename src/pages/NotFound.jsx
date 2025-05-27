import { useNavigate } from 'react-router'

const NotFound = ({ user }) => {
  const navigate = useNavigate()

  return (
    <div className='flex flex-col justify-center items-center min-h-[50vh]'>
      <h1 className='text-5xl '>404 | NotFound</h1>
      <button
        className='bg-[#F59E0B] py-2 px-4 cursor-pointer text-white rounded mt-12 mx-auto'
        onClick={user ? navigate('/dashboard') : () => navigate('/')}
      >
        Home Page
      </button>
    </div>
  )
}

export default NotFound