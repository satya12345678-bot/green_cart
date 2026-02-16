import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const Loading = () => {

  const { search } = useLocation()
  const navigate = useNavigate()   // ✅ correct hook

  const query = new URLSearchParams(search)
  const nextURL = query.get('next')

  useEffect(() => {
    if (nextURL) {
      setTimeout(() => {
        navigate(`/${nextURL}`)   // ✅ use navigate()
      }, 2000)  // 2 seconds is enough
    }
  }, [nextURL, navigate])

  return (
    <div className='flex justify-center items-center h-screen'>
      <div className='animate-spin rounded-full h-24 w-24 border-4 border-gray-300 border-t-primary'></div>
    </div>
  )
}

export default Loading
