import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Users, BookOpen, UserPlus, Clock, Activity } from "lucide-react";
import UserRow from "./UserRow";
import AddUserPopup from "./AddUserForm";
import StatCard from "./StarCard";
import SyncLoader from "react-spinners/SyncLoader";
import { motion } from "framer-motion";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    activeUsers: 0,
    pendingEnrollments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [pendingEnrollments, setPendingEnrollments] = useState([]);

  const handleSaveUser = async (userData) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/instructors`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("jwt_token")}`,
          },
          body: JSON.stringify(userData),
        },
      );
      const data = await response.json();
      console.log("Response from server:", data);
      fetchEnrollments();
      setIsPopupOpen(false);
    } catch (err) {
      console.error("Error saving user:", err);
    }
  };

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <SyncLoader color="#3B82F6" size={15} margin={5} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Manage your learning management system
              </p>
            </motion.div>
          </div>
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
            color="bg-blue-500"
          />
          <StatCard
            icon={BookOpen}
            title="Total Courses"
            value={stats?.totalCourses || 0}
            color="bg-green-500"
          />
          <StatCard
            icon={Activity}
            title="Active Users"
            value={stats?.activeUsers || 0}
            color="bg-purple-500"
          />
          <StatCard
            icon={Clock}
            title="Pending Enrollments"
            value={stats?.pendingEnrollments || 0}
            color="bg-orange-500"
          />
        </motion.div>

        {/* Dashboard Content */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">
                Pending Enrollments
              </h2>
            </div>
            <div className="p-0">
              {pendingEnrollments?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Join Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
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
            className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">Users</h2>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl font-medium transition-all shadow-sm hover:shadow active:scale-95 flex items-center"
                onClick={() => setIsPopupOpen(true)}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add Instructor
              </button>
              <AddUserPopup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                onSave={handleSaveUser}
              />
            </div>
            <div className="p-0">
              {users?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Join Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
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
