const encrypt = require("../MiddleWares/encrypt");
const user = require("../Schemas/userSchema");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const Job = require("../Schemas/jobsSchema");
const User = require("../Schemas/userSchema");
exports.userLogin=async(request,response)=>{
    const {userEmail,userPassword} = request.body;
    try {
        //finding is Existing User
         const existingUser = await user.findOne({ userEmail:userEmail})

        if(existingUser){
           const isValidUser = await bcrypt.compare(userPassword,existingUser.userPassword)
          if(isValidUser){
            const token = jwt.sign(existingUser.userEmail,process.env.JWT_SECRET_KEY)
            response.status(200).json({message:'Logged in Successfully',token:token})
          } else{
            response.status(401).json({message:'Invalid Credentials'})
          }   
        }else{
            // -------------------------------------------------------------Need a nav link to register 
            response.status(401).json({message:"Please register"})
        }
        
    } catch (error) {
        console.log(error);
        
        response.status(500).json({message:'server error',error})
    }
}


exports.userRegister = [encrypt,async(request,response)=>{
    const {userEmail,userPassword} = request.body;
    try {
        if(userEmail && userPassword){  
            console.log(userPassword);
            let isExistingUser = await user.findOne({userEmail})
         
            if(!isExistingUser){
              const newUser = new user({
                userEmail:userEmail,
                userPassword:userPassword
              })
              await newUser.save();
              response.status(200).json({message:'Registerd Successfully',data:newUser})
            }else{
                response.status(401).json({message:'Existing User please Login'})
            }
        }else{
            response.status(400).json({message:'Incompleted form data'})
        }
        
        
    } catch (error) {
        response.status(500).json({message:'Internal Error',error:error})
    }
   
}]

exports.getAllUserJobs = async (request, response) => {
    try {
      const page = parseInt(request.params.page) || 1; 
      const limit = parseInt(request.params.limit) || 15; 
      const skip = (page - 1) * limit;
      const jobs = await Job.find()
        .skip(skip)
        .limit(limit);
      const totalJobs = await Job.countDocuments();
      const totalPages = Math.ceil(totalJobs / limit);
      response.json({
        success: true,
        page,
        limit,
        totalPages,
        totalJobs,
        jobs
      });
    } catch (error) {
      console.error(`Error fetching jobs: ${error.message}`);
      response.status(500).json({ success: false, message: "Server Error" });
    }
  };

  exports.getAllUserJobsCategory = async (request, response) => {
    try {
        // Extract pagination parameters
        const page = parseInt(request.params.page) || 1;
        const limit = parseInt(request.params.limit) || 15;
        const skip = (page - 1) * limit;

        // Extract category from request parameters
        const category = request.params.category; // Adjusted to extract category correctly

        if (category) {
            // Fetch jobs based on the category with pagination
            const jobs = await Job.find({ category: category }).skip(skip).limit(limit);

            // Calculate total jobs and total pages for the specific category
            const totalJobs = await Job.countDocuments({ category: category });
            const totalPages = Math.ceil(totalJobs / limit);

            // Send response
            response.json({
                success: true,
                page,
                limit,
                totalPages,
                totalJobs,
                jobs
            });
        } else {
            // If no category provided, return an error
            response.status(400).json({ success: false, message: "Category is required." });
        }
    } catch (error) {
        console.error(`Error fetching jobs by category: ${error.message}`);
        response.status(500).json({ success: false, message: "Server Error" });
    }
};
exports.updateNotificationStatus = async (request, response) => {
    const userEmail = request.payload; // Assuming the user email is in the payload
    const { statusValue } = request.body; // Destructure statusValue directly from the body
    console.log(userEmail, statusValue);
    
    try {
        const user = await User.findOne({ userEmail: userEmail });
        
        if (user) {
            if (typeof statusValue !== 'boolean') {
                return response.status(400).json({ message: 'Invalid status value, it must be a boolean.' });
            }

            // Update notificationStatus
            await user.updateOne({ notificationStatus: statusValue });
            response.status(200).json({ message: 'Updated notification status' });
        } else {
            response.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        response.status(500).json({ message: `Server error. Please try again. Error: ${error.message}` });
    }
};

exports.updateCategory = async (request, response) => {
  console.log("testttttt");
  
  const userEmail = "jithinbinoyp@gmail.com"
  const { category } = request.body;
  try {
      if (!userEmail || !category) {
          return response.status(400).json({ message: "User email and category are required" });
      }

      const updatedUser = await User.findOneAndUpdate(
          { userEmail: userEmail },
          { $set: { category: category } },  // Corrected here: $set should be followed by an object
          { new: true }
      );

      if (!updatedUser) {
          return response.status(404).json({ message: "User not found" });
      }

      response.status(200).json({
          message: "Category updated successfully",
          updatedUser
      });
  } catch (error) {
      console.error("Error updating category:", error);
      response.status(500).json({ message: "Internal server error", error });
  }
};

