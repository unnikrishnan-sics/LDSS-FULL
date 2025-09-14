const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');


// Middleware
const protectedRoute = require("./Middleware/protectedRoute");

// Controllers
const parentController = require("./Controller/parentController");
const educatorController = require("./Controller/educatorController");
const theraphistController = require("./Controller/theraphistController");
const adminController = require("./Controller/adminController");
const childController = require("./Controller/childController");
const requestController = require("./Controller/requestController");
const learningPlanController = require("./Controller/learningController");
const meetingController = require("./Controller/meetingController");
const chatController = require("./Controller/chatController");
const activityController = require('./Controller/activityController');
const meetController = require('./Controller/meetingController');
const ratingController = require('./Controller/ratingController');
const blogController = require("./Controller/blogController");
// NEW: Quiz Controller
const quizController = require('./Controller/quizController');


// File Upload Config (Note: Multer setup is also in activityController.js now)
// const upload = multer({ dest: "uploads/" }); // This line might be redundant if using activityController.upload

/* ===================== ADMIN ===================== */
router.post("/admin/login", adminController.adminLogin);
router.post("/admin/educator/accept/:id", protectedRoute.protectedRoute, educatorController.educatorRequestAccept);
router.delete("/admin/educator/reject/:id", protectedRoute.protectedRoute, educatorController.adminDeleteEducator);
router.post("/admin/theraphist/accept/:id", protectedRoute.protectedRoute, theraphistController.theraphistRequestAccept);
router.delete("/admin/theraphist/reject/:id", protectedRoute.protectedRoute, theraphistController.adminDeleteTheraphist);


router.put(
  '/admin/activities/:id',
  activityController.upload.single('activityPhoto'), // Use activityController's multer instance
  activityController.editActivity
);
router.get('/admin/activity/:id',  activityController.getActivityById);
/* ===================== PARENT ===================== */
router.post("/parent/registration", parentController.uploadProfilePic, parentController.parentRegister);
router.post("/parent/login", parentController.parentLogin);
router.post("/parent/forgotpassword", parentController.parentForgotPassword);
router.post("/parent/resetpassword/:email", parentController.parentResetPassword);
router.get("/parent/getparent/:id", protectedRoute.protectedRoute, parentController.getParentById);
router.get("/parent/getallparents", protectedRoute.protectedRoute, parentController.getAllParents);
router.post("/parent/updateparent/:id", protectedRoute.protectedRoute, parentController.uploadProfilePic, parentController.editParentById);
router.post("/parent/addchild/:id", protectedRoute.protectedRoute, childController.addChildByParent);
router.post("/parent/updatechild/:id/:childId", protectedRoute.protectedRoute, childController.editChildByParent);
router.get("/parent/getchild/:id/:childId", protectedRoute.protectedRoute, childController.getOneChildDetail);
router.get("/parent/getallchild", protectedRoute.protectedRoute, childController.getallChildDetails);
router.get("/parent/getallchildofparent/:id", protectedRoute.protectedRoute, childController.getAllChildOfParent);
router.delete("/parent/deletechild/:id/:childId", protectedRoute.protectedRoute, childController.deleteChildByParent);
router.get("/parent/getacceptededucator/:id", protectedRoute.protectedRoute, parentController.getAcceptedEducator);
router.get("/parent/getacceptedtherapist/:id", protectedRoute.protectedRoute, parentController.getAcceptedTherapists);
router.put("/parent/updatelearningplan/:childId/:educatorId", protectedRoute.protectedRoute, learningPlanController.updateLearningPlanByParent);
router.put("/parent/updatelearningplantherapist/:childId/:therapistId", protectedRoute.protectedRoute, learningPlanController.updateLearningPlanByParentTherapist);
router.put("/parent/completeactivity/:childId/:weekIndex/:activityIndex", protectedRoute.protectedRoute, learningPlanController.markActivityCompleted);
router.get("/parent/getallmeeting/:id", protectedRoute.protectedRoute, meetingController.viewAllMeetingsOfParent);
router.get("/parent/getstudentplan/:educatorId/:childId",protectedRoute.protectedRoute,learningPlanController.getLearningPlanOfSingleStudent);
router.get("/parent/getstudentplantherapist/:therapistId/:childId",protectedRoute.protectedRoute,learningPlanController.getLearningPlanOfSingleTherapist);

// NEW: Parent Quiz Routes
router.get("/parent/quizzes/child/:childId", protectedRoute.protectedRoute, quizController.getParentQuizzesForChild); // Get quizzes for a child
router.get("/parent/quiz/attempt/:attemptId", protectedRoute.protectedRoute, quizController.getParentQuizAttemptDetails); // View specific attempt report
router.post("/parent/quiz/submit/:quizId", protectedRoute.protectedRoute, quizController.submitQuizAttempt); // Submit quiz attempt


