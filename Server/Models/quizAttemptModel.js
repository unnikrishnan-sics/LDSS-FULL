const mongoose = require("mongoose");

const attemptedAnswerSchema = new mongoose.Schema({
    questionIndex: { // Index of the question in the quiz's questions array
        type: Number,
        required: true,
    },
    chosenAnswerIndex: { // Index of the option chosen by the child
        type: Number,
        required: true,
    },
    isCorrect: {
        type: Boolean,
        required: true,
    }
});

const quizAttemptSchema = new mongoose.Schema({
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
        required: true,
    },
    childId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "child",
        required: true,
    },
    parentId: { // Storing parent who initiated/viewed the attempt (optional but useful)
        type: mongoose.Schema.Types.ObjectId,
        ref: "parent",
        required: true,
    },
    therapistId: { // Storing therapist who created the quiz (optional but useful)
        type: mongoose.Schema.Types.ObjectId,
        ref: "theraphist",
        required: true,
    },
    answers: {
        type: [attemptedAnswerSchema],
        required: true,
    },
    score: { // Number of correct answers
        type: Number,
        required: true,
        default: 0,
    },
    completedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("QuizAttempt", quizAttemptSchema);