import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { USER_API_END_POINT } from "../../utils/constant.js";
import axios from "axios";
import { toast } from "sonner";
import { setLoading } from '../../redux/authSlice.js';
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';

function PasswordReset() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  const { token } = useParams();
  const { loading } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  axios.defaults.withCredentials = true;

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{4,16}$/;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!passwordRegex.test(password)) {
      setPasswordError("Password must be 4-16 characters and include 1 uppercase, 1 lowercase, and 1 symbol.");
      return;
    } else {
      setPasswordError("");
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match! Please try again.");
      return;
    }

    dispatch(setLoading(true));

    axios
      .post(`${USER_API_END_POINT}/resetpassword/${token}`, { password })
      .then((res) => {
        if (res.data.success === true) {
          navigate("/login");
          toast.success(res.data.message);
        }
      })
      .catch((err) => { 
        toast.error(err.response?.data?.message || "Something went wrong");
      })
      .finally(() => { 
        dispatch(setLoading(false));
      });
  };

  return (
    <div>
      <div className='bg-white'>
        <div className='flex items-center justify-between mx-auto max-w-7xl h-16'>
          <div>
            <h1 className='text-2xl font-bold'>Career<span className='text-[#F83002]'>Network</span></h1>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center max-w-7xl mx-auto">
        <form className="w-1/2 border border-gray-300 rounded-md p-4 my-10" onSubmit={handleSubmit}>
          <h1 className="font-bold text-xl mb-5">Reset Password</h1>
          <div className="my-2">
            <Label>New password</Label>
            <Input
              type="password"
              value={password} 
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="border-gray-300"
            />
            {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
          </div>
          <div className="my-2">
            <Label>Confirm password</Label>
            <Input
              type="password"
              value={confirmPassword} 
              name="confirmPassword"
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="border-gray-300"
            />
          </div>
          {loading ? (
            <Button className='w-full my-4'>
              <Loader2 className='mr-2 h-4 w-4 animate-spin'/> Please wait
            </Button> 
          ) : (
            <Button type="submit" className="w-full my-4">Reset</Button>
          )}
        </form>
      </div>
    </div>
  );
}

export default PasswordReset;
