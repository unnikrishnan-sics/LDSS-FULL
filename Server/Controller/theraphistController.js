
const bcrypt=require("bcryptjs");
const multer=require("multer");
const jwt = require("jsonwebtoken");
const theraphistModel = require("../Models/theraphistModel");
const requestModel = require("../Models/requestModel");
const childModel = require("../Models/childModel");


const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"./uploads")
    },
    filename:(req,file,cb)=>{
        const prefix="profile-";
        const fullName=file.originalname;
        const extension=file.originalname.split(".").pop();
        const fileName=prefix + fullName.substring(0,fullName.lastIndexOf("."))+Date.now()+ "."+extension;
        cb(null,fileName);
    } 
})
const uploadProfilePic=multer(
    {storage:storage}
    ).single("profilePic");

    const uploadCertification=multer(
        {storage:storage}
    ).single("certification")
const getLinkedEducators = async (req, res) => {
    try {
        const therapistId = req.params.id; // The therapist's own ID

        // 1. Find all parents accepted by this therapist
        const therapistApprovedRequests = await requestModel.find({
            recipientId: therapistId,
            recipientRole: "theraphist",
            status: "accepted"
        });
        const therapistApprovedParentIds = therapistApprovedRequests.map(req => req.parentId);

        // If no parents are approved by this therapist, there will be no linked educators
        if (therapistApprovedParentIds.length === 0) {
            return res.json({
                message: "No common parents found, no linked educators.",
                educators: []
            });
        }

        // 2. Find all educators who have accepted requests from these same parents
        // We only care about the recipientId (educator ID) here
        const educatorApprovedRequests = await requestModel.find({
            parentId: { $in: therapistApprovedParentIds },
            recipientRole: "educator",
            status: "accepted"
        });

        // Extract unique educator IDs from these requests
        const uniqueEducatorIds = [...new Set(educatorApprovedRequests.map(req => req.recipientId))];

        // If no educators are linked through common parents, return empty
        if (uniqueEducatorIds.length === 0) {
            return res.json({
                message: "No educators linked through common parents found.",
                educators: []
            });
        }

        // 3. Fetch the actual educator details for these unique IDs
        const linkedEducators = await educatorModel.find({ _id: { $in: uniqueEducatorIds } });

        res.json({
            message: "Fetched linked educators successfully",
            educators: linkedEducators
        });

    } catch (error) {
        console.error('Error fetching linked educators:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};
const theraphistRegister= async (req,res)=>{
    try {
        const { name, email, password,confirmpassword, address, phone ,agreed} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const profilePic=req.file;
        const newTheraphist= await new theraphistModel({
            name,
            email,
            password:hashedPassword,
            confirmpassword:hashedPassword,
            address,
            phone,
            agreed,
            profilePic
        });
        
        let existingThreaphist=await theraphistModel.findOne({email});
        if(existingThreaphist){
             return res.json({
                message:"theraphist already registered with this email"
            })
        };
        existingThreaphist=await theraphistModel.findOne({phone});
        if(existingThreaphist){
             return res.json({
                message:"theraphist already registered with this phone number"
            })
        }
        if(password!==confirmpassword){
            return res.json({message:"Password and Confirm Password should be same."})
        }
       
       await newTheraphist.save()  ;
       res.status(201).json({
        message:"theraphist created successfully",
        data:newTheraphist
       })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message:error.message});
    }
};

const theraphistLogin=async (req,res)=>{
    try {
        const {email,password}=req.body;
        const theraphist=await theraphistModel.findOne({email});
        if(!theraphist){
            return res.json({message:"theraphist not found with this email."})
        }
        const isMatch=await bcrypt.compare(password,theraphist.password);
        if(!isMatch){
            return res.json({message:"Invalid Password."})
        }
        const token=await jwt.sign({id:theraphist._id},process.env.SECRET_KEY,{expiresIn:"4hr"});
        res.status(200).json({message:"theraphist logged in successfully",token:token});
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message:error.message});
    }
}

