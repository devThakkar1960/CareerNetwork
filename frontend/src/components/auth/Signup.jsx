import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { RadioGroup } from '../../components/ui/radio-group';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { USER_API_END_POINT } from '../../utils/constant.js';
import { toast } from 'sonner';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../../redux/authSlice.js';
import { Loader2 } from 'lucide-react';

function Signup() {
    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "",
        file: ""
    });
    const [passwordError, setPasswordError] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {user, loading} = useSelector(store => store.auth);

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{4,16}$/;
    const phoneRegex = /^\d{10}$/; // Exactly 10 digits

    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });

        if (name === "password") {
            if (!passwordRegex.test(value)) {
                setPasswordError("Password must be 4-16 characters and include 1 uppercase, 1 lowercase, and 1 symbol.");
            } else {
                setPasswordError("");
            }
        }

        if (name === "phoneNumber") {
            if (!phoneRegex.test(value)) {
                setPhoneError("Phone number must be exactly 10 digits.");
            } else {
                setPhoneError("");
            }
        }
    };

    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!passwordRegex.test(input.password)) {
            setPasswordError("Password must be 4-16 characters and include 1 uppercase, 1 lowercase, and 1 symbol.");
            return;
        }

        if (!phoneRegex.test(input.phoneNumber)) {
            setPhoneError("Phone number must be exactly 10 digits.");
            return;
        }

        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", input.role);

        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                withCredentials: true,
            });

            if (res.data.success) {
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "An error occurred");
        } finally {
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
                    <h1 className='font-bold text-xl mb-5'>Sign up</h1>
                    <div className='my-2'>
                        <Label>Full Name</Label>
                        <Input
                            type="text"
                            value={input.fullname}
                            name="fullname"
                            onChange={changeEventHandler}
                            placeholder="Enter your name"
                            className="border-gray-300"
                        />
                    </div>
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
                        <Label>Phone Number</Label>
                        <Input
                            type="text"
                            value={input.phoneNumber}
                            name="phoneNumber"
                            onChange={changeEventHandler}
                            placeholder="9999999999"
                            className="border-gray-300"
                        />
                        {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
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
                        {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
                    </div>
                    <div className='flex'>
                        <RadioGroup className="flex items-center gap-4 my-5">
                            <div className="flex space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="student"
                                    checked={input.role === 'student'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer"
                                />
                                <Label className="mt-3">Student</Label>
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
                                <Label className="mt-3">Recruiter</Label>
                            </div>
                        </RadioGroup>
                        <div className='flex items-center gap-2'>
                            <Label className="ml-20">Profile</Label>
                            <Input
                                accept="image/*"
                                type="file"
                                onChange={changeFileHandler}
                                className="cursor-pointer"
                            />
                        </div>
                    </div>
                    {loading ? (
                        <Button className='w-full my-4'>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin'/> Please wait
                        </Button>
                    ) : (
                        <Button type="submit" className="w-full my-4">Signup</Button>
                    )}
                    <span>Already have an account? <Link to="/login" className='text-blue-400 hover:underline font-bold'>Login</Link></span>
                </form>
            </div>
        </div>
    );
}

export default Signup;
