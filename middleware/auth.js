//auth,isStudent,isStudent
const jwt=require('jsonwebtoken');
require("dotenv").config();
exports.auth=(req,res,next)=>{
try {
    //extract JWT token
    //other way to fetch JWT token
    console.log("cookies",req.cookies.token);
    console.log("Body",req.body.token); 
    const token=req.body.token ||req.cookies.token || req.header('Authorization').replace("Bearer ","");
    if(!token || token===undefined) {
        return res.status(401).json({
        success: false,
        Message:"Token is missing",
      }); 
    }
    try {
       const payload=jwt.verify(token,process.env.JWT_SECRET); 
       console.log(payload);
       req.user=payload;

    } catch (error) {
        return res.status(401).json({
            success: false,
            message:"token is invalid",
        })
    }
      next();
} catch (error) {
    return res.status(401).json({
        success: false,
        message:"Something went wrong while verifying token",
    }) 
}
}
exports.isStudent=(res,req,next) =>{
     try {
        if(req.user.role !=="Student"){
            return res.status(401).json({
                success: false,
                message:"This is protected route for students", 
            });
        }
        next();
     } catch (error) {
        return res.status(500).json({
 success: false,
 message:"User role is not matching",
        });
     }

}
exports.isAdmin=(res,req,next) =>{
try {
    if(req.user.role !=="Admin"){
        return res.status(401).json({
            success: false,
            message:"This is protected route for Admin", 
        });
    }
    next(); 
} catch (error) {
    return res.status(500).json({
        success: false,
        message:"User role is not matching",
    }); 
}

}