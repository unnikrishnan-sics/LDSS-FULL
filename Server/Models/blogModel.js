const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
        maxlength: [100, "Title cannot exceed 100 characters"]
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true
    },
    image: {
        type: Object,
        default: null
    },
    creatorType: {
        type: String,
        required: [true, "Creator type is required"],
        enum: {
            values: ["educator", "theraphist", "admin"],
            message: "Invalid creator type"
        }
    },
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Creator ID is required"],
        refPath: 'creatorType'
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: function() {
            // Dynamic reference based on who can like the blog
            // Since parents can also like, we need to handle all cases
            return this.creatorType === 'educator' ? 'educator' : 
                   this.creatorType === 'theraphist' ? 'theraphist' : 
                   'admin';
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Update the updatedAt field before saving
blogSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("Blog", blogSchema);