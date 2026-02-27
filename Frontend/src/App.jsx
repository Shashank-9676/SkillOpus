import Login from "./Components/Login";
import Register from "./Components/Register";
import Home from "./Components/Home";
import Courses from "./Components/Courses";
import { BrowserRouter, Routes, Route } from "react-router";
import CourseDetail from "./Components/CourseDetail";
import ProtectedRoute from "./Components/ProtectedRoute";
import StudentProgress from "./Components/StudentProgress";
import About from "./Components/About";
import { ToastContainer } from "react-toastify";
import NotFound from "./Components/NotFound";
import Contact from "./Components/Contact";
import Organizations from "./Components/Organizations";
import ScrollToTop from "./Components/ScrollToTop";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
        <Route path="/course/:id" element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />
        <Route path="/progress/:id" element={<ProtectedRoute><StudentProgress /></ProtectedRoute>} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/organizations" element={<Organizations />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer theme="colored" />
    </BrowserRouter>
  );
}

export default App;
