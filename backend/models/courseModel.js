import mongoose from "mongoose"

const courseSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    subTitle:{
        type:String
    },
    description:{
        type:String
    },
    category:{
        type:String,
        required:true
    },
    level:{
        type:String,
        enum: {
            values: ['Beginner','Intermediate','Advanced'],
            message: 'Level must be Beginner, Intermediate, or Advanced'
        },
        // Convert empty strings to undefined
        set: function(value) {
            return value === '' ? undefined : value;
        }
    },
    price:{
        type:Number
    },
    thumbnail:{
        type:String
    },
    enrolledStudents:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    lectures:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Lecture"
    }],
    creator:{
         type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    isPublished:{
     type:Boolean,
     default:false
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
        }],
},{timestamps:true})

// Pre-save hook to convert empty strings to undefined for enum fields
courseSchema.pre('save', function(next) {
    if (this.level === '') {
        this.level = undefined;
    }
    next();
});

// Pre-validate hook as additional safety
courseSchema.pre('validate', function(next) {
    if (this.level === '') {
        this.level = undefined;
    }
    next();
});

const Course = mongoose.model("Course",courseSchema)

export default Course