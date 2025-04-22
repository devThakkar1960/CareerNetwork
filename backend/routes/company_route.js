import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { deleteCompanyById, getAllCompanies, getCompany, getCompanyById, registerCompany, updateCompany } from "../controllers/company_controller.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.route("/register").post(isAuthenticated,registerCompany);
router.route("/get").get(isAuthenticated,getCompany);
router.route("/get/:id").get(isAuthenticated,getCompanyById);
router.route("/update/:id").put(isAuthenticated, singleUpload, updateCompany);
router.route("/delete/:id").delete(deleteCompanyById);
router.route("/getallcompany").get(getAllCompanies);

export default router;
