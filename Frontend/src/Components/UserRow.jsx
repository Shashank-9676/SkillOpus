import { Check, X, ShieldCheck, GraduationCap, UserCog } from "lucide-react";
import Cookies from "js-cookie";
import { useState } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const roleMeta = {
  admin: {
    label: "Admin",
    icon: ShieldCheck,
    bg: "bg-purple-100",
    text: "text-purple-700",
  },
  instructor: {
    label: "Instructor",
    icon: UserCog,
    bg: "bg-blue-100",
    text: "text-blue-700",
  },
  student: {
    label: "Student",
    icon: GraduationCap,
    bg: "bg-emerald-100",
    text: "text-emerald-700",
  },
};

const avatarColors = [
  "from-blue-500 to-indigo-500",
  "from-violet-500 to-purple-500",
  "from-emerald-500 to-teal-500",
  "from-orange-500 to-red-500",
  "from-pink-500 to-rose-500",
];

const getGradient = (name = "") =>
  avatarColors[name.charCodeAt(0) % avatarColors.length];

const UserRow = ({ user }) => {
  const [confirm, setConfirm] = useState(null); // 'activate' | 'deactivate' | null

  const handleStatusChange = async (newStatus) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/enrollments/${user.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("jwt_token")}`,
        },
        body: JSON.stringify({ status: newStatus }),
      },
    );
    if (!response.ok) {
      toast.error("Error updating enrollment status");
    } else {
      toast.success(
        `User ${newStatus === "active" ? "activated" : "deactivated"} successfully`,
      );
      window.location.reload();
    }
    setConfirm(null);
  };

  const role = roleMeta[user.user_type] || roleMeta.student;
  const RoleIcon = role.icon;
  const isActive = user.status === "active";

  return (
    <>
      <tr className="group hover:bg-indigo-50/40 dark:hover:bg-slate-700/40 transition-colors duration-150">
        {/* Avatar + Name */}
        <td className="px-5 py-4 whitespace-nowrap">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getGradient(user.student_name)} flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0`}
            >
              {user.student_name?.[0]?.toUpperCase() ?? "?"}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 leading-tight">
                {user.student_name}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {user.student_email}
              </p>
            </div>
          </div>
        </td>

        {/* Role badge */}
        <td className="px-5 py-4 whitespace-nowrap">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg ${role.bg} ${role.text}`}
          >
            <RoleIcon className="w-3.5 h-3.5" />
            {role.label}
          </span>
        </td>

        {/* Enrolled on */}
        <td className="px-5 py-4 whitespace-nowrap text-xs text-gray-500 dark:text-slate-400">
          {new Date(user.enrolled_at).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </td>

        {/* Status badge */}
        <td className="px-5 py-4 whitespace-nowrap">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg ${
              isActive
                ? "bg-green-100 text-green-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-green-500" : "bg-amber-500"}`}
            />
            {isActive ? "Active" : "Inactive"}
          </span>
        </td>

        {/* Actions */}
        <td className="px-5 py-4 whitespace-nowrap">
          <div className="flex items-center gap-2 justify-end">
            {!isActive && (
              <button
                title="Activate"
                onClick={() => setConfirm("activate")}
                className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
              >
                <Check className="w-4 h-4" />
              </button>
            )}
            {isActive && (
              <button
                title="Deactivate"
                onClick={() => setConfirm("deactivate")}
                className="p-2 rounded-lg bg-red-100 text-red-500 hover:bg-red-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </td>
      </tr>

      {/* Confirmation modal */}
      <AnimatePresence>
        {confirm && (
          <tr>
            <td colSpan={5} className="p-0 border-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0.92, opacity: 0, y: 16 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.92, opacity: 0, y: 16 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="bg-white rounded-2xl shadow-2xl p-7 w-96 border border-gray-100"
                >
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                      confirm === "activate" ? "bg-green-100" : "bg-red-100"
                    }`}
                  >
                    {confirm === "activate" ? (
                      <Check className="w-6 h-6 text-green-600" />
                    ) : (
                      <X className="w-6 h-6 text-red-500" />
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {confirm === "activate"
                      ? "Activate User?"
                      : "Deactivate User?"}
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">
                    {confirm === "activate"
                      ? `This will enroll ${user.student_name} and mark them as active.`
                      : `This will mark ${user.student_name} as inactive and remove their active access.`}
                  </p>

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setConfirm(null)}
                      className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() =>
                        handleStatusChange(
                          confirm === "activate" ? "active" : "inactive",
                        )
                      }
                      className={`px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition-colors ${
                        confirm === "activate"
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      Confirm
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>
    </>
  );
};

export default UserRow;
