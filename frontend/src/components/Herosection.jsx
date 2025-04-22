import React, { useState } from 'react'
import { Button } from './ui/button'
import { Search } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { setSearchQuery } from '../redux/jobSlice'
import { useNavigate } from 'react-router-dom'


function Herosection() {
  const [query, setQuery] = useState("")
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const searchJobHandler = () => {
      dispatch(setSearchQuery(query))
      navigate("/browse")
  }
  return (
    <div className='text-center'>

        <h1 className='text-5xl font-bold m-10'>Search, Apply & <br /> Get Your <span className='text-[#6A38C2]'>Dream Jobs</span></h1>
        <p className='m-7'>Empowering careers through connections, opportunities, insights, and growth together.</p>

        <div className='flex w-[40%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto'>
            <input type="text" 
             placeholder='Find your dream jobs...'
             onChange={(e) => setQuery(e.target.value)}
            className='outline-none border-none w-full'
            />
            <Button onClick={() => searchJobHandler()} className="rounded-r-full bg-[#2263cb]">
                        <Search className='h-5 w-5' />
            </Button>
        </div>
    </div>
  )
}

export default Herosection