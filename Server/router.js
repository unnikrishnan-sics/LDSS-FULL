const express=require("express");
const router=express.Router();

const parentController=require("./Controller/parentController");

const protectedRoute=require("./Middleware/protectedRoute")

const educatorController=require("./Controller/educatorController");

const theraphistController=require("./Controller/theraphistController");

const adminController=require("./Controller/adminController");

const childController=require("./Controller/childController");

const requestController=require("./Controller/requestController");

const learningPlanController=require("./Controller/learningController");

// admin

router.post("/admin/login",adminController.adminLogin);
router.post("/admin/educator/accept/:id",protectedRoute.protectedRoute,educatorController.educatorRequestAccept);
router.delete("/admin/educator/reject/:id",protectedRoute.protectedRoute,educatorController.adminDeleteEducator);
router.post("/admin/theraphist/accept/:id",protectedRoute.protectedRoute,theraphistController.theraphistRequestAccept);
router.delete("/admin/theraphist/reject/:id",protectedRoute.protectedRoute,theraphistController.adminDeleteTheraphist);

// parent

router.post("/parent/registration",parentController.uploadProfilePic,parentController.parentRegister);
router.post("/parent/login",parentController.parentLogin);
router.post("/parent/forgotpassword",parentController.parentForgotPassword);
router.post("/parent/resetpassword/:email",parentController.parentResetPassword);
router.get("/parent/getparent/:id",protectedRoute.protectedRoute,parentController.getParentById);
router.get("/parent/getallparents",protectedRoute.protectedRoute,parentController.getAllParents);
router.post("/parent/updateparent/:id",protectedRoute.protectedRoute,parentController.uploadProfilePic,parentController.editParentById);
router.post("/parent/addchild/:id",protectedRoute.protectedRoute,childController.addChildByParent);
router.post("/parent/updatechild/:id/:childId",protectedRoute.protectedRoute,childController.editChildByParent);
router.get("/parent/getchild/:id/:childId",protectedRoute.protectedRoute,childController.getOneChildDetail);
router.get("/parent/getallchild",protectedRoute.protectedRoute,childController.getallChildDetails);
router.get("/parent/getallchildofparent/:id",protectedRoute.protectedRoute,childController.getAllChildOfParent);
router.delete("/parent/deletechild/:id/:childId",protectedRoute.protectedRoute,childController.deleteChildByParent);

// educator

router.post("/educator/registration",educatorController.uploadProfilePic,educatorController.educatorRegister);
router.post("/educator/login",educatorController.educatorLogin);
router.post("/educator/forgotpassword",educatorController.educatorForgotPassword);
router.post("/educator/resetpassword/:email",educatorController.educatorResetPassword);
router.get("/educator/geteducator/:id",protectedRoute.protectedRoute,educatorController.getEducatorById);
router.post("/educator/updateeducator/:id",protectedRoute.protectedRoute,educatorController.uploadProfilePic,educatorController.editEducatorById);
router.post("/educator/addpersonal/:id",protectedRoute.protectedRoute,educatorController.uploadCertification,educatorController.addEducatorPersonal);
router.get("/educator/getalleducators",protectedRoute.protectedRoute,educatorController.getAllEducators);
router.get("/educator/parentsrequest/:id",protectedRoute.protectedRoute,educatorController.getEducatorRequest);
router.put("/educator/acceptsrequest/:id",protectedRoute.protectedRoute,educatorController.educatorAcceptsParentRequest);
router.delete("/educator/rejectparent/:id",protectedRoute.protectedRoute,educatorController.educatorRejectParentRequest);
router.get("/educator/viewrequestedparent/:id",protectedRoute.protectedRoute,educatorController.educatorViewRequestById);
router.get("/educator/getapprovedparents/:id",protectedRoute.protectedRoute,educatorController.viewAllApprovedParentsByEducator);
router.get("/educator/getchildrenofallapprovedparents/:id",protectedRoute.protectedRoute,educatorController.viewAllChildsOfAllApprovedParents);
router.post("/educator/addlearning",protectedRoute.protectedRoute,learningPlanController.addLearningPlan);
router.get("/educator/getstudentplan/:educatorId/:childId",protectedRoute.protectedRoute,learningPlanController.getLearningPlanOfSingleStudent);
router.delete("/educator/deleteplan/:id",protectedRoute.protectedRoute,learningPlanController.deleteLearningPlanByeducator);

// theraphist

router.post("/theraphist/registration",theraphistController.uploadProfilePic,theraphistController.theraphistRegister);
router.post("/theraphist/login",theraphistController.theraphistLogin);
router.post("/theraphist/forgotpassword",theraphistController.theraphistForgotPassword);
router.post("/theraphist/resetpassword/:email",theraphistController.theraphistResetPassword);
router.get("/theraphist/gettheraphist/:id",protectedRoute.protectedRoute,theraphistController.getTheraphistById);
router.post("/theraphist/updatetheraphist/:id",protectedRoute.protectedRoute,theraphistController.uploadProfilePic,theraphistController.editTheraphistById);
router.get("/theraphist/getalltheraphist",protectedRoute.protectedRoute,theraphistController.getAllTheraphists);
router.post("/theraphist/addpersonal/:id",protectedRoute.protectedRoute,theraphistController.uploadCertification,theraphistController.addTheraphistPersonal);

// request

router.post("/request/sendrequest",protectedRoute.protectedRoute,requestController.sendRequest);

module.exports=router;