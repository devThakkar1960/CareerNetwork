import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { USER_API_END_POINT } from '../../utils/constant.js';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../../redux/authSlice.js';
import { Loader2 } from 'lucide-react';

function Forgotpassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);

  axios.defaults.withCredentials = true;

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));

    try {
      const res = await axios.post(`${USER_API_END_POINT}/forgotpassword`, { email });
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center max-w-7xl mx-auto">
        <form
          className="w-1/2 border border-gray-300 rounded-md p-4 my-10"
          onSubmit={handleSubmit}
        >
          <h1 className="font-bold text-xl mb-5">Forgot Password</h1>
          <div className="my-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="abc@gmail.com"
              className="border-gray-300"
            />
          </div>
          <Button type="submit" className="w-full my-4" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
              </>
            ) : (
              "Verify Email"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Forgotpassword;
