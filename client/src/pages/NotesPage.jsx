import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
import logo from "../assets/logo.svg";
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
        <p className="mt-4 text-sm text-gray-600">Loading dashboard…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      {/* Top Bar */}
      <header className="border-gray-200 border-b bg-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-4 gap-3">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="" className="h-9 md:h-10 w-auto" />
            <span className="text-2xl font-bold tracking-tight text-gray-900">
              Trackly
            </span>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-800 group hover:text-gray-900"
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
        <p className="text-lg text-gray-700 mb-6">{internship.role}</p>

        {/* Edit / Preview Toggle */}
        <div className="flex gap-4 mb-6">
          <div className="flex rounded-xl gap-2 p-1">
            <button
              onClick={() => setIsPreview(false)}
              className={`px-5 py-2 rounded-md font-semibold transition-all duration-200 ${
                !isPreview
                  ? "bg-[#CBFF9E] text-gray-900"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              Edit
            </button>
            <button
              onClick={() => setIsPreview(true)}
              className={`px-5 py-2 rounded-md font-semibold transition-all duration-200 ${
                isPreview
                  ? "bg-[#CBFF9E] text-gray-900"
                  : "bg-gray-100 text-gray-700"
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
                : "bg-gray-200 text-gray-600 cursor-not-allowed"
            }
        `}
          >
            <span>Save</span>
            <span
              className={`flex items-center gap-1 px-2 py-1 rounded-md ${
                isDirty ? "bg-blue-500 text-white" : "bg-white/20 text-gray-600"
              }`}
            >
              {navigator.userAgentData?.platform === "macOS" ||
              navigator.platform.toLowerCase().includes("mac")
                ? "⌘"
                : "Ctrl"}
            </span>
            <span
              className={`flex items-center gap-1 px-2 py-1 rounded-md ${
                isDirty ? "bg-blue-500 text-white" : "bg-white/20 text-gray-600"
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
              className="w-full h-[40vh] md:h-[65vh] bg-white text-gray-800 border border-gray-200 rounded-lg p-4 resize-none text-lg 
           focus:outline-none focus:ring-1 focus:ring-gray-600"
              placeholder="Start writing your notes in Markdown..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <div className="hidden md:block absolute bottom-10 left-10 text-gray-600 text-lg font-semibold pointer-events-none select-none">
              <h4 className="uppercase tracking-widest text-gray-600 mb-3">
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
          <div className="w-full h-[65vh] bg-white text-lg font-semibold text-gray-800 border border-gray-200 rounded-lg p-6 overflow-auto prose prose-invert">
            <ReactMarkdown>{notes}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
