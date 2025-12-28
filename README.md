# VirtualCourse - Online Learning Management System

A full-stack web application for creating, managing, and enrolling in online courses. Built with React, Node.js, Express, and MongoDB.

## 🚀 Features

### For Students
- **Browse Courses**: Explore available courses with filtering and search
- **AI-Powered Search**: Find courses using AI-powered search functionality
- **Course Enrollment**: Enroll in courses with secure payment integration (Razorpay)
- **Watch Lectures**: Access enrolled course lectures with video playback
- **Course Reviews**: Rate and review courses
- **My Courses**: View all enrolled courses in one place
- **Profile Management**: Update profile information and view enrolled courses

### For Educators
- **Course Creation**: Create and manage courses with detailed information
- **Lecture Management**: Add lectures with video uploads
- **Thumbnail Upload**: Upload course thumbnails using Cloudinary
- **Course Publishing**: Publish or unpublish courses
- **Dashboard**: View course statistics and analytics
- **Student Management**: Track enrolled students
- **Profile Page**: View all created courses with statistics

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Redux Toolkit** - State management
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Icons** - Icon library
- **React Toastify** - Notifications
- **Recharts** - Data visualization

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **Cloudinary** - Image/video storage
- **Razorpay** - Payment gateway
- **Nodemailer** - Email service
- **Google Generative AI** - AI features

## 📁 Project Structure

```
VirtualCourse/
├── backend/
│   ├── configs/          # Configuration files (DB, Cloudinary, etc.)
│   ├── controllers/      # Route controllers
│   ├── middlewares/      # Custom middlewares (auth, multer)
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   └── index.js          # Server entry point
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── redux/        # Redux store and slices
│   │   ├── customHooks/  # Custom React hooks
│   │   └── utils/        # Utility functions
│   └── public/           # Static assets
└── README.md
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- Cloudinary account (for image/video uploads)
- Razorpay account (for payments)
- Google API key (for AI features - optional)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
# Server Configuration
PORT=8000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URL=your_mongodb_connection_string

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_SECRET=your_razorpay_secret

# Email Configuration (Optional)
EMAIL=your_email@gmail.com
EMAIL_PASS=your_email_app_password

# Google AI API Key (Optional)
GOOGLE_API_KEY=your_google_api_key
```

4. Start the backend server:
```bash
npm run dev
```

The backend server will run on `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```env
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🔐 Authentication

The application uses JWT-based authentication with HTTP-only cookies for security.

### User Roles
- **Student**: Can enroll in courses and watch lectures
- **Educator**: Can create and manage courses

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/logout` - User logout
- `GET /api/user/currentuser` - Get current user

### Courses
- `GET /api/course/getpublishedcourses` - Get all published courses
- `GET /api/course/getcreatorcourses` - Get creator's courses (auth required)
- `GET /api/course/getcourse/:courseId` - Get course by ID
- `POST /api/course/create` - Create new course (educator only)
- `POST /api/course/editcourse/:courseId` - Edit course (educator only)
- `DELETE /api/course/removecourse/:courseId` - Delete course (educator only)

### Lectures
- `POST /api/course/createlecture/:courseId` - Create lecture (educator only)
- `GET /api/course/getcourselecture/:courseId` - Get course lectures
- `POST /api/course/editlecture/:lectureId` - Edit lecture (educator only)
- `DELETE /api/course/removelecture/:lectureId` - Delete lecture (educator only)

### Payments
- `POST /api/payment/create-order` - Create payment order
- `POST /api/payment/verify-payment` - Verify payment

### Reviews
- `POST /api/review/givereview` - Submit course review
- `GET /api/review/getreviews` - Get course reviews

## 🎨 Key Features Implementation

### Course Enrollment
- Prevents duplicate enrollment
- Secure payment processing via Razorpay
- Automatic enrollment after successful payment
- Updates user data in real-time

### Video Upload
- Cloudinary integration for video storage
- Support for video previews
- Unique filename generation to prevent conflicts

### Course Management
- Rich course editor with thumbnail upload
- Lecture management with video uploads
- Course publishing/unpublishing
- Student enrollment tracking

### Profile Pages
- Student profile with enrolled courses
- Educator profile with created courses and statistics
- Course cards with thumbnails and status indicators

## 🐛 Troubleshooting

### Cloudinary Upload Issues
- Ensure all Cloudinary environment variables are set correctly
- Check system clock synchronization (stale request errors)
- Verify file size limits

### Enrollment Issues
- Clear browser cache and cookies
- Ensure user data is refreshed after enrollment
- Check Razorpay configuration

### Database Connection
- Verify MongoDB connection string
- Ensure database name is correct
- Check network connectivity for MongoDB Atlas

## 📝 Environment Variables

Make sure to set up all required environment variables in both backend and frontend `.env` files. Refer to the setup sections above for the complete list.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👥 Authors

- **Suchithra MK** - [@SuchithraMK](https://github.com/SuchithraMK)
- **Chandrashekhara K M** - [@ChandrashekharaKM](https://github.com/ChandrashekharaKM)

## 🙏 Acknowledgments

- React community for excellent documentation
- MongoDB for database solutions
- Cloudinary for media storage
- Razorpay for payment integration

## 📞 Support

For support, email support@virtualcourse.com or open an issue in the repository.

---

**Note**: Make sure to keep your `.env` files secure and never commit them to version control. The `.gitignore` file is configured to exclude these files.