/* ===================== EDUCATOR ===================== */
router.post("/educator/registration", educatorController.uploadProfilePic, educatorController.educatorRegister);
router.post("/educator/login", educatorController.educatorLogin);
router.post("/educator/forgotpassword", educatorController.educatorForgotPassword);
router.post("/educator/resetpassword/:email", educatorController.educatorResetPassword);
router.get("/educator/geteducator/:id", protectedRoute.protectedRoute, educatorController.getEducatorById);
router.post("/educator/updateeducator/:id", protectedRoute.protectedRoute, educatorController.uploadProfilePic, educatorController.editEducatorById);
router.post("/educator/addpersonal/:id", protectedRoute.protectedRoute, educatorController.uploadCertification, educatorController.addEducatorPersonal);
router.get("/educator/getalleducators", protectedRoute.protectedRoute, educatorController.getAllEducators);
router.get("/educator/parentsrequest/:id", protectedRoute.protectedRoute, educatorController.getEducatorRequest);
router.put("/educator/acceptsrequest/:id", protectedRoute.protectedRoute, educatorController.educatorAcceptsParentRequest);
router.delete("/educator/rejectparent/:id", protectedRoute.protectedRoute, educatorController.educatorRejectParentRequest);
router.get("/educator/viewrequestedparent/:id", protectedRoute.protectedRoute, educatorController.educatorViewRequestById);
router.get("/educator/getapprovedparents/:id", protectedRoute.protectedRoute, educatorController.viewAllApprovedParentsByEducator);
router.get("/educator/getchildrenofallapprovedparents/:id", protectedRoute.protectedRoute, educatorController.viewAllChildsOfAllApprovedParents);
router.post("/educator/addlearning", protectedRoute.protectedRoute, learningPlanController.addLearningPlan);
router.get("/educator/getstudentplan/:educatorId/:childId",protectedRoute.protectedRoute,learningPlanController.getLearningPlanOfSingleStudent);
router.delete("/educator/deleteplan/:id", protectedRoute.protectedRoute, learningPlanController.deleteLearningPlanByEducator);
router.put("/educator/updateplan/:educatorId/:childId", protectedRoute.protectedRoute, learningPlanController.editLearningPlanByEducator);
// router.post("/educator/Rating/:childId", protectedRoute.protectedRoute, learningPlanController.updateRating);
router.post("/educator/addmeeting/:id/:childId", protectedRoute.protectedRoute, meetingController.createMeeting);
router.get("/educator/viewmeeting/:id/:childId", protectedRoute.protectedRoute, meetingController.viewChildsMeeting);
router.get("/educator/viewmeeting/:id", protectedRoute.protectedRoute, meetingController.viewAllmeetingsOfEducator);


/* ===================== THERAPHIST ===================== */
router.post("/theraphist/registration", theraphistController.uploadProfilePic, theraphistController.theraphistRegister);
router.post("/theraphist/login", theraphistController.theraphistLogin);
router.post("/theraphist/forgotpassword", theraphistController.theraphistForgotPassword);
router.post("/theraphist/resetpassword/:email", theraphistController.theraphistResetPassword);
router.get("/theraphist/gettheraphist/:id", protectedRoute.protectedRoute, theraphistController.getTheraphistById);
router.post("/theraphist/updatetheraphist/:id", protectedRoute.protectedRoute, theraphistController.uploadProfilePic, theraphistController.editTheraphistById);
router.get("/theraphist/getalltheraphist", protectedRoute.protectedRoute, theraphistController.getAllTheraphists);
router.post("/theraphist/addpersonal/:id", protectedRoute.protectedRoute, theraphistController.uploadCertification, theraphistController.addTheraphistPersonal);
router.get("/theraphist/parentsrequest/:id", protectedRoute.protectedRoute, theraphistController.getTherapistRequests);
router.post("/theraphist/acceptrequest/:id", protectedRoute.protectedRoute, theraphistController.acceptParentRequest);
router.post("/theraphist/rejectrequest/:id", protectedRoute.protectedRoute, theraphistController.rejectParentRequest);
router.get("/theraphist/viewrequestedparent/:id", protectedRoute.protectedRoute, theraphistController.viewRequestById);
router.get("/theraphist/getapprovedparents/:id", protectedRoute.protectedRoute, theraphistController.viewAllApprovedParentsByTherapist);
router.get("/theraphist/getchildrenofallapprovedparents/:id", protectedRoute.protectedRoute, theraphistController.viewAllChildsOfApprovedParents);
router.post("/theraphist/addlearning", protectedRoute.protectedRoute, learningPlanController.addLearningPlanTherapist);
router.put("/theraphist/updateplan/:therapistId/:childId", protectedRoute.protectedRoute, learningPlanController.editLearningPlanByTherapist);
router.get("/theraphist/getstudentplan/:therapistId/:childId",protectedRoute.protectedRoute,learningPlanController.getLearningPlanOfSingleTherapist);
router.delete("/theraphist/deleteplan/:id", protectedRoute.protectedRoute, learningPlanController.deleteLearningTherapist);

