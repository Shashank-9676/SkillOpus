import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Header from "./Header";
import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  ChevronRight,
  Search,
  Building2,
  Layers,
  GraduationCap,
} from "lucide-react";
import SyncLoader from "react-spinners/SyncLoader";

const levelConfig = {
  beginner: { label: "Beginner", bg: "bg-green-100", text: "text-green-700" },
  intermediate: {
    label: "Intermediate",
    bg: "bg-yellow-100",
    text: "text-yellow-700",
  },
  advanced: { label: "Advanced", bg: "bg-red-100", text: "text-red-700" },
};

const CategoryBadge = ({ category }) => (
  <span className="inline-block text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
    {category || "General"}
  </span>
);

const LevelBadge = ({ level }) => {
  const cfg = levelConfig[level?.toLowerCase()] || {
    label: level || "All Levels",
    bg: "bg-gray-100",
    text: "text-gray-600",
  };
  return (
    <span
      className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}
    >
      {cfg.label}
    </span>
  );
};

const CourseCard = ({ course }) => (
  <motion.div
    whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }}
    transition={{ duration: 0.2 }}
    className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-3"
  >
    <div className="flex items-start justify-between gap-2">
      <h4 className="font-semibold text-gray-800 text-sm leading-snug">
        {course.title}
      </h4>
      <LevelBadge level={course.level} />
    </div>
    {course.description && (
      <p className="text-xs text-gray-500 line-clamp-2">{course.description}</p>
    )}
    <div className="flex items-center gap-2 mt-auto pt-1">
      <CategoryBadge category={course.category} />
    </div>
  </motion.div>
);

const OrgCard = ({ org, index, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.07 }}
    whileHover={{ y: -4, boxShadow: "0 16px 40px rgba(0,0,0,0.09)" }}
    onClick={onClick}
    className="bg-white border border-gray-100 rounded-3xl p-7 cursor-pointer group transition-all"
  >
    {/* Coloured icon */}
    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-5 shadow-md shadow-blue-200">
      <Building2 className="w-7 h-7 text-white" strokeWidth={1.5} />
    </div>

    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
      {org.organization_name}
    </h3>
    <p className="text-sm text-gray-500 line-clamp-3 mb-5 leading-relaxed">
      {org.description ||
        "A certified learning organisation offering world-class courses on SkillOpus."}
    </p>

    <div className="flex items-center justify-between text-sm">
      <span className="flex items-center gap-1.5 text-gray-500">
        <BookOpen className="w-4 h-4 text-blue-500" />
        <span className="font-medium text-gray-700">
          {org.courses.length}
        </span>{" "}
        Courses
      </span>
      <span className="flex items-center gap-1 text-blue-600 font-semibold group-hover:gap-2 transition-all">
        View <ChevronRight className="w-4 h-4" />
      </span>
    </div>
  </motion.div>
);

const Organizations = () => {
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/courses/organization-courses`,
        );
        const data = await res.json();
        if (data.details) setOrgs(data.details);
      } catch (err) {
        console.error("Error fetching organizations:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrgs();
  }, []);

  const filtered = orgs.filter((o) =>
    o.organization_name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <Header />

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full bg-white/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-blue-100 text-sm font-medium uppercase tracking-widest mb-2">
              Explore
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Our Partner
              <br />
              Organizations
            </h1>
            <p className="text-blue-100 text-lg max-w-xl">
              Discover world-class institutions and the courses they offer on
              SkillOpus.
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-8 max-w-lg"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
              <input
                type="text"
                placeholder="Search organizations…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-5 py-3.5 rounded-2xl bg-white/15 border border-white/25 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm transition"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats strip */}
      {!loading && orgs.length > 0 && (
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-wrap gap-8">
            <div className="flex items-center gap-2 text-gray-600">
              <Building2 className="w-5 h-5 text-blue-500" />
              <span className="font-semibold text-gray-900">
                {orgs.length}
              </span>{" "}
              Organizations
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <BookOpen className="w-5 h-5 text-indigo-500" />
              <span className="font-semibold text-gray-900">
                {orgs.reduce((acc, o) => acc + o.courses.length, 0)}
              </span>{" "}
              Active Courses
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <GraduationCap className="w-5 h-5 text-violet-500" />
              <span className="font-semibold text-gray-900">Free</span> to
              Explore
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {loading ? (
          <div className="flex justify-center py-24">
            <SyncLoader color="#3B82F6" size={14} margin={5} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <Building2 className="w-16 h-16 text-gray-200 mx-auto mb-5" />
            <p className="text-xl font-semibold text-gray-400">
              No organizations found
            </p>
            <p className="text-gray-400 mt-1">Try a different search term.</p>
          </div>
        ) : selected ? (
          /* ── Org Detail view ── */
          <div>
            <button
              onClick={() => setSelected(null)}
              className="flex items-center gap-1.5 text-blue-600 font-medium mb-8 hover:gap-3 transition-all"
            >
              <ChevronRight className="w-4 h-4 rotate-180" /> Back to all
              organizations
            </button>

            {/* Org header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-8 text-white mb-10 relative overflow-hidden"
            >
              <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10" />
              <div className="absolute -left-4 -bottom-8 w-28 h-28 rounded-full bg-white/10" />
              <div className="relative">
                <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mb-4">
                  <Building2 className="w-8 h-8 text-white" strokeWidth={1.5} />
                </div>
                <h2 className="text-3xl font-bold mb-2">
                  {selected.organization_name}
                </h2>
                <p className="text-blue-100 max-w-2xl">
                  {selected.description ||
                    "A certified learning organisation offering world-class courses on SkillOpus."}
                </p>
                <div className="flex flex-wrap gap-6 mt-6 text-sm">
                  <span className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5">
                    <BookOpen className="w-4 h-4" /> {selected.courses.length}{" "}
                    Courses
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Courses grid */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-500" /> All Courses
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                Courses offered by {selected.organization_name}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {selected.courses.map((course, i) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <CourseCard course={course} />
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-14 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-3xl p-8 text-center border border-blue-100">
              <GraduationCap className="w-12 h-12 text-blue-500 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Ready to start learning?
              </h3>
              <p className="text-gray-500 mb-5">
                Sign up to enroll in courses from {selected.organization_name}.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/25 transition-all active:scale-95"
              >
                Get Started — It's Free
              </button>
            </div>
          </div>
        ) : (
          /* ── Org Grid ── */
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                {search ? `Results for "${search}"` : "All Organizations"}
              </h2>
              <p className="text-gray-500 mt-1">
                {filtered.length} organization{filtered.length !== 1 ? "s" : ""}{" "}
                found
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((org, i) => (
                <OrgCard
                  key={org.organization_id}
                  org={org}
                  index={i}
                  onClick={() => setSelected(org)}
                />
              ))}
            </div>

            {/* CTA Banner */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-16 bg-gradient-to-br from-gray-900 to-slate-800 rounded-3xl p-10 text-center text-white relative overflow-hidden"
            >
              <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/5" />
              <div className="absolute -left-8 -bottom-8 w-36 h-36 rounded-full bg-white/5" />
              <div className="relative">
                <GraduationCap className="w-14 h-14 text-blue-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">
                  Join SkillOpus Today
                </h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  Log in or sign up to enroll in courses from any of our partner
                  organizations.
                </p>
                <button
                  onClick={() => navigate("/login")}
                  className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-900/50 transition-all active:scale-95"
                >
                  Get Started — It's Free
                </button>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </>
  );
};

export default Organizations;
