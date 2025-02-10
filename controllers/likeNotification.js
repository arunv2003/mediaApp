const mongoose=require('mongoose')
const Notification=require('../models/likeNotification')


let notification=async(req,res)=>{
    let Id=req.user
    let data= await Notification.find({friendId:Id})
    res.json(data)
}



const updateNotification = async (req, res) => {
    try {
        let notificationId = req.params._id; 
        let read  = req.body; 
    
        // console.log("User ID:", req.user);
        // console.log("Read Status:", read);
        // console.log("Notification ID:", notificationId);

        if (!notificationId) {
            return res.status(400).json({ message: "Notification ID is required" });
        }

       
        // if (read===false) {
        //     return res.status(400).json({ message: "Read status must be a boolean (true/false)" });
        // }

        let data = await Notification.findByIdAndUpdate(
            notificationId, 
            { read:true}, 
        );

        if (!data) {
            return res.status(404).json({ message: "Notification not found" });
        }

        // console.log("Updated Notification:", data);
        res.status(200).json(data);

    } catch (error) {
        // console.error("Error updating notification:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



module.exports={notification,updateNotification}


