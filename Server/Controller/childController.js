
const childModel=require("../Models/childModel");


const addChildByParent= async(req,res)=>{

    try {
        const {name,schoolName,description,dateOfBirth,gender}=req.body;
    const parentId=req.params.id;
    const newChild=new childModel({
        name,
        schoolName,
        description,
        dateOfBirth,
        gender
    });
    newChild.parentId=parentId;
    await newChild.save();
    res.json({
        message:"Child added successfully.",
        child:newChild
    });
        
    } catch (error) {
        console.log(error.message);
        res.json({
            message:error.message
        })
    }

}

const editChildByParent=async(req,res)=>{
    try {
        const {name,schoolName,description,dateOfBirth,gender}=req.body;
        const parentId=req.params.id;
        const childId=req.params.childId;
        // const child=await childModel.findById(childId);
        const child = await childModel.findOne({ _id: childId, parentId: parentId });
        if(!child){
            return res.json({
                message:"Child not found."
            })
        };
        child.name=name;
        child.schoolName=schoolName;
        child.description=description;
        child.dateOfBirth=dateOfBirth;
        child.gender=gender;
        await child.save();
        res.json({
            message:"Child updated successfully.",
            child:child
        });

    } catch (error) {
        console.log(error.message);
        res.json({
            message:error.message
        })
    }
}
const getOneChildDetail=async(req,res)=>{
    try {
        const parentId=req.params.id;
        const childId=req.params.childId;
        const child = await childModel.findOne({ _id: childId, parentId: parentId });
        if(!child){
            return res.json({
                message:"Child not found."
            })
        };
        res.json({
            message:"Child fetched successfully.",
            child:child
        });
        
    } catch (error) {
        console.log(error.message);
        res.json({
            message:error.message
        })
    }
}
const getallChildDetails=async(req,res)=>{
    try {
        // const parentId=req.params.id;
        const child = await childModel.find();
        if(!child){
            return res.json({
                message:"Child not found."
            })
        };
        res.json({
            message:"Child fetched successfully.",
            child:child
        });
        
    } catch (error) {
        console.log(error.message);
        res.json({
            message:error.message
        })
    }

}
const getAllChildOfParent=async(req,res)=>{
    try {
        const parentId=req.params.id;
        const child = await childModel.find({parentId:parentId});
        if(!child){
            return res.json({
                message:"Child not found."
            })
        };
        res.json({
            message:"Child fetched successfully.",
            child:child
        });
        
    } catch (error) {
        console.log(error.message);
        res.json({
            message:error.message
        })
    }
}
const deleteChildByParent=async(req,res)=>{
    try {
        const parentId=req.params.id;
        const childId=req.params.childId;
        const child = await childModel.findOneAndDelete({ parentId: parentId, _id: childId });
        console.log(child);
        if(!child){
            return res.json({
                message:"Child not found."
            })
        };
        
        res.json({
            message:"Child deleted successfully.",
            child:child
        });
        
    } catch (error) {
        console.log(error.message);
        res.json({
            message:error.message
        })
    }
}
module.exports={addChildByParent,editChildByParent,getOneChildDetail,getallChildDetails,getAllChildOfParent,deleteChildByParent};
