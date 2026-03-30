import { useState } from "react";
import {
  GraduationCap, Target, Users, Award, BookOpen, Lightbulb,
  Heart, Building2, TrendingUp, ArrowRight, ShieldCheck, Video,
  BarChart3, Send, MessageSquare, ChevronDown, HelpCircle
} from "lucide-react";
import { useNavigate } from "react-router";
import Header from "./Header";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const TOPICS = [
  { value: "organization", label: "Register an Organisation", icon: Building2, desc: "Set up a new organisation on SkillOpus" },
  { value: "courses",      label: "Course / Enrolment Help",  icon: BookOpen,   desc: "Questions about courses or enrolments" },
  { value: "technical",   label: "Technical Support",        icon: HelpCircle, desc: "Bugs, access issues, or platform errors" },
  { value: "feedback",    label: "Feedback & Suggestions",   icon: MessageSquare, desc: "Ideas to make SkillOpus better" },
];

const About = () => {
  const navigate = useNavigate();

  /* ── Contact form state ── */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "organization", message: "" });
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(import.meta.env.VITE_FORMSPREE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        toast.success("Message sent! We'll get back to you soon.");
        setFormData({ name: "", email: "", subject: "organization", message: "" });
      } else {
        toast.error("Failed to send. Please try again.");
      }
    } catch {
      toast.error("Network error — please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Static data ── */
  const stats = [
    { icon: Users,     value: "500+", label: "Active Learners" },
    { icon: BookOpen,  value: "80+",  label: "Courses" },
    { icon: Building2, value: "15+",  label: "Organisations" },
    { icon: Award,     value: "98%",  label: "Satisfaction Rate" },
  ];

  const values = [
    { icon: Target,     color: "from-blue-500 to-indigo-500",    title: "Organisation-First",  description: "SkillOpus is built for organisations to manage their own learning ecosystems — from enrolling learners to tracking progress." },
    { icon: Lightbulb,  color: "from-violet-500 to-purple-600",  title: "Structured Learning", description: "Courses are broken into focused lessons. Instructors can add video, text, and quizzes so every learner gets a consistent, complete experience." },
    { icon: Heart,      color: "from-pink-500 to-rose-500",      title: "Learner-Centric",     description: "Progress tracking, status dashboards, and easy enrolment keep learners engaged and give admins real visibility into outcomes." },
    { icon: ShieldCheck,color: "from-emerald-500 to-teal-500",   title: "Role-Based Access",   description: "Admins, instructors, and students each have a dedicated portal with the exact permissions they need — nothing more, nothing less." },
  ];

  const features = [
    { icon: Building2,    text: "Multi-organisation support on a single platform" },
    { icon: GraduationCap,text: "Role-based portals for admins, instructors & students" },
    { icon: Video,        text: "Video lessons with Cloudinary-powered streaming" },
    { icon: BarChart3,    text: "Real-time progress tracking & completion reports" },
    { icon: BookOpen,     text: "Course level filtering — Beginner, Intermediate, Advanced" },
    { icon: TrendingUp,   text: "Pending enrollment management with one-click approval" },
  ];

  const team = [
    { initials: "SS", name: "Shashank P.", role: "Full-Stack Developer", gradient: "from-blue-500 to-indigo-600", bio: "Built SkillOpus end-to-end with React, Node.js, Express & MongoDB." },
  ];

  const faqs = [
    {
      q: "How do I register a new organisation on SkillOpus?",
      a: "Simply reach out via the contact form above. Our team will get your organisation set up and walk you through the onboarding process so you can start creating courses right away.",
    },
    {
      q: "How are instructors assigned to courses?",
      a: "Once an instructor is registered under your organisation, they can be linked to any course you create. From that point, they manage their own lessons, videos, and learner interactions independently.",
    },
    {
      q: "How does student enrolment work?",
      a: "Students can browse all available courses and request to join. Enrolment requests are reviewed by the organisation, and once approved, the student gains full access to the course content and can track their progress.",
    },
    {
      q: "Can one organisation manage multiple courses at once?",
      a: "Yes — SkillOpus is built for scale. A single organisation can run as many courses as needed, each with its own instructors, lessons, and student rosters.",
    },
    {
      q: "What types of content can be added to a course?",
      a: "Courses are structured into lessons. Each lesson can include video content, written descriptions, and supporting material — giving learners a complete and consistent learning experience.",
    },
    {
      q: "Is there a free plan available?",
      a: "SkillOpus is currently in active development. Contact us to discuss early access and pricing options that fit your organisation's size.",
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
              <p className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">{s.value}</p>
              <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">{s.label}</p>
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
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Story</h2>
          <div className="space-y-4 text-gray-600 dark:text-slate-300 text-lg leading-relaxed">
            <p>
              SkillOpus started with a simple observation: most organisations
              either rely on expensive LMS subscriptions or cobble together
              spreadsheets and email chains to train their people. Neither works well.
            </p>
            <p>
              We built SkillOpus as a clean, purpose-built platform where
              organisations can create courses, onboard instructors, enrol
              students, and track completion — all in one place. Admins get a
              full control centre; instructors manage their own course content;
              students have a personalised dashboard showing exactly where they stand.
            </p>
            <p>
              Every feature — video lessons, role-based access, progress tracking,
              multi-organisation support — was added in direct response to real
              learning workflows, not feature lists.
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
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">What Drives Us</h2>
            <p className="text-gray-500 dark:text-slate-400 max-w-xl mx-auto">Core principles baked into every part of the platform.</p>
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
                <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${v.color} rounded-2xl mb-4 shadow-lg`}>
                  <v.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{v.title}</h3>
                <p className="text-gray-500 dark:text-slate-400 text-sm leading-relaxed">{v.description}</p>
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
              students across multiple divisions, SkillOpus scales without complexity.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="space-y-4"
          >
            <motion.h2 variants={fadeUp} className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              What SkillOpus Offers
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 dark:text-slate-400 mb-6">
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
                <span className="text-gray-700 dark:text-slate-300 font-medium">{f.text}</span>
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
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Behind SkillOpus</h2>
            <p className="text-gray-500 dark:text-slate-400">
              Crafted with care by a focused team obsessed with great developer &amp; learner UX.
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
                <div className={`w-20 h-20 bg-gradient-to-br ${m.gradient} rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg`}>
                  {m.initials}
                </div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">{m.name}</h4>
                <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-2">{m.role}</p>
                <p className="text-gray-500 dark:text-slate-400 text-sm">{m.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Contact ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center mb-10"
        >
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2">
            Get in touch
          </span>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Contact Us</h2>
          <p className="text-gray-500 dark:text-slate-400 max-w-md mx-auto">
            Have a question or want to set up your organisation? We&apos;re here to help.
          </p>
        </motion.div>

        {/* ── Centered form ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 md:p-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Send a Message</h3>
            <p className="text-gray-500 dark:text-slate-400 text-sm mb-6">
              Fill in the form and our team will respond within one business day.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Ravi Kumar"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="ravi@company.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
                  />
                </div>
              </div>

              {/* Topic selector */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">What can we help with?</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {TOPICS.map((t) => {
                    const selected = formData.subject === t.value;
                    return (
                      <label
                        key={t.value}
                        className={`flex items-start gap-2.5 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                          selected
                            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10"
                            : "border-gray-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500"
                        }`}
                      >
                        <input type="radio" name="subject" value={t.value} className="hidden" onChange={handleChange} />
                        <t.icon className={`w-4 h-4 mt-0.5 shrink-0 ${selected ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400"}`} />
                        <div>
                          <p className={`text-xs font-semibold ${selected ? "text-indigo-700 dark:text-indigo-300" : "text-gray-700 dark:text-slate-300"}`}>{t.label}</p>
                          <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{t.desc}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Describe your question or request in detail…"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none text-sm"
                />
              </div>

              {/* Actions row */}
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white text-sm transition-all ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 shadow-md shadow-indigo-500/25 active:scale-[0.98]"
                  }`}
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/courses")}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all"
                >
                  Browse Courses <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>

      {/* ── FAQs ── */}
      <div className="bg-white dark:bg-slate-800/50 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-10"
          >
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2">
              Got questions?
            </span>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Frequently Asked Questions</h2>
            <p className="text-gray-500 dark:text-slate-400">
              Everything you need to know about SkillOpus.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="space-y-3"
          >
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className={`rounded-2xl border transition-all ${
                    isOpen
                      ? "border-indigo-200 dark:border-indigo-700 bg-white dark:bg-slate-800 shadow-sm"
                      : "border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800"
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left"
                  >
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 text-indigo-500 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-5 text-sm text-gray-500 dark:text-slate-400 leading-relaxed">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;
