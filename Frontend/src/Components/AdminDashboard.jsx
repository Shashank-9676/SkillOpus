import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Users, BookOpen, Clock, Activity } from "lucide-react";
import UserRow from "./UserRow";
import StatCard from "./StatCard";
import SyncLoader from "react-spinners/SyncLoader";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    activeUsers: 0,
    pendingEnrollments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [pendingEnrollments, setPendingEnrollments] = useState([]);

  const fetchEnrollmentsCounts = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/stats/admin`,
        {
          headers: { Authorization: `Bearer ${Cookies.get("jwt_token")}` },
        },
      );
      const { details } = await response.json();
      setStats(details || {});
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchEnrollments = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/enrollments/`,
        {
          headers: { Authorization: `Bearer ${Cookies.get("jwt_token")}` },
        },
      );
      const { details } = await response.json();
      setUsers(details || []);
      setPendingEnrollments(
        details?.filter((user) => user.status == "pending") || [],
      );
    } catch (error) {
      console.error("Error fetching enrollments:", error);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchEnrollmentsCounts(), fetchEnrollments()]);
      setLoading(false);
    };
    init();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <SyncLoader color="#3B82F6" size={15} margin={5} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-16">
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/5" />
        <div className="absolute -bottom-12 -left-12 w-52 h-52 rounded-full bg-white/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-gray-400 text-sm font-medium mb-1 uppercase tracking-widest">
              Admin Dashboard
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Control Center ⚙️
            </h1>
            <p className="text-gray-400 mt-2 text-base">
              Manage your learning management system.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
        >
          <StatCard
            icon={Users}
            title="Total Users"
            value={stats?.totalUsers || 0}
            color="blue"
          />
          <StatCard
            icon={BookOpen}
            title="Total Courses"
            value={stats?.totalCourses || 0}
            color="green"
          />
          <StatCard
            icon={Activity}
            title="Active Users"
            value={stats?.activeUsers || 0}
            color="purple"
          />
          <StatCard
            icon={Clock}
            title="Pending"
            value={stats?.pendingEnrollments || 0}
            color="orange"
          />
        </motion.div>

        {/* Dashboard Content */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-700/30">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Pending Enrollments
              </h2>
            </div>
            <div className="p-0">
              {pendingEnrollments?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50 dark:bg-slate-700/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                          Join Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-slate-700 bg-white dark:bg-slate-800">
                      {pendingEnrollments?.map((user) => (
                        <UserRow key={user.id} user={user} />
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">
                    No pending enrollments
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* All Users Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between bg-gray-50/50 dark:bg-slate-700/30">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Users
              </h2>
            </div>
            <div className="p-0">
              {users?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Join Date</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-slate-700 bg-white dark:bg-slate-800">
                      {users?.map((user) => (
                        <UserRow key={user.id} user={user} />
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No users found</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