const theraphistForgotPassword= async(req,res)=>{
    try {
        const {email}=req.body;
        const theraphist= await theraphistModel.findOne({email});
        if(!theraphist){
            return res.json({message:" No theraphist found with this email."})
        }
        res.json({
            message:"navigate to password reset page",
        })

        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message:error.message});
    }
};
const theraphistResetPassword= async(req,res)=>{
    try {
        const {password,confirmpassword}=req.body;
        // const {email}=req.params;
        const theraphist= await theraphistModel.findOne({email:req.params.email});
        if(!theraphist){
            return res.json({message:"No theraphist found with this email."})
        };
        if(password!==confirmpassword){
            return res.json({message:"Passwords do not match."})
        }
        const hashedPassword=await bcrypt.hash(password,10);
        theraphist.password=hashedPassword;
        theraphist.confirmpassword=hashedPassword;
        await theraphist.save(); 
        res.json({message:"Password reset successfully."});

    } catch (error) {
        console.log(error.message);
        res.status(500).json({message:error.message});
    }
}
const getTheraphistById=async(req,res)=>{
    try {
        const theraphistId=req.params.id;
        const theraphist=await theraphistModel.findById(theraphistId);
        if(!theraphist){
            return res.json({message:"No theraphist found with this id."})
        }
        return res.json({
            message:"theraphist found with the provided id",
            theraphist:theraphist
        })
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message:error.message});
    }
}
const editTheraphistById = async (req, res) => {
    try {
        const theraphistId = req.params.id;
        const profilePic=req.file;
        const { name, email, phone, address } = req.body;

        const updatedTheraphist = await theraphistModel.findByIdAndUpdate(
            theraphistId,
            { name, email, phone, address,profilePic },
            { new: true }
        );

        if (!updatedTheraphist) {
            return res.status(404).json({ message: "theraphist not found." });
        }

        res.json({ message: "theraphist updated successfully.", theraphist: updatedTheraphist });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
};
const getAllTheraphists=async(req,res)=>{
    try {
        const theraphists=await theraphistModel.find();
        if(!theraphists){
            return res.json({message:"No theraphist found."})
        }
        return res.json({
            message:"theraphist found with the provided id",
            theraphist:theraphists
        })
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message:error.message});
    }
}
const addTheraphistPersonal=async(req,res)=>{
    try {
        const{educationalQualification,yearsOfExperience,languages,availability,specialities}=req.body;
        const certification=req.file;
        const theraphistId=req.params.id;
        const theraphist=await theraphistModel.findById(theraphistId);
        if(!theraphist){
            return res.json({message:"No theraphist found with this id."})
        };
        theraphist.educationalQualification=educationalQualification;
        theraphist.yearsOfExperience=yearsOfExperience;
        theraphist.languages=languages;
        theraphist.availability=availability;
        theraphist.certification=certification;
        await theraphist.save();
        res.json({
            message:"theraphist personal details added successfully.",
            theraphist:theraphist
        })
        
    } catch (error) {
        console.log(error.message);
        res.json({
            message:error.message
        })
    }
 };
 const theraphistRequestAccept=async(req,res)=>{
    try {
        const theraphistId=req.params.id;
        const theraphistUpdate=await theraphistModel.findByIdAndUpdate(theraphistId,{isAdminApproved:true},{new:true});
        if(!theraphistUpdate){
           return res.json({
                message:"problem in accepting request",
            })
        };
        return res.json({
            message:"Request accepted by admin",
            theraphistUpdate
        });
        
    } catch (error) {
        console.log(error.message);
        res.json({
            message:error.message
        })
    }
 };

 const adminDeleteTheraphist=async(req,res)=>{
    try {
        const theraphistId=req.params.id;
        const deleteTheraphist=await theraphistModel.findByIdAndDelete(theraphistId);
        return res.json({
            message:"rejected",
            deleteTheraphist

        })
        
    } catch (error) {
        console.log(error.message);
        res.json({
            message:error.message
        })
    }
 };
 const getTherapistRequests = async (req, res) => {
  try {
    const therapistId = req.params.id;
    const request = await requestModel.find({
      recipientId: therapistId,
      recipientRole: "theraphist",
    }).populate("parentId");
    res.json({ success: true, request });
  } catch (error) {
    console.log(error.message);
    res.json({ message: error.message });
  }
};

const acceptParentRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const updatedRequest = await requestModel.findByIdAndUpdate(
      requestId,
      { status: "accepted" },
      { new: true }
    );
    if (!updatedRequest) {
      return res.json({ message: "Request not found" });
    }
    res.json({ message: "Request accepted", updatedRequest });
  } catch (error) {
    console.log(error.message);
    res.json({ message: error.message });
  }
};

const rejectParentRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const deletedRequest = await requestModel.findByIdAndDelete(requestId);
    if (!deletedRequest) {
      return res.json({ message: "Cannot delete request" });
    }
    res.json({ message: "Request rejected", deletedRequest });
  } catch (error) {
    console.log(error.message);
    res.json({ message: error.message });
  }
};

const viewRequestById = async (req, res) => {
  try {
    const requestId = req.params.id;
    const viewRequest = await requestModel.findById(requestId).populate("parentId");
    if (!viewRequest) {
      return res.json({ message: "No request found" });
    }
    res.json({ message: "Request found", viewRequest });
  } catch (error) {
    console.log(error.message);
    res.json({ message: error.message });
  }
};

const viewAllApprovedParentsByTherapist = async (req, res) => {
  try {
    const therapistId = req.params.id;
    const acceptedRequests = await requestModel.find({
      recipientId: therapistId,
      recipientRole: "theraphist",
      status: "accepted",
    }).populate("parentId");

    res.json({ message: "Fetched accepted parents", parents: acceptedRequests });
  } catch (error) {
    console.log(error.message);
    res.json({ message: error.message });
  }
};

const viewAllChildsOfApprovedParents = async (req, res) => {
  try {
    const therapistId = req.params.id;
    const approvedRequests = await requestModel.find({
      recipientId: therapistId,
      recipientRole: "theraphist",
      status: "accepted",
    });

    const parentIds = approvedRequests.map((req) => req.parentId);
    const children = await childModel.find({
      parentId: { $in: parentIds },
    }).populate("parentId", "name");

    res.json({ message: "Fetched children of approved parents", children });
  } catch (error) {
    console.log(error.message);
    res.json({ message: error.message });
  }
};
module.exports={uploadProfilePic,uploadCertification, getLinkedEducators,theraphistRegister,getTherapistRequests,acceptParentRequest,rejectParentRequest,viewRequestById,viewAllApprovedParentsByTherapist,viewAllChildsOfApprovedParents,theraphistLogin,theraphistForgotPassword,theraphistResetPassword,getTheraphistById,editTheraphistById,getAllTheraphists,addTheraphistPersonal,theraphistRequestAccept,adminDeleteTheraphist};

