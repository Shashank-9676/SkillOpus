import mongoose from 'mongoose';

const lessonProgressSchema = new mongoose.Schema({
    lesson_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: Boolean,
        default: false
    },
    completed_at: {
        type: Date
    }
});

const enrollmentSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'completed', 'dropped'],
        default: 'pending'
    },
    enrolled_at: {
        type: Date,
        default: Date.now
    },
    progress: [lessonProgressSchema]
});

enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

export default Enrollment;
