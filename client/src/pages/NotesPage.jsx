import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
import logo from "../assets/logo.png";
import { useCallback } from "react";

export default function NotesPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [internship, setInternship] = useState(null);
  const [notes, setNotes] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [originalNotes, setOriginalNotes] = useState("");

  const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;

  useEffect(() => {
    API.get(`/api/internships/${id}`)
      .then((res) => {
        setInternship(res.data);
        setNotes(res.data.notes || "");
        setOriginalNotes(res.data.notes || "");
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load notes");
        navigate("/");
      });
  }, [id]);

  const handleSave = useCallback(async () => {
    try {
      await API.put(`/api/internships/${id}`, { notes });
      setOriginalNotes(notes);
      toast.success("Notes updated");
    } catch (err) {
      toast.error("Failed to save notes");
    }
  }, [notes, id]);

  const isDirty = notes !== originalNotes;

  useEffect(() => {
    function handleKeyDown(e) {
      if (
        (isMac && e.metaKey && e.key === "s") ||
        (!isMac && e.ctrlKey && e.key === "s")
      ) {
        e.preventDefault();
        handleSave();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave, isMac]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-800">
        <div className="w-10 h-10 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin" />
        <p className="mt-4 text-sm text-gray-400">Loading dashboard…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800 text-gray-200 flex flex-col">
      {/* Top Bar */}
      <header className="border-gray-700 border-b bg-gray-700">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-4 gap-3">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="w-12 h-12 opacity-90" />
            <span className="text-2xl font-semibold">Trackly</span>
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
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{internship.company}</h1>
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
            onClick={isDirty ? handleSave : null}
            disabled={!isDirty}
            className={`ml-auto flex items-center gap-2 px-5 py-2 rounded-xl font-semibold
            ${
              isDirty
                ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            }
        `}
          >
            <span>Save</span>
            <span
              className={`flex items-center gap-1 px-2 py-1 rounded-md ${
                isDirty ? "bg-blue-500 text-white" : "bg-white/20 text-gray-400"
              }`}
            >
              {navigator.userAgentData?.platform === "macOS" ||
              navigator.platform.toLowerCase().includes("mac")
                ? "⌘"
                : "Ctrl"}
            </span>
            <span
              className={`flex items-center gap-1 px-2 py-1 rounded-md ${
                isDirty ? "bg-blue-500 text-white" : "bg-white/20 text-gray-400"
              }`}
            >
              S
            </span>
          </button>
        </div>

        {/* Editor / Preview */}
        {!isPreview ? (
          <div className="relative">
            <textarea
              className="w-full h-[40vh] md:h-[65vh] bg-gray-900 text-gray-200 border border-gray-700 rounded-lg p-4 resize-none text-lg 
           focus:outline-none focus:ring-1 focus:ring-gray-600"
              placeholder="Start writing your notes in Markdown..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <div className="hidden md:block absolute bottom-10 left-10 text-gray-400 text-lg font-semibold pointer-events-none select-none">
              <h4 className="uppercase tracking-widest text-gray-500 mb-3">
                MARKDOWN TIPS
              </h4>

              <div className="flex gap-12">
                <div>
                  <p># Heading 1</p>
                  <p>**bold**</p>
                  <p>- bullet point</p>
                  <p>{`> blockquote`}</p>
                  <p>[link](url)</p>
                </div>

                <div>
                  <p>## Heading 2</p>
                  <p>*italic*</p>
                  <p>1. numbered list</p>
                  <p>`inline code`</p>
                  <p>{`'''code block'''`}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-[65vh] bg-gray-900 text-lg font-semibold text-gray-200 border border-gray-700 rounded-lg p-6 overflow-auto prose prose-invert">
            <ReactMarkdown>{notes}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
