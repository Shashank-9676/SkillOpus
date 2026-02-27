import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Building2,
  HelpCircle,
  BookOpen,
  MessageSquare,
  Clock,
} from "lucide-react";
import { toast } from "react-toastify";
import Header from "./Header";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const TOPICS = [
  {
    value: "organization",
    label: "Register an Organisation",
    icon: Building2,
    desc: "Set up a new organisation on SkillOpus",
  },
  {
    value: "courses",
    label: "Course / Enrolment Help",
    icon: BookOpen,
    desc: "Questions about courses or student enrolments",
  },
  {
    value: "technical",
    label: "Technical Support",
    icon: HelpCircle,
    desc: "Bugs, access issues, or platform errors",
  },
  {
    value: "feedback",
    label: "Feedback & Suggestions",
    icon: MessageSquare,
    desc: "Ideas to make SkillOpus better",
  },
];

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "organization",
    message: "",
  });

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
        setFormData({
          name: "",
          email: "",
          subject: "organization",
          message: "",
        });
      } else {
        toast.error("Failed to send. Please try again.");
      }
    } catch {
      toast.error("Network error — please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      color: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
      label: "Email Us",
      value: "support@skillopus.com",
    },
    {
      icon: Phone,
      color:
        "bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400",
      label: "Call Us",
      value: "+91 98765 43210",
    },
    {
      icon: MapPin,
      color:
        "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      label: "Location",
      value: "Bengaluru, Karnataka, India",
    },
    {
      icon: Clock,
      color:
        "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400",
      label: "Support Hours",
      value: "Mon–Fri, 9 AM – 6 PM IST",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Header />

      {/* ── Hero ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900">
        <div className="pointer-events-none absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-64 h-64 rounded-full bg-violet-400/20 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-indigo-200 dark:text-indigo-400 mb-3">
              Get in touch
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-blue-100 dark:text-slate-300 max-w-xl mx-auto">
              Have a question about SkillOpus, want to register your
              organisation, or need support? We're here.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Left — Info Panel ── */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="lg:col-span-1 space-y-4"
          >
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 p-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Reach Us Directly
              </h3>
              <div className="space-y-5">
                {contactInfo.map((c, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${c.color.split(" ").slice(0, 2).join(" ")}`}>
                      <c.icon className={`w-5 h-5 ${c.color.split(" ").slice(2).join(" ")}`} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500">{c.label}</p>
                      <p className="text-gray-800 dark:text-slate-200 font-medium mt-0.5">{c.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ nudge */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white">
              <HelpCircle className="w-8 h-8 mb-3 opacity-80" />
              <h4 className="font-bold text-lg mb-1">Common Questions</h4>
              <p className="text-indigo-100 text-sm mb-4">
                Want to know how to set up an organisation, enrol students, or create courses? We cover it all.
              </p>
              <ul className="space-y-2 text-sm text-indigo-100">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-300 shrink-0" />
                  How do I register a new organisation?
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-300 shrink-0" />
                  How do instructors get assigned to courses?
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-300 shrink-0" />
                  How does student enrolment approval work?
                </li>
              </ul>
            </div>
          </motion.div>

          {/* ── Right — Form ── */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="lg:col-span-2"
          >
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 p-8 md:p-10">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Send a Message
              </h3>
              <p className="text-gray-500 dark:text-slate-400 mb-8 text-sm">
                Fill in the form below and our team will respond within one
                business day.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name + Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Ravi Kumar"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="ravi@company.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Topic selector */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3">
                    What can we help with?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {TOPICS.map((t) => {
                      const selected = formData.subject === t.value;
                      return (
                        <label
                          key={t.value}
                          className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            selected
                              ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10"
                              : "border-gray-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500"
                          }`}
                        >
                          <input
                            type="radio"
                            name="subject"
                            value={t.value}
                            className="hidden"
                            onChange={handleChange}
                          />
                          <t.icon
                            className={`w-5 h-5 mt-0.5 shrink-0 ${selected ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400"}`}
                          />
                          <div>
                            <p
                              className={`text-sm font-semibold ${selected ? "text-indigo-700 dark:text-indigo-300" : "text-gray-700 dark:text-slate-300"}`}
                            >
                              {t.label}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
                              {t.desc}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Describe your question or request in detail…"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 active:scale-[0.98]"
                  }`}
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
