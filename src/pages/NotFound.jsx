import { useNavigate } from 'react-router'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <>
      <div className='text-5xl flex justify-center items-center min-h-[50vh]'>404 | NotFound</div>
      <button
        className='bg-[#F59E0B] py-2 px-4 cursor-pointer text-white rounded mt-10 mx-auto'
        onClick={() => navigate('/')}
      >
          Home Page
      </button>
    </>
  )
}

export default NotFound