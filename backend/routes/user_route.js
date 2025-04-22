import express from "express";
import { login, register, updateProfile, logout, forgotPassword, resetPassword, getAllStudents } from "../controllers/user_controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/profile/update").post(isAuthenticated,singleUpload, updateProfile);
router.route("/logout").get(logout);
router.route("/forgotpassword").post(forgotPassword);
router.route("/resetpassword/:token").post(resetPassword);
router.route("/getAllStudents").get(getAllStudents);

export default router;
