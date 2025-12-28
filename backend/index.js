import express from "express"
import dotenv from "dotenv"
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import connectDb from "./configs/db.js"
import authRouter from "./routes/authRoute.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import userRouter from "./routes/userRoute.js"
import courseRouter from "./routes/courseRoute.js"
import paymentRouter from "./routes/paymentRoute.js"
import aiRouter from "./routes/aiRoute.js"
import reviewRouter from "./routes/reviewRoute.js"

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load .env file from the backend directory
const result = dotenv.config({ path: join(__dirname, '.env') })

if (result.error) {
    console.error('❌ Error loading .env file:', result.error)
} else {
    console.log('✅ .env file loaded successfully')
}

// Debug: Check if Cloudinary variables are loaded
console.log('\n🔍 Environment Variables Check:')
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? `✅ Set (${process.env.CLOUDINARY_CLOUD_NAME.substring(0, 5)}...)` : '❌ Missing')
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? `✅ Set (${process.env.CLOUDINARY_API_KEY.substring(0, 5)}...)` : '❌ Missing')
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '✅ Set (hidden)' : '❌ Missing')
console.log('')

let port = process.env.PORT || 8000
let app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/course", courseRouter)
app.use("/api/payment", paymentRouter)
app.use("/api/ai", aiRouter)
app.use("/api/review", reviewRouter)


app.get("/" , (req,res)=>{
    res.send("Hello From Server")
})

app.listen(port , ()=>{
    console.log(`Server Started on port ${port}`)
    connectDb()
})

