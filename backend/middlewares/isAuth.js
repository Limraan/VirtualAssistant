
import jwt from "jsonwebtoken"
const isAuth=async (req,res,next)=>{
    try {
 
      let {token} = req.cookies
     
      if(!token){
        return res.status(401).json({message:"Authentication required"})
      }
      try {
        let verifyToken = jwt.verify(token,process.env.JWT_SECRET)
        req.userId = verifyToken.userId
        next()
      } catch (jwtError) {
        return res.status(401).json({message:"Invalid or expired token"})
      }
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:`Authentication error ${error}`})
    }
}
export default isAuth