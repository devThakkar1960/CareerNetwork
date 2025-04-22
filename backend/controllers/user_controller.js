import { User } from "../models/user_model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";


export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
        // console.log(fullname, email, phoneNumber, password, role);
        
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something Missing",
                success: false,
            });
        }
        const file = req.file;
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "User alreay exist with this email",
                success: false,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                profilePhoto: cloudResponse.secure_url,
            }
        });

        return res.status(201).json({
            message: "account created successfully",
            success: true,
        });
    } catch (error) {
           console.log(error);
    }
};

export const login = async(req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something Missing",
                success: false,
            });
        }
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message: "Incorrect Email or Password",
                success: false,
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch){
            return res.status(400).json({
                message: "Incorrect Email or Password",
                success: false,
            });
        }

        if(role !== user.role){
            return res.status(400).json({
                message: "Account doesn't exist with current role",
                success: false,
            });
        }

        const tokenData = {
            userId: user._id,
        };

        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {expiresIn: '1d'});

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
        };

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true,
        });
    } catch(error){
        console.log(error);
    }
};

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", {maxAge:0}).json({
            message: "Logged out Successfully",
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills, profilePhoto } = req.body;

        const file = req.file;
        const fileUri = getDataUri(file)
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content)
                
        let skillsArray;
        if(skills)
            skillsArray = skills.split(",");
        const userId = req.id;
        let user = await User.findById(userId);

        if(!user){
            return res.status(400).json({
                message: "User not found",
                success: false,
            });
        }
        
        if(fullname) user.fullname = fullname;
        if(email) user.email = email;
        if(phoneNumber)  user.phoneNumber = phoneNumber;
        if(bio) user.profile.bio = bio;
        if(skills) user.profile.skills = skillsArray;
        //update profile
        if(profilePhoto) user.profile.profilePhoto = profilePhoto
        
        

        if(cloudResponse){
            if (file.mimetype === "application/pdf") {
                // If the uploaded file is a PDF, set it as the resume
                user.profile.resume = cloudResponse.secure_url;
                user.profile.resumeOriginalName = file.originalname;
            }
           else if (file.mimetype.startsWith("image/")) {
                // If the uploaded file is an image, set it as the profile photo
                user.profile.profilePhoto = cloudResponse.secure_url;
            } 
        }
        await user.save();
        
        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
        };

        return res.status(200).json({
            message: "Profile Updated successfully",
            user,
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
};

export const forgotPassword = async(req, res) => {
    try {
        const {email} = req.body;

        if(!email){
            return res.status(400).send({
                message:"Please provied email",
            });
        }

        const checkUser = await User.findOne({email});

        if(!checkUser){
            return res.status(400).send({
                message: "User not found please register",
            });
        }

        const token = jwt.sign({email}, process.env.JWT_SECRET_KEY, {
            expiresIn: "1h",
        });

        const transporter = nodemailer.createTransport({
            service: "gmail",
            secure: true,
            auth: {
               user: process.env.MY_GMAIL,
               pass: process.env.MY_PASSWORD,
            },
        });

        const receiver = {
            from: "hari1837pandey@gmail.com",
            to: email,
            subject: "Password Reset Request",
            text: "",
html: `
  <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
    <h2 style="color: #4CAF50;">🔐 Reset Your CareerNetwork Password</h2>
    <p>Hi there,</p>
    <p>We received a request to reset your password. Click the button below to create a new one:</p>
    <a href="https://careernetwork-6d6a.onrender.com/resetpassword/${token}" 
       style="display: inline-block; padding: 10px 20px; margin: 15px 0; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
      Reset Password
    </a>
    <p>If you did not request a password reset, please ignore this email.</p>
    <p style="margin-top: 30px;">Thanks,<br>The CareerNetwork Team</p>
  </div>
`

        };

        await transporter.sendMail(receiver);
        return res.status(200).json({
            message: "Password reset link has been sent to your Gmail",
            success:true,
        });

    } catch (error) {
        console.log(error);
    }
};

export const resetPassword = async(req, res) => {
    try {
        const {token} = req.params;
        const {password} = req.body;

        if(!password){
            return res.status(400).send({
                message: "Please provide password",
                success: true,
            });
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findOne({email: decode.email});

        const newHashPassword = await bcrypt.hash(password,10);
        user.password = newHashPassword;

        await user.save();

        return res.status(200).send({
            message: "Password reset succeessfully",
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
};

export const getAllStudents = async (req, res) => {
    try {
        if (req.query.getRole === "true") {
            const students = await User.find({ role: "student" }).select("-password");
            return res.status(200).json({
                students,
                success: true,
            });
        } else {
            return res.status(400).json({
                message: "Invalid query",
                success: false,
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false,
        });
    }
};
