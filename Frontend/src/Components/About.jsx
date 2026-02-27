import {
  GraduationCap,
  Target,
  Users,
  Award,
  BookOpen,
  Lightbulb,
  Heart,
  Building2,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Video,
  BarChart3,
} from "lucide-react";
import { useNavigate } from "react-router";
import Header from "./Header";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const About = () => {
  const navigate = useNavigate();

  const stats = [
    { icon: Users, value: "500+", label: "Active Learners" },
    { icon: BookOpen, value: "80+", label: "Courses" },
    { icon: Building2, value: "15+", label: "Organisations" },
    { icon: Award, value: "98%", label: "Satisfaction Rate" },
  ];

  const values = [
    {
      icon: Target,
      color: "from-blue-500 to-indigo-500",
      title: "Organisation-First",
      description:
        "SkillOpus is built for organisations to manage their own learning ecosystems — from enrolling learners to tracking progress.",
    },
    {
      icon: Lightbulb,
      color: "from-violet-500 to-purple-600",
      title: "Structured Learning",
      description:
        "Courses are broken into focused lessons. Instructors can add video, text, and quizzes so every learner gets a consistent, complete experience.",
    },
    {
      icon: Heart,
      color: "from-pink-500 to-rose-500",
      title: "Learner-Centric",
      description:
        "Progress tracking, status dashboards, and easy enrolment keep learners engaged and give admins real visibility into outcomes.",
    },
    {
      icon: ShieldCheck,
      color: "from-emerald-500 to-teal-500",
      title: "Role-Based Access",
      description:
        "Admins, instructors, and students each have a dedicated portal with the exact permissions they need — nothing more, nothing less.",
    },
  ];

  const features = [
    {
      icon: Building2,
      text: "Multi-organisation support on a single platform",
    },
    {
      icon: GraduationCap,
      text: "Role-based portals for admins, instructors & students",
    },
    { icon: Video, text: "Video lessons with Cloudinary-powered streaming" },
    {
      icon: BarChart3,
      text: "Real-time progress tracking & completion reports",
    },
    {
      icon: BookOpen,
      text: "Course level filtering — Beginner, Intermediate, Advanced",
    },
    {
      icon: TrendingUp,
      text: "Pending enrollment management with one-click approval",
    },
  ];

  const team = [
    {
      initials: "SS",
      name: "Shashank S.",
      role: "Full-Stack Engineer",
      gradient: "from-blue-500 to-indigo-600",
      bio: "Built SkillOpus end-to-end with React, Node.js, Express & MongoDB.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Header />

      {/* ── Hero ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900">
        <div className="pointer-events-none absolute -top-24 -right-32 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 -left-16 w-72 h-72 rounded-full bg-violet-400/20 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-3xl backdrop-blur-md mb-6 mx-auto">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-5 leading-tight">
              About{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-white dark:from-indigo-400 dark:to-violet-300">
                SkillOpus
              </span>
            </h1>
            <p className="text-xl text-blue-100 dark:text-slate-300 max-w-2xl mx-auto">
              A dedicated Learning Management System that gives organisations
              complete control over their training — from content creation to
              learner progress.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 z-10 relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {stats.map((s, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 p-6 text-center"
            >
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <s.icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <p className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">
                {s.value}
              </p>
              <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">
                {s.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── Story ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 p-8 md:p-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Our Story
          </h2>
          <div className="space-y-4 text-gray-600 dark:text-slate-300 text-lg leading-relaxed">
            <p>
              SkillOpus started with a simple observation: most organisations
              either rely on expensive LMS subscriptions or cobble together
              spreadsheets and email chains to train their people. Neither works
              well.
            </p>
            <p>
              We built SkillOpus as a clean, purpose-built platform where
              organisations can create courses, onboard instructors, enrol
              students, and track completion — all in one place. Admins get a
              full control centre; instructors manage their own course content;
              students have a personalised dashboard showing exactly where they
              stand.
            </p>
            <p>
              Every feature — video lessons, role-based access, progress
              tracking, multi-organisation support — was added in direct
              response to real learning workflows, not feature lists.
            </p>
          </div>
        </motion.div>
      </div>

      {/* ── Values ── */}
      <div className="bg-white dark:bg-slate-800/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              What Drives Us
            </h2>
            <p className="text-gray-500 dark:text-slate-400 max-w-xl mx-auto">
              Core principles baked into every part of the platform.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {values.map((v, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="text-center p-6 rounded-2xl border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-md transition-shadow"
              >
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${v.color} rounded-2xl mb-4 shadow-lg`}
                >
                  <v.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {v.title}
                </h3>
                <p className="text-gray-500 dark:text-slate-400 text-sm leading-relaxed">
                  {v.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Features ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="bg-gradient-to-br from-blue-600 to-violet-700 rounded-3xl p-10 text-white"
          >
            <TrendingUp className="w-14 h-14 mb-6 opacity-80" />
            <h3 className="text-3xl font-bold mb-3">Built for Growth</h3>
            <p className="text-blue-100 text-lg leading-relaxed">
              Whether you&apos;re onboarding 10 employees or training 500
              students across multiple divisions, SkillOpus scales without
              complexity.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="space-y-4"
          >
            <motion.h2
              variants={fadeUp}
              className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
            >
              What SkillOpus Offers
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-gray-500 dark:text-slate-400 mb-6"
            >
              Every feature is purpose-built for organisation-managed training.
            </motion.p>
            {features.map((f, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="flex items-start gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-600 transition-colors"
              >
                <div className="w-9 h-9 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <f.icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span className="text-gray-700 dark:text-slate-300 font-medium">
                  {f.text}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Team ── */}
      <div className="bg-white dark:bg-slate-800/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Behind SkillOpus
            </h2>
            <p className="text-gray-500 dark:text-slate-400">
              Crafted with care by a focused team obsessed with great developer
              &amp; learner UX.
            </p>
          </motion.div>
          <div className="flex justify-center">
            {team.map((m, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-8 text-center max-w-xs w-full shadow-sm"
              >
                <div
                  className={`w-20 h-20 bg-gradient-to-br ${m.gradient} rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg`}
                >
                  {m.initials}
                </div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                  {m.name}
                </h4>
                <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-2">
                  {m.role}
                </p>
                <p className="text-gray-500 dark:text-slate-400 text-sm">
                  {m.bio}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-violet-700 py-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-3xl font-bold text-white mb-3">
              Ready to transform your training?
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
              Browse the course library or reach out to set up your organisation
              on SkillOpus.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/courses")}
                className="inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 py-3 px-8 rounded-xl font-bold transition-colors shadow-lg"
              >
                Browse Courses <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="inline-flex items-center gap-2 bg-white/20 border-2 border-white/50 text-white hover:bg-white/30 py-3 px-8 rounded-xl font-bold backdrop-blur-sm transition-colors"
              >
                Contact Us
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;
