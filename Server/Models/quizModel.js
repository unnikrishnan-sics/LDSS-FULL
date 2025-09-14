const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true,
    },
    options: {
        type: [String], // Array of strings for multiple choices
        required: true,
        validate: {
            validator: function(v) {
                return v && v.length >= 2; // Ensure at least 2 options
            },
            message: props => `${props.value.length} options provided. Must have at least 2 options!`
        }
    },
    correctAnswerIndex: {
        type: Number,
        required: true,
        validate: {
            validator: function(v) {
                // Ensure the index is within the bounds of the options array
                return v >= 0 && v < this.options.length;
            },
            message: props => `Correct answer index ${props.value} is out of bounds for the provided options.`
        }
    },
});

const quizSchema = new mongoose.Schema({
    therapistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "theraphist",
        required: true,
    },
    childId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "child",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    questions: {
        type: [questionSchema],
        required: true,
        validate: {
            validator: function(v) {
                return v && v.length >= 5; // Ensure at least 5 questions
            },
            message: props => `${props.value.length} questions provided. Must have at least 5 questions!`
        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Quiz", quizSchema);