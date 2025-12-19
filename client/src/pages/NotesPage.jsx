import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
import logo from "../assets/logo.png";

export default function NotesPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [internship, setInternship] = useState(null);
  const [notes, setNotes] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/api/internships/${id}`)
      .then((res) => {
        setInternship(res.data);
        setNotes(res.data.notes || "");
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load notes");
        navigate("/");
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-800 text-gray-200 flex justify-center items-center">
        Loading...
      </div>
    );
  }
  const handleSave = async () => {
    try {
      await API.put(`/api/internships/${id}`, { notes });
      toast.success("Notes updated");
    } catch (err) {
      toast.error("Failed to save notes");
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 text-gray-200 flex flex-col">
      {/* Top Bar */}
      <header className="w-full border-b border-gray-700 bg-gray-700 flex justify-center">
        <div className="w-full max-w-7xl flex items-center justify-between px-10 py-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="w-12 h-12 opacity-90" />
            <span className="text-2xl font-seimibold">Trackly</span>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-200 group hover:text-white"
          >
            <span className="transform transition-transform duration-200 group-hover:-translate-x-1">
              ←
            </span>
            <span className="text-lg font-medium">Back to Home</span>
          </button>
        </div>
      </header>

      <div className="flex-1 w-full max-w-6xl mx-auto p-10">
        <h1 className="text-3xl font-bold mb-2">{internship.company}</h1>
        <p className="text-lg text-gray-300 mb-6">{internship.role}</p>

        {/* Edit / Preview Toggle */}
        <div className="flex gap-4 mb-6">
          <div className="flex rounded-xl gap-2 p-1">
            <button
              onClick={() => setIsPreview(false)}
              className={`px-5 py-2 rounded-md font-semibold transition-all duration-200 ${
                !isPreview
                  ? "bg-teal-700 text-white"
                  : "bg-gray-700 text-gray-300"
              }`}
            >
              Edit
            </button>
            <button
              onClick={() => setIsPreview(true)}
              className={`px-5 py-2 rounded-md font-semibold transition-all duration-200 ${
                isPreview
                  ? "bg-teal-700 text-white"
                  : "bg-gray-700 text-gray-300"
              }`}
            >
              Preview
            </button>
          </div>

          <button
            onClick={handleSave}
            className="ml-auto px-5 py-2 rounded-md bg-green-600 hover:bg-green-500 font-semibold text-white"
          >
            Save Notes
          </button>
        </div>

        {/* Editor / Preview */}
        {!isPreview ? (
          <textarea
            className="w-full h-[65vh] bg-gray-900 text-gray-200 border border-gray-700 rounded-lg p-4 resize-none text-lg"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Write markdown notes here..."
          />
        ) : (
          <div className="w-full h-[65vh] bg-gray-900 text-gray-200 border border-gray-700 rounded-lg p-6 overflow-auto prose prose-invert">
            <ReactMarkdown>{notes}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
