import axios from 'axios';
import { setAllAdminJobs} from '../redux/jobSlice.js';
import { JOB_API_END_POINT } from '../utils/constant.js';
import { useEffect } from 'react'
import { useDispatch } from 'react-redux';

function useGetAllAdminJobs() {
    const dispatch = useDispatch()
  return (
   useEffect(() => {
    const fetchAllAdminJobs = async () => {
        try {
            const res = await axios.get(`${JOB_API_END_POINT}/getadminjobs`, {withCredentials: true})
            if(res.data.success){
            dispatch(setAllAdminJobs(res.data.jobs))   
            }
        } catch (error) {
            console.log(error);  
        }
    }
    fetchAllAdminJobs()
   }, [])
  )
}

export default useGetAllAdminJobs