const mongoose=require("mongoose");
const childSchema=mongoose.Schema({
    name:{
        type:String,
        require:true,
    },
    schoolName:{
        type:String,
        require:true,
    },
    dateOfBirth:{
        type:Date,
        require:true,
    },
    description:{
        type:String,
        require:true,
    },
    gender:{
        type:String,
        require:true,
    },
    parentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"parent",
        require:true,
    }
},{timeStamps:true});

module.exports=mongoose.model("child",childSchema);