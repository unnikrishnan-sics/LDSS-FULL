const requestModel = require('../Models/requestModel');

const sendRequest = async (req, res) => {
   try {
    const { parentId, recipientId, recipientRole, message } = req.body;
    const existingrequest = await requestModel.findOne({
        parentId,
        recipientId,
        recipientRole,
    });
    if(existingrequest){
        return res.json({
            message:"Request already sent"
        })
    }
    const newRequest = new requestModel({
        parentId,
        recipientId,
        recipientRole,
        message
    });
    await newRequest.save();
     return res.json({
        message: "Request sent successfully.",
        request: newRequest
    });

   } catch (error) {
    console.log(error.message);
    res.json({
        message:error.message
    })
   }
};

const fetchAll = async (req, res) => {
    try {
        const requests = await requestModel.find({})
            // .populate({
            //     path: 'parentId',
            //     model: 'parent',
            //     select: 'name email phone'
            // })
            // .populate({
            //     path: 'recipientId',
            //     // Explicitly define model based on recipientRole
            //     model: function() {
            //         return this.recipientRole === 'educator' ? 'educator' : 'theraphist';
            //     },
            //     select: 'name email phone educationalQualification yearsOfExperience'
            // });

        return res.json({
            message: "Requests fetched successfully",
            requests
        });
    } catch (error) {
        console.error("Error fetching requests:", error);
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = { sendRequest, fetchAll };