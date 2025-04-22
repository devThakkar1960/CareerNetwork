import axios from 'axios';
import { setSingleJob } from '../redux/jobSlice';
import { JOB_API_END_POINT } from '../utils/constant.js';
import { useEffect } from 'react'
import { useDispatch } from 'react-redux';

function useGetSingleJob(jobId) {
    const dispatch = useDispatch()
  return (
   
  )
}

export default useGetSingleJob