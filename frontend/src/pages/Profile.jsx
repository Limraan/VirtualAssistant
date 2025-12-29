import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { FaBook } from "react-icons/fa6";
import axios from "axios";
import { serverUrl } from "../App";
import { setCreatorCourseData } from "../redux/courseSlice";
import img1 from "../assets/empty.jpg";

function Profile() {
  const { userData } = useSelector((state) => state.user);
  const { creatorCourseData } = useSelector((state) => state.course);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Debug logging
  useEffect(() => {
    console.log("Profile component mounted");
    console.log("userData:", userData);
    console.log("creatorCourseData:", creatorCourseData);
  }, []);

  useEffect(() => {
    // Fetch creator courses if user is an educator
    if (userData?.role === "educator") {
      const getCreatorCourses = async () => {
        try {
          const result = await axios.get(
            serverUrl + "/api/course/getcreatorcourses",
            { withCredentials: true }
          );
          dispatch(setCreatorCourseData(result.data));
        } catch (error) {
          console.log("Error fetching creator courses:", error);
        }
      };
      getCreatorCourses();
    }
  }, [userData, dispatch]);

  // Show loading state instead of returning null
  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center" style={{ paddingTop: '80px' }}>
        <div className="text-center">
          <p className="text-gray-600 text-xl">Loading profile...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait while we load your profile data.</p>
        </div>
      </div>
    );
  }

  const isEducator = userData?.role === "educator";

  console.log("Rendering Profile page, userData:", userData);
  console.log("isEducator:", isEducator);
  console.log("creatorCourseData:", creatorCourseData);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10" style={{ minHeight: '100vh', paddingTop: '80px', backgroundColor: '#f3f4f6' }}>
      <div className="max-w-6xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white shadow-lg rounded-2xl p-8 mb-6 relative" style={{ backgroundColor: 'white', minHeight: '200px' }}>
          <FaArrowLeftLong
            className="absolute top-[8%] left-[5%] w-[22px] h-[22px] cursor-pointer"
            onClick={() => navigate("/")}
          />

          <div className="flex flex-col items-center text-center">
            {userData.photoUrl && userData.photoUrl.trim() !== "" ? (
              <img
                src={userData.photoUrl}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-black"
              />
            ) : (
              <div className="w-24 h-24 rounded-full text-white flex items-center justify-center text-[30px] border-2 bg-black border-white">
                {userData.name?.slice(0, 1).toUpperCase()}
              </div>
            )}

            <h2 className="text-2xl font-bold mt-4 text-gray-800">
              {userData.name}
            </h2>
            <p className="text-sm text-gray-500">{userData.role}</p>
          </div>

          <div className="mt-6 space-y-4">
            <div className="text-sm">
              <span className="font-semibold text-gray-700">Email: </span>
              <span>{userData.email}</span>
            </div>

            <div className="text-sm">
              <span className="font-semibold text-gray-700">Bio: </span>
              <span>{userData.description || "No bio available"}</span>
            </div>

            <div className="text-sm">
              <span className="font-semibold text-gray-700">
                Enrolled Courses:{" "}
              </span>
              <span>{userData.enrolledCourses?.length || 0}</span>
            </div>

            {isEducator && (
              <div className="text-sm">
                <span className="font-semibold text-gray-700">
                  Created Courses:{" "}
                </span>
                <span>{creatorCourseData?.length || 0}</span>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-center gap-4">
            <button
              className="px-5 py-2 rounded bg-black text-white active:bg-[#4b4b4b] hover:bg-gray-700 transition"
              onClick={() => navigate("/editprofile")}
            >
              Edit Profile
            </button>
            {isEducator && (
              <button
                className="px-5 py-2 rounded bg-gray-800 text-white active:bg-gray-600 hover:bg-gray-700 transition"
                onClick={() => navigate("/courses")}
              >
                Manage Courses
              </button>
            )}
          </div>
        </div>

        {/* Created Courses Section (for Educators) */}
        {isEducator && (
          <div className="bg-white shadow-lg rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <FaBook className="text-2xl text-gray-700" />
                <h2 className="text-2xl font-bold text-gray-800">
                  My Created Courses
                </h2>
              </div>
              <button
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-700 transition text-sm"
                onClick={() => navigate("/createcourses")}
              >
                + Create New Course
              </button>
            </div>

            {!creatorCourseData || creatorCourseData.length === 0 ? (
              <div className="text-center py-12">
                <FaBook className="text-5xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">You haven't created any courses yet.</p>
                <button
                  className="px-5 py-2 bg-black text-white rounded-md hover:bg-gray-700 transition"
                  onClick={() => navigate("/createcourses")}
                >
                  Create Your First Course
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {creatorCourseData.map((course) => (
                  <div
                    key={course._id}
                    className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(`/addcourses/${course._id}`)}
                  >
                    {/* Course Thumbnail */}
                    <div className="w-full h-40 bg-gray-200 relative">
                      {course.thumbnail && course.thumbnail.trim() !== "" ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title || "Course thumbnail"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={img1}
                          alt="No thumbnail"
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute top-2 right-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            course.isPublished
                              ? "bg-green-500 text-white"
                              : "bg-gray-500 text-white"
                          }`}
                        >
                          {course.isPublished ? "Published" : "Draft"}
                        </span>
                      </div>
                    </div>

                    {/* Course Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                        {course.title}
                      </h3>
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                        <span>{course.category || "Uncategorized"}</span>
                        <span className="font-semibold">
                          {course.price ? `₹${course.price}` : "Free"}
                        </span>
                      </div>

                      {/* Course Stats */}
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                        <span>
                          {course.lectures?.length || 0} Lecture
                          {course.lectures?.length !== 1 ? "s" : ""}
                        </span>
                        {course.enrolledStudents && (
                          <span>
                            {course.enrolledStudents.length} Student
                            {course.enrolledStudents.length !== 1 ? "s" : ""}
                          </span>
                        )}
                      </div>

                      {/* Edit Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/addcourses/${course._id}`);
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-700 transition text-sm"
                      >
                        <FaEdit className="text-xs" />
                        Edit Course
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
