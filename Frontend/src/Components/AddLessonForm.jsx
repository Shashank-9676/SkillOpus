import { useState } from "react";
import { Plus, X, Save, Upload, Youtube } from "lucide-react";
import { toast } from "react-toastify";
import Cookies from 'js-cookie';

const AddLessonForm = ({ setShowAddLessonForm, id, created_by }) => {
  const [newLesson, setNewLesson] = useState({
    title: "",
    lesson_order: "",
    content_url: "",
    created_by: created_by,
    video: null
  });
  const [uploadType, setUploadType] = useState('youtube'); // 'youtube' or 'video'

    const handleAddLesson = async (e) => {
        e.preventDefault();
    if (!newLesson.title) {
      toast.warning('Please fill all required fields');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('title', newLesson.title);
      formData.append('lesson_order', newLesson.lesson_order);
      
      if (uploadType === 'video' && newLesson.video) {
        formData.append('video', newLesson.video);
      } else {
        formData.append('content_url', newLesson.content_url);
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/courses/${id}/lessons/add`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Cookies.get('jwt_token')}`
          // Content-Type header must be undefined for FormData to work correctly (boundary is set automatically)
        },
        body: formData,
      });
      if (!response.ok) {
        toast.error('Failed to add lesson');
        return;
      }else{
        // const data = await response.json();
        setNewLesson({ title: '', description: '', type: 'video', duration: '', content: null });
        setShowAddLessonForm(false);
        toast.success('Lesson added successfully!');
        window.location.reload();
      }
      
    } catch (error) {
      console.error('Error adding lesson:', error);
    }
  };


  // single handler for all inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewLesson((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setNewLesson((prev) => ({ ...prev, video: e.target.files[0] }));
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000080] bg-opacity-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Plus className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Add New Lesson</h2>
          </div>
          <button 
            type="button"
            onClick={() => setShowAddLessonForm(false)} 
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleAddLesson}>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Lesson Title *</label>
            <input required type="text" name="title" value={newLesson.title} onChange={handleChange} placeholder="Enter lesson title" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>

          {/* Type and Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
              <input type="number" name="lesson_order" value={newLesson.lesson_order} onChange={handleChange} placeholder="Enter lesson order" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
              <div className="flex space-x-2 mb-2">
                <button 
                  type="button" 
                  onClick={() => setUploadType('youtube')}
                  className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center space-x-2 border ${uploadType === 'youtube' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                  <Youtube className="w-4 h-4" />
                  <span>YouTube</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => setUploadType('video')}
                  className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center space-x-2 border ${uploadType === 'video' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload</span>
                </button>
              </div>

              {uploadType === 'youtube' ? (
                <div>
                  <input required={uploadType === 'youtube'} type="text" name="content_url" value={newLesson.content_url} onChange={handleChange} placeholder="Enter YouTube Video ID (e.g. dQw4w9WgXcQ)" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <p className="text-xs text-gray-500 mt-1">Found after v= in URL</p>
                </div>
              ) : (
                <div>
                   <input required={uploadType === 'video'} type="file" accept="video/*" onChange={handleFileChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                   <p className="text-xs text-gray-500 mt-1">Supports MP4, AVI, MOV</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
            <button type="button" onClick={() => setShowAddLessonForm(false)} className="px-6 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center">
              <Save className="w-4 h-4 mr-2" />
              Add Lesson
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLessonForm;
