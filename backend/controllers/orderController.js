import Course from "../models/courseModel.js";
import razorpay from 'razorpay'
import User from "../models/userModel.js";
import dotenv from "dotenv"
dotenv.config()
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
})

export const createOrder = async (req, res) => {
  try {
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (!course.price || course.price <= 0) {
      return res.status(400).json({ message: "Invalid course price" });
    }

    const options = {
      amount: course.price * 100, // in paisa
      currency: 'INR',
      receipt: courseId.toString(),
    };

    const order = await razorpayInstance.orders.create(options);
    return res.status(200).json(order);
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: `Order creation failed ${err}` });

  }
};



export const verifyPayment = async (req, res) => {
  try {
        const {razorpay_order_id , courseId , userId} = req.body
        if(!razorpay_order_id || !courseId || !userId){
            return res.status(400).json({ message: "Missing required fields" });
        }
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
        if(orderInfo.status === 'paid') {
      // Update user and course enrollment
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      // Convert to string for comparison
      const courseIdStr = courseId.toString()
      const userIdStr = userId.toString()
      
      if (!user.enrolledCourses.some(id => id.toString() === courseIdStr)) {
        user.enrolledCourses.push(courseId);
        await user.save();
      }

      const course = await Course.findById(courseId).populate("lectures");
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      if (!course.enrolledStudents.some(id => id.toString() === userIdStr)) {
        course.enrolledStudents.push(userId);
        await course.save();
      }

      return res.status(200).json({ message: "Payment verified and enrollment successful" });
    } else {
      return res.status(400).json({ message: "Payment verification failed (invalid signature)" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error during payment verification" });
  }
};
