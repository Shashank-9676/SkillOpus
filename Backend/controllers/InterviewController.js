import InterviewSession from '../models/InterviewSession.js';

// POST /interview/start — create a new session, return interviewId
export const startInterview = async (req, res) => {
    try {
        const { subject, difficulty } = req.body;
        const userId = req.user.id;

        if (!subject || !difficulty) {
            return res.status(400).json({ message: 'Subject and difficulty are required' });
        }

        const session = await InterviewSession.create({
            userId,
            subject,
            difficulty,
            questions: [],
            answers: [],
            status: 'active'
        });

        return res.status(201).json({
            interviewId: session._id.toString(),
            subject,
            difficulty
        });
    } catch (error) {
        console.error('[startInterview]', error);
        return res.status(500).json({ message: 'Failed to create interview session' });
    }
};

// POST /interview/:id/complete — save Q&A + feedback
export const completeInterview = async (req, res) => {
    try {
        const { id } = req.params;
        const { questions, answers, score, feedback } = req.body;
        const userId = req.user.id;

        const session = await InterviewSession.findOne({ _id: id, userId });
        if (!session) {
            return res.status(404).json({ message: 'Interview session not found' });
        }

        session.questions = questions || [];
        session.answers = answers || [];
        session.score = score ?? null;
        session.feedback = {
            strengths: feedback?.feedback || '',
            improvements: feedback?.areas_of_improvement || ''
        };
        session.status = 'completed';

        await session.save();
        return res.json({ message: 'Interview saved successfully', session });
    } catch (error) {
        console.error('[completeInterview]', error);
        return res.status(500).json({ message: 'Failed to save interview results' });
    }
};

// GET /interview/history — all sessions for current user
export const getInterviewHistory = async (req, res) => {
    try {
        const sessions = await InterviewSession.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .select('subject difficulty score status createdAt feedback');

        return res.json({ sessions });
    } catch (error) {
        console.error('[getInterviewHistory]', error);
        return res.status(500).json({ message: 'Failed to fetch history' });
    }
};

// GET /interview/:id — single session detail
export const getInterviewSession = async (req, res) => {
    try {
        const session = await InterviewSession.findOne({
            _id: req.params.id,
            userId: req.user.id
        });
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }
        return res.json({ session });
    } catch (error) {
        console.error('[getInterviewSession]', error);
        return res.status(500).json({ message: 'Failed to fetch session' });
    }
};