// NEW: Therapist Quiz Routes
router.post("/therapist/quizzes", protectedRoute.protectedRoute, quizController.createQuiz); // Create a new quiz
router.get("/therapist/quizzes/child/:childId", protectedRoute.protectedRoute, quizController.getTherapistQuizzesForChild); // Get quizzes for a child
router.get("/therapist/quizzes/attempts/:childId", protectedRoute.protectedRoute, quizController.getTherapistQuizAttemptsForChild); // Get all attempts by a child
router.get("/therapist/quiz/attempt/:attemptId", protectedRoute.protectedRoute, quizController.getTherapistQuizAttemptDetails); // View specific attempt report
router.delete("/therapist/quiz/:quizId", protectedRoute.protectedRoute, quizController.deleteQuiz); // Delete a quiz


/* ===================== REQUEST ===================== */
router.post("/request/sendrequest", protectedRoute.protectedRoute, requestController.sendRequest);
router.get("/request/fetchall",  requestController.fetchAll);

/* ===================== CHAT ===================== */
router.post("/conversations", protectedRoute.protectedRoute, chatController.createConversation);
router.get("/conversations/user/:userId", protectedRoute.protectedRoute, chatController.getUserConversations);
router.get("/conversations/:id", protectedRoute.protectedRoute, chatController.getConversation);
router.post("/conversations/:id/messages", protectedRoute.protectedRoute, chatController.addMessage);
router.patch("/conversations/:id/read", protectedRoute.protectedRoute, chatController.markAsRead);
router.get("/parent/conversations/:parentId", protectedRoute.protectedRoute, chatController.getUserConversations);

/* ===================== ACTIVITY ===================== */
router.post(
  '/addactivity',
  protectedRoute.protectedRoute,
  activityController.upload.single('activityPhoto'),
  activityController.addActivity
);
router.get('/activity/getallactivities', protectedRoute.protectedRoute, activityController.getAllActivities);

router.get('/activity/parent/:parentId', protectedRoute.protectedRoute, activityController.getEnrolledActivitiesByParent);

router.post('/activity/enroll/:activityId/:parentId', protectedRoute.protectedRoute, activityController.enrollActivity);

router.patch('/activity/complete/:activityId', protectedRoute.protectedRoute, activityController.markActivityComplete);

router.delete('/activity/delete/:id', protectedRoute.protectedRoute, activityController.deleteActivity);

// meeting
router.post(
  '/ldss/meeting/:id/:childId',
  protectedRoute.protectedRoute,
  meetController.createMeeting
);
router.post("/educator/addmeeting/:id/:childId", protectedRoute.protectedRoute, meetingController.createMeeting);
router.get("/educator/viewmeeting/:id/:childId", protectedRoute.protectedRoute, meetingController.viewChildsMeeting);
router.get("/educator/viewmeeting/:id", protectedRoute.protectedRoute, meetingController.viewAllmeetingsOfEducator);
router.get("/parent/getallmeeting/:id", protectedRoute.protectedRoute, meetingController.viewAllMeetingsOfParent);
router.post("/therapist/addmeeting/:id/:childId", protectedRoute.protectedRoute, meetingController.createMeeting);
router.get("/therapist/viewmeeting/:id/:childId", protectedRoute.protectedRoute, meetingController.viewChildsMeeting);
router.get("/therapist/viewmeeting/:id", protectedRoute.protectedRoute, meetingController.viewAllmeetingsOfTherapist);


//RATING
router.get('/average/:professionalType/:professionalId', protectedRoute.protectedRoute,ratingController.getAverageRatingForProfessional);
router.get('/specific', protectedRoute.protectedRoute,ratingController.getSpecificRating);
router.post('/addrating',protectedRoute.protectedRoute, ratingController.addOrUpdateRating);
router.get('/ratings/:professionalType', protectedRoute.protectedRoute, ratingController.getRatingsByProfessionalType);

/* ===================== BLOG ===================== */
router.post(
    "/blog/add",
    protectedRoute.protectedRoute,
    blogController.upload,
    blogController.addBlog
);
router.put(
    "/blog/edit/:id",
    protectedRoute.protectedRoute,
    blogController.upload,
    blogController.editBlog
);
router.get("/quizzes/:quizId", protectedRoute.protectedRoute, quizController.getQuizById); // Get single quiz by ID
router.get("/blog/all", blogController.fetchAllBlogs);
router.get("/blog/:id", blogController.fetchBlogById);
router.post("/blog/like/:id", protectedRoute.protectedRoute, blogController.addLike);
router.delete("/blog/unlike/:id", protectedRoute.protectedRoute, blogController.removeLike);
router.delete("/blog/delete/:id", protectedRoute.protectedRoute, blogController.removeBlog);

module.exports = router;