import mongoose from 'mongoose';

const interviewSessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    difficulty: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        required: true
    },
    questions: [{ type: String }],
    answers: [{ type: String }],
    score: {
        type: Number,
        min: 1,
        max: 5,
        default: null
    },
    feedback: {
        strengths: { type: String, default: '' },
        improvements: { type: String, default: '' }
    },
    status: {
        type: String,
        enum: ['active', 'completed'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const InterviewSession = mongoose.model('InterviewSession', interviewSessionSchema);
export default InterviewSession;
