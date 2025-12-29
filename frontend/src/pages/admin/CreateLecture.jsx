import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaArrowLeft, FaEdit, FaPlayCircle, FaVideo } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { serverUrl } from '../../App';
import { ClipLoader } from 'react-spinners';
import { useDispatch, useSelector } from 'react-redux';
import { setLectureData } from '../../redux/lectureSlice';

function CreateLecture() {
    const navigate = useNavigate()
    const {courseId} = useParams()
    const [lectureTitle , setLectureTitle] = useState("")
    const [loading,setLoading] = useState(false)
    const dispatch = useDispatch()
    const {lectureData} = useSelector(state=>state.lecture)
    

    const createLectureHandler = async () => {
      if (!lectureTitle.trim()) {
        toast.error("Please enter a lecture title")
        return
      }
      setLoading(true)
      try {
        const result = await axios.post(serverUrl + `/api/course/createlecture/${courseId}` ,{lectureTitle} , {withCredentials:true})
        console.log(result.data)
        toast.success("Lecture Created")
        setLectureTitle("")
        // Refresh the lecture list
        await refreshLectures()
        setLoading(false)
      } catch (error) {
        console.log(error)
        toast.error(error.response?.data?.message || "Failed to create lecture")
        setLoading(false)
      }
    }

    useEffect(()=>{
      const getLecture = async () => {
        try {
          const result = await axios.get(serverUrl + `/api/course/getcourselecture/${courseId}`,{withCredentials:true})
        console.log(result.data)
        dispatch(setLectureData(result.data.lectures))
        

          
        } catch (error) {
           console.log(error)
        toast.error(error.response?.data?.message || "Failed to load lectures")
        
        }
        
      }
      getLecture()
    },[])
    
    // Refresh lecture list after creating a new lecture
    const refreshLectures = async () => {
      try {
        const result = await axios.get(serverUrl + `/api/course/getcourselecture/${courseId}`,{withCredentials:true})
        dispatch(setLectureData(result.data.lectures))
      } catch (error) {
        console.log(error)
      }
    }

   
  
  return (
     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-xl w-full max-w-2xl p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-1">Let’s Add a Lecture</h1>
          <p className="text-sm text-gray-500">Enter the title and add your video lectures to enhance your course content.</p>
        </div>

        {/* Input */}
        <input
          type="text"
          placeholder="e.g. Introduction to Mern Stack"
          className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
          onChange={(e)=>setLectureTitle(e.target.value)}
          value={lectureTitle}
        />

        {/* Buttons */}
        <div className="flex gap-4 mb-6">
          <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-sm font-medium" onClick={()=>navigate(`/addcourses/${courseId}`)
          }>
            <FaArrowLeft /> Back to Course
          </button>
          <button className="px-5 py-2 rounded-md bg-[black] text-white hover:bg-gray-600 transition-all text-sm font-medium shadow" disabled={loading} onClick={createLectureHandler}>
           {loading?<ClipLoader size={30} color='white'/>: "+ Create Lecture"}
          </button>
        </div>

        {/* Lecture List */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Lectures ({lectureData.length})</h2>
          {lectureData.length === 0 ? (
            <p className="text-gray-500 text-sm">No lectures created yet. Create your first lecture above!</p>
          ) : (
            <div className="space-y-4">
              {lectureData.map((lecture, index) => (
                <div key={lecture._id || index} className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row">
                    {/* Video Preview Section */}
                    <div className="md:w-48 w-full h-32 md:h-auto bg-black relative flex-shrink-0">
                      {lecture.videoUrl ? (
                        <video
                          src={lecture.videoUrl}
                          className="w-full h-full object-cover"
                          controls={false}
                          muted
                          onMouseEnter={(e) => e.target.play()}
                          onMouseLeave={(e) => {
                            e.target.pause();
                            e.target.currentTime = 0;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-white">
                          <FaVideo className="text-3xl mb-2 opacity-50" />
                          <span className="text-xs opacity-75">No video uploaded</span>
                        </div>
                      )}
                      {lecture.videoUrl && (
                        <div className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1">
                          <FaPlayCircle className="text-white text-sm" />
                        </div>
                      )}
                    </div>
                    
                    {/* Lecture Info Section */}
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-semibold text-gray-500 bg-gray-200 px-2 py-1 rounded">
                            Lecture {index + 1}
                          </span>
                          {lecture.isPreviewFree && (
                            <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">
                              Free Preview
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-semibold text-gray-800 mb-1">
                          {lecture.lectureTitle}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {lecture.videoUrl ? "Video uploaded" : "No video uploaded yet"}
                        </p>
                      </div>
                      
                      {/* Action Button */}
                      <div className="mt-3 flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/editlecture/${courseId}/${lecture._id}`)}
                          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-700 transition-all text-sm font-medium"
                        >
                          <FaEdit className="text-xs" />
                          {lecture.videoUrl ? "Edit Lecture" : "Add Video"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div> 
      </div>
    </div>
    
  )
}

export default CreateLecture
