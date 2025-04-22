import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { RadioGroup} from '../../components/ui/radio-group';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT } from '../../utils/constant.js';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setUser } from '../../redux/authSlice.js';
import { Loader2 } from 'lucide-react';

function Login() {
    const [input, setInput] = useState({
            email: "",
            password: "",
            role: "",
        });
    const {user, loading} = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };
    
    const submitHandler = async(e) => {
        e.preventDefault();
        
        if(input.file) {
            formData.append("file", input.file);
        }
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });
            if(res.data.success) {
                
                dispatch(setUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "An unexpected error occurred.");
        } finally{
            dispatch(setLoading(false));
        }
    };
    useEffect(()=>{
       if(user){
        navigate("/")
       }
    },[])

    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center max-w-7xl mx-auto'>
                <form onSubmit={submitHandler} className='w-1/2 border border-gray-300 rounded-md p-4 my-10'>
                    <h1 className='font-bold text-xl mb-5'>Login</h1>
                    <div className='my-2'>
                        <Label>Email</Label>
                        <Input
                             type="email"
                             value={input.email}
                             name="email"
                             onChange={changeEventHandler}
                             placeholder="abc@gmail.com"
                             className="border-gray-300"
                        />
                    </div>
                    
                    <div className='my-2'>
                        <Label>Password</Label>
                        <Input
                           type="password"
                           value={input.password}
                           name="password"
                           onChange={changeEventHandler}
                           placeholder="Enter password"
                           className="border-gray-300"
                        />
                        <span><Link to='/forgotpassword' className='text-blue-400 hover:underline font-bold'>Forgot Password ? </Link></span>
                    </div>
                    <div className='flex'>
                        <RadioGroup className="flex items-center gap-4">
                            <div className="flex space-x-2">
                                <Input 
                                type="radio"
                                name="role"
                                value="student"
                                checked={input.role === 'student'}
                                onChange={changeEventHandler}
                                 className="cursor-pointer"
                                 />
                                 <Label htmlFor="r1"
                                 className="mt-3">Student</Label>
                            </div>
                            <div className="flex space-x-2">
                            <Input 
                                type="radio"
                                name="role"
                                value="recruiter"
                                checked={input.role === 'recruiter'}
                                onChange={changeEventHandler}
                                 className="cursor-pointer"
                                 />
                                 <Label htmlFor="r2" className="mt-3">Recruiter</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    {
                        loading ? <Button className='w-full my-4'>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin'/> Please wait
                        </Button> 
                    :
                    <Button type="submit" className="w-full my-4">Login</Button>
                    }
                    <span>Don't have an account?<Link to='/signup' className='text-blue-400 hover:underline font-bold'> Signup</Link></span>
                </form>
            </div>
        </div>
    );
}

export default Login;
