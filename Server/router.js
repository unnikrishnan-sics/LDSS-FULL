const express=require("express");
const router=express.Router();

const parentController=require("./Controller/parentController");

const protectedRoute=require("./Middleware/protectedRoute")

const educatorController=require("./Controller/educatorController");

const theraphistController=require("./Controller/theraphistController");

const adminController=require("./Controller/adminController");

// admin

router.post("/admin/login",adminController.adminLogin);

// parent

router.post("/parent/registration",parentController.uploadProfilePic,parentController.parentRegister);
router.post("/parent/login",parentController.parentLogin);
router.post("/parent/forgotpassword",parentController.parentForgotPassword);
router.post("/parent/resetpassword/:email",parentController.parentResetPassword);
router.get("/parent/getparent/:id",protectedRoute.protectedRoute,parentController.getParentById);
router.post("/parent/updateparent/:id",protectedRoute.protectedRoute,parentController.uploadProfilePic,parentController.editParentById);

// educator

router.post("/educator/registration",educatorController.uploadProfilePic,educatorController.educatorRegister);
router.post("/educator/login",educatorController.educatorLogin);
router.post("/educator/forgotpassword",educatorController.educatorForgotPassword);
router.post("/educator/resetpassword/:email",educatorController.educatorResetPassword);
router.get("/educator/geteducator/:id",protectedRoute.protectedRoute,educatorController.getEducatorById);
router.post("/educator/updateeducator/:id",protectedRoute.protectedRoute,educatorController.uploadProfilePic,educatorController.editEducatorById);

// theraphist

router.post("/theraphist/registration",theraphistController.uploadProfilePic,theraphistController.theraphistRegister);
router.post("/theraphist/login",theraphistController.theraphistLogin);
router.post("/theraphist/forgotpassword",theraphistController.theraphistForgotPassword);
router.post("/theraphist/resetpassword/:email",theraphistController.theraphistResetPassword);
router.get("/theraphist/gettheraphist/:id",protectedRoute.protectedRoute,theraphistController.getTheraphistById);
router.post("/theraphist/updatetheraphist/:id",protectedRoute.protectedRoute,theraphistController.uploadProfilePic,theraphistController.editTheraphistById);

module.exports=router;