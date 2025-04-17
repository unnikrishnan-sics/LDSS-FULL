const mongoose=require("mongoose");
const adminSchema=mongoose.Schema(
    {
        userId:{
            type:String,
            require:true,
            unique:true
        },
        password:{
            type:String,
            require:true,
        }
    }
)

module.exports=mongoose.model("admin",adminSchema)