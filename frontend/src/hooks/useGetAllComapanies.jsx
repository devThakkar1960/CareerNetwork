import axios from 'axios';
import { COMPANY_API_END_POINT} from '../utils/constant.js';
import { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { setCompanies } from '../redux/companySlice.js';

function useGetAllCompanies() {
    const dispatch = useDispatch();
    useEffect(()=>{
        const fetchCompanys = async () => {
            try {
                const res = await axios.get(`${COMPANY_API_END_POINT}/get`,{withCredentials:true});
                if(res.data.success){
                    dispatch(setCompanies(res.data.companies));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchCompanys();
    },[])
}

export default useGetAllCompanies