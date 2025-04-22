import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job'
import { useDispatch, useSelector } from 'react-redux'
import useGetAllJobs from '../hooks/useGetAllJobs'
import { setSearchQuery } from '../redux/jobSlice'


function Browse() {
  useGetAllJobs()
  const dispatch = useDispatch()

  useEffect(()=>{
    return ()=>{
      dispatch(setSearchQuery(""))
    }
  }, [])
  const {allJobs} = useSelector(store => store.job)
  return (
    <div>
      <Navbar/>
      <div className='max-w-7xl mx-auto my-10'>
        <h1 className='font-bold text-xl my-10'>Search Results ({allJobs.length})</h1>
        <div className='grid grid-cols-3 gap-4 mt-5'>
        {
          allJobs.map((job, index) => {
            return (
              <Job key={job._id} job={job}/>
            )
          })
        }
        </div>
      </div>
    </div>
  )
}

export default Browse