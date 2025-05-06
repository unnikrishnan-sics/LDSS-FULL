const learningModel = require("../Models/learningModel");

const addLearningPlan = async (req, res) => {
    try {
        const { goal, planDuration, weeks, educatorId, therapistId,childId } = req.body;
        if (!goal || !planDuration || weeks.length === 0 || !Array.isArray(weeks)) {
            return res.json({
                message: "Goal, planDuration, and at least one week with activities are required."
            })
        };

        const existingPlan = await learningModel.findOne({ childId });
        if (existingPlan) {
            return res.json({
                message: "Learning plan already added for this student."
            });
        }
        const newplan = new learningModel({
            goal,
            planDuration,
            weeks,
            educatorId,
            therapistId,
            childId
        });
        
        const savedPlan = await newplan.save();

        return res.status(201).json({
            // success: true,
            message: "Learning plan created successfully.",
            data: savedPlan
        })

    } catch (error) {
        console.log(error.message);
        res.json({
            message: error.message
        })
    }
};

const getLearningPlanOfSingleStudent=async(req,res)=>{
    try {
        const {educatorId,childId}=req.params;
    
        const childPlan=await learningModel.find({
            educatorId:educatorId,
            childId:childId
        }).populate("childId");

        if(!childPlan){
            return res.json({
                message:"no learning plan found for the child"
            })
        };
        return res.json({
            message:"Learning plan displayed",
            childPlan
        })

        
    } catch (error) {
        console.log(error.message);
        res.json({
            message:error.message
        })
    }
};
const deleteLearningPlanByeducator=async(req,res)=>{
    try {
        
        const planId=req.params.id;
        const deletedPlan=await learningModel.findByIdAndDelete(planId);
        if(!deletedPlan){
             return res.json({
                message:"cant able to find plan to delete."
            })
        };
        return res.json({
            message:"Learning plan deleted",
            deletedPlan
        })

        
    } catch (error) {
        console.log(error.message);
        res.json({
            message:error.message
        })
    }
}
module.exports = { addLearningPlan ,getLearningPlanOfSingleStudent,deleteLearningPlanByeducator}