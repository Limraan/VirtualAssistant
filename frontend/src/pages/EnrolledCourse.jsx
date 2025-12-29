import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeftLong } from "react-icons/fa6";
import axios from 'axios';
import { serverUrl } from '../App';
import img from "../assets/empty.jpg"

function EnrolledCourse() {
  const navigate = useNavigate()
  const { userData } = useSelector((state) => state.user);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (!userData?.enrolledCourses || userData.enrolledCourses.length === 0) {
        setLoading(false);
        return;
      }

      try {
        // Check if enrolledCourses are already populated (have full course objects)
        const firstCourse = userData.enrolledCourses[0];
        if (firstCourse && typeof firstCourse === 'object' && firstCourse.title) {
          // Already populated, use directly
          setEnrolledCourses(userData.enrolledCourses);
        } else {
          // Need to fetch course details
          const coursePromises = userData.enrolledCourses.map(async (courseId) => {
            try {
              const courseIdStr = typeof courseId === 'string' ? courseId : courseId._id || courseId;
              const result = await axios.get(
                serverUrl + `/api/course/getcourse/${courseIdStr}`,
                { withCredentials: true }
              );
              return result.data;
            } catch (error) {
              console.error(`Error fetching course ${courseId}:`, error);
              return null;
            }
          });

          const courses = await Promise.all(coursePromises);
          setEnrolledCourses(courses.filter(course => course !== null));
        }
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [userData]);

  return (
    <div className="min-h-screen w-full px-4 py-9 bg-gray-50" style={{ paddingTop: '80px' }}>
      <FaArrowLeftLong  className='absolute top-[3%] md:top-[6%] left-[5%] w-[22px] h-[22px] cursor-pointer' onClick={()=>navigate("/")}/>
      <h1 className="text-3xl text-center font-bold text-gray-800 mb-6  ">
        My Enrolled Courses
      </h1>

      {loading ? (
        <p className="text-gray-500 text-center w-full">Loading your courses...</p>
      ) : enrolledCourses.length === 0 ? (
        <p className="text-gray-500 text-center w-full">You haven't enrolled in any course yet.</p>
      ) : (
        <div className="flex items-center justify-center flex-wrap gap-[30px]">
          {enrolledCourses.map((course) => {
            const courseId = course._id || course;
            const courseTitle = course.title || "Untitled Course";
            const courseThumbnail = (course.thumbnail && course.thumbnail.trim() !== "") ? course.thumbnail : img;
            
            return (
              <div
                key={courseId}
                className="bg-white rounded-2xl shadow-md overflow-hidden border w-full sm:w-[300px]"
              >
                <img
                  src={courseThumbnail}
                  alt={courseTitle}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">{courseTitle}</h2>
                  <p className="text-sm text-gray-600 mb-1">{course.category || "Uncategorized"}</p>
                  <p className="text-sm text-gray-700 mb-3">{course.level || "Not specified"}</p>
                  <button 
                    className='w-full px-[10px] text-center py-[10px] border-2 bg-black border-black text-white rounded-[10px] text-[15px] font-light flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-600 transition' 
                    onClick={()=>navigate(`/viewlecture/${courseId}`)}
                  >
                    Watch Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  )
}

export default EnrolledCourse
