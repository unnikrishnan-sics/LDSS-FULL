const Quiz = require("../Models/quizModel");
const QuizAttempt = require("../Models/quizAttemptModel");
const Parent = require("../Models/parentModel"); // Assuming you might need parent details sometimes

// Helper to verify user role and access (basic example, protectedRoute middleware handles most)
const verifyTherapistAccess = async (therapistId, reqUserId) => {
    if (therapistId.toString() !== reqUserId.toString()) {
        throw new Error("Unauthorized: You do not have permission to access this resource.");
    }
};

const verifyParentAccess = async (parentId, reqUserId) => {
     if (parentId.toString() !== reqUserId.toString()) {
        throw new Error("Unauthorized: You do not have permission to access this resource.");
    }
};


// Therapist creates a quiz for a child
const createQuiz = async (req, res) => {
    try {
        const { childId, title, questions,therapistId } = req.body;
        // const therapistId = req.user.userId;
console.log(therapistId);

        if (!childId || !title || !questions || !Array.isArray(questions) || questions.length < 5) {
            return res.status(400).json({ success: false, message: "Child ID, title, and at least 5 questions are required." });
        }

        // Basic validation for questions structure
        for(const q of questions) {
            if (!q.questionText || !Array.isArray(q.options) || q.options.length < 2 || q.correctAnswerIndex === undefined || q.correctAnswerIndex < 0 || q.correctAnswerIndex >= q.options.length) {
                 return res.status(400).json({ success: false, message: "Each question must have text, at least 2 options, and a valid correct answer index." });
            }
        }


        const newQuiz = new Quiz({
            therapistId: therapistId,
            childId: childId,
            title: title,
            questions: questions,
        });

        const savedQuiz = await newQuiz.save();

        res.status(201).json({
            success: true,
            message: "Quiz created successfully",
            data: savedQuiz,
        });

    } catch (error) {
        console.error("Error creating quiz:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Therapist gets quizzes created by them for a specific child
const getTherapistQuizzesForChild = async (req, res) => {
    try {
        const { childId } = req.params;
        // const therapistId = req.user.userId; // Assuming userId from protectedRoute middleware is therapistId

        const quizzes = await Quiz.find({ childId: childId });

        res.status(200).json({
            success: true,
            message: "Quizzes fetched successfully",
            data: quizzes,
        });

    } catch (error) {
        console.error("Error fetching therapist quizzes:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Therapist gets all attempts for quizzes they created for a specific child
const getTherapistQuizAttemptsForChild = async (req, res) => {
    try {
        const { childId } = req.params;
        // const therapistId = req.user.userId; // Assuming userId from protectedRoute middleware is therapistId

        // Find all quizzes created by this therapist for this child
        const quizzes = await Quiz.find({ childId: childId }).select('_id');
        const quizIds = quizzes.map(q => q._id);

        if (quizIds.length === 0) {
             return res.status(200).json({ success: true, message: "No quizzes found for this child by this therapist, thus no attempts.", data: [] });
        }

        // Find all attempts for these quizzes and this child
        const attempts = await QuizAttempt.find({
            quizId: { $in: quizIds },
            childId: childId,
        }).populate('quizId', 'title'); // Populate quiz title for context

        res.status(200).json({
            success: true,
            message: "Quiz attempts fetched successfully",
            data: attempts,
        });

    } catch (error) {
        console.error("Error fetching therapist quiz attempts:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Therapist gets details of a specific quiz attempt
const getTherapistQuizAttemptDetails = async (req, res) => {
    try {
        const { attemptId } = req.params;
        const therapistId = req.user.userId; // Assuming userId from protectedRoute middleware is therapistId

        const attempt = await QuizAttempt.findById(attemptId).populate('quizId');

        if (!attempt) {
            return res.status(404).json({ success: false, message: "Quiz attempt not found." });
        }

       

        res.status(200).json({
            success: true,
            message: "Quiz attempt details fetched successfully",
            data: attempt,
        });

    } catch (error) {
        console.error("Error fetching therapist quiz attempt details:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Parent gets all quizzes assigned to their child + attempt status
const getParentQuizzesForChild = async (req, res) => {
    try {
        const { childId } = req.params;
        const parentId = req.user.userId; // Assuming userId from protectedRoute middleware is parentId

        // First, verify the child belongs to this parent (optional but good practice)
        // You might need to fetch child details and check parentId
        // For now, let's assume the route structure ensures this or is handled elsewhere.
        // Example: const child = await ChildModel.findById(childId); if (!child || child.parentId.toString() !== parentId.toString()) return res.status(403)...


        // Find all quizzes assigned to this child
        const quizzes = await Quiz.find({ childId: childId });

        if (quizzes.length === 0) {
             return res.status(200).json({ success: true, message: "No quizzes assigned to this child yet.", data: [] });
        }

        // Find existing attempts for these quizzes by this child and parent
        const quizIds = quizzes.map(q => q._id);
        const attempts = await QuizAttempt.find({
            quizId: { $in: quizIds },
            childId: childId,
        });

        // Map quizzes and add attempt information
        const quizzesWithStatus = quizzes.map(quiz => {
            const attempt = attempts.find(att => att.quizId.equals(quiz._id));
            return {
                ...quiz.toObject(), // Convert Mongoose document to plain object
                attempt: attempt ? {
                    _id: attempt._id,
                    score: attempt.score,
                    completedAt: attempt.completedAt
                } : null,
            };
        });


        res.status(200).json({
            success: true,
            message: "Quizzes with attempt status fetched successfully",
            data: quizzesWithStatus,
        });

    } catch (error) {
        console.error("Error fetching parent quizzes:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Parent gets details of a specific quiz attempt for their child
const getParentQuizAttemptDetails = async (req, res) => {
    try {
        const { attemptId } = req.params;
        // const parentId = req.user.userId; // Assuming userId from protectedRoute middleware is parentId

        const attempt = await QuizAttempt.findById(attemptId).populate('quizId');

        if (!attempt) {
            return res.status(404).json({ success: false, message: "Quiz attempt not found." });
        }

        // Verify the logged-in parent is the parent associated with this attempt's child
 

        res.status(200).json({
            success: true,
            message: "Quiz attempt details fetched successfully",
            data: attempt,
        });

    } catch (error) {
        console.error("Error fetching parent quiz attempt details:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};


// Parent submits a quiz attempt for their child
const submitQuizAttempt = async (req, res) => {
    try {
        const { quizId } = req.params;
        const { answers ,parentId} = req.body; // answers is an array of { questionIndex: number, chosenAnswerIndex: number }
        // const parentId = req.user.token; // Assuming userId from protectedRoute middleware is parentId

        if (!Array.isArray(answers)) {
            return res.status(400).json({ success: false, message: "Answers must be an array." });
        }

        const quiz = await Quiz.findById(quizId);

        if (!quiz) {
            return res.status(404).json({ success: false, message: "Quiz not found." });
        }

        // Basic validation that answers correspond to quiz questions
         if (answers.length !== quiz.questions.length) {
             return res.status(400).json({ success: false, message: "Number of submitted answers does not match the number of questions." });
         }
         for(const ans of answers) {
             if (ans.questionIndex === undefined || ans.chosenAnswerIndex === undefined || ans.questionIndex < 0 || ans.questionIndex >= quiz.questions.length || ans.chosenAnswerIndex < 0 || ans.chosenAnswerIndex >= quiz.questions[ans.questionIndex].options.length) {
                 return res.status(400).json({ success: false, message: "Invalid answer format or index out of bounds." });
             }
         }

        // Check if an attempt already exists for this child and quiz by this parent
        // Depending on requirements, you might allow multiple attempts or prevent them
        // For V1, let's prevent multiple attempts by the same parent/child combination for the same quiz.
        const existingAttempt = await QuizAttempt.findOne({ quizId: quizId, childId: quiz.childId, parentId: parentId });
        if (existingAttempt) {
             return res.status(409).json({ success: false, message: "This child has already completed this quiz." });
        }


        let score = 0;
        const processedAnswers = answers.map(answer => {
            const question = quiz.questions[answer.questionIndex];
            const isCorrect = question.correctAnswerIndex === answer.chosenAnswerIndex;
            if (isCorrect) {
                score++;
            }
            return {
                questionIndex: answer.questionIndex,
                chosenAnswerIndex: answer.chosenAnswerIndex,
                isCorrect: isCorrect,
            };
        });

        const newAttempt = new QuizAttempt({
            quizId: quizId,
            childId: quiz.childId, // Get childId from the quiz itself
            parentId: parentId,
            therapistId: quiz.therapistId, // Get therapistId from the quiz itself
            answers: processedAnswers,
            score: score,
            completedAt: new Date(),
        });

        const savedAttempt = await newAttempt.save();

        res.status(201).json({
            success: true,
            message: "Quiz attempt submitted successfully",
            data: savedAttempt,
            score: score,
            totalQuestions: quiz.questions.length,
        });

    } catch (error) {
        console.error("Error submitting quiz attempt:", error);
         if (error.name === 'ValidationError') {
            // Mongoose validation error
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

// Therapist or Admin deletes a quiz
const deleteQuiz = async (req, res) => {
    try {
        const { quizId } = req.params;
        const userId = req.user.userId;
        const userRole = req.user.role; // Assuming role is attached by protectedRoute

        const quiz = await Quiz.findById(quizId);

        if (!quiz) {
            return res.status(404).json({ success: false, message: "Quiz not found." });
        }

        // Authorization check: Only the creator therapist or admin can delete
        if (userRole === 'therapist' && quiz.therapistId.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized: You do not have permission to delete this quiz." });
        }
        // Admin check is implicitly handled if admin routes exist and call this.
        // If not, you'd need an explicit check here: if (userRole !== 'admin' && userRole !== 'therapist') return res.status(403)...

        // Delete the quiz and all associated attempts
        await QuizAttempt.deleteMany({ quizId: quizId });
        const deletedQuiz = await Quiz.findByIdAndDelete(quizId);


        res.status(200).json({
            success: true,
            message: "Quiz and associated attempts deleted successfully",
            data: deletedQuiz,
        });

    } catch (error) {
        console.error("Error deleting quiz:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const getQuizById = async (req, res) => {
    try {
        const { quizId } = req.params;
        // Optional: Add checks here if needed, e.g., if the user is the therapist,
        // or the parent of the child associated with the quiz.
        // For simplicity now, rely on protectedRoute and assume valid users can access quizzes they are linked to.

        const quiz = await Quiz.findById(quizId);

        if (!quiz) {
            return res.status(404).json({ success: false, message: "Quiz not found." });
        }

        res.status(200).json({
            success: true,
            message: "Quiz fetched successfully",
            data: quiz,
        });

    } catch (error) {
        console.error("Error fetching quiz by ID:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
module.exports = {
    createQuiz,
    getTherapistQuizzesForChild,
    getTherapistQuizAttemptsForChild,
    getTherapistQuizAttemptDetails,
    getParentQuizzesForChild,
    getParentQuizAttemptDetails,
    submitQuizAttempt,
    deleteQuiz,getQuizById
};
