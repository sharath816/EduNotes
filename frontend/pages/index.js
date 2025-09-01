// pages/index.js
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NoteForm from "@/components/NoteForm";
import api from "@/lib/api";
import { FiEdit3, FiTrash2, FiPlus, FiLogOut, FiSearch, FiRefreshCw } from "react-icons/fi";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await api.get("/notes/");
      setNotes(res.data);
      setLoading(false);
      setIsRefreshing(false);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Please sign in first!" });
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const addNote = async (note) => {
    try {
      setLoading(true);
      await api.post("/notes/", {
        note_title: note.note_title,
        note_content: note.note_content,
      });
      setMessage({ type: "success", text: "Note added successfully! ✨" });
      setShowFormModal(false);
      fetchNotes();
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Error adding note." });
      setLoading(false);
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const updateNote = async (id, note) => {
    try {
      setLoading(true);
      await api.put(`/notes/${id}`, {
        note_title: note.note_title,
        note_content: note.note_content,
      });
      setMessage({ type: "success", text: "Note updated successfully! ✨" });
      setEditingNote(null);
      setShowFormModal(false);
      fetchNotes();
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Error updating note." });
      setLoading(false);
    }
  };

  const deleteNote = async (id) => {
    if (!confirm("Are you sure you want to delete this note? This action cannot be undone.")) {
      return;
    }

    try {
      setLoading(true);
      await api.delete(`/notes/${id}`);
      setMessage({ type: "success", text: "Note deleted successfully! 🗑️" });
      fetchNotes();
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Error deleting note." });
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchNotes();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/signin";
  };

  const filteredNotes = notes.filter(note =>
    note.note_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.note_content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    // Ensure the string is treated as UTC
    const date = new Date(dateString + "Z");

    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-4">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto mb-8"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              My Notes
            </h1>
            <p className="text-gray-600 mt-2">Your personal digital notebook</p>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 disabled:opacity-50"
              title="Refresh notes"
            >
              <FiRefreshCw className={`w-5 h-5 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:bg-gray-50"
            >
              <FiLogOut className="w-4 h-4" />
              <span className="hidden sm:block">Logout</span>
            </motion.button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-6 relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-gray-800" // Added text-gray-800 here
          />
        </div>
      </motion.header>

      {/* Notification */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg backdrop-blur-sm border ${message.type === "success"
              ? "bg-green-100/90 border-green-200 text-green-800"
              : "bg-red-100/90 border-red-200 text-red-800"
              }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{message.text}</span>
              {message.type === "error" && message.text.includes("sign in") && (
                <button
                  onClick={() => (window.location.href = "/signin")}
                  className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notes Grid */}
      <main className="max-w-7xl mx-auto">
        {loading && !isRefreshing ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : filteredNotes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-blue-100 rounded-3xl mx-auto mb-6 flex items-center justify-center">
              <FiPlus className="w-12 h-12 text-purple-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              {searchTerm ? "No notes found" : "No notes yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ? "Try a different search term" : "Create your first note to get started"}
            </p>
            {!searchTerm && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFormModal(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-200"
              >
                Create First Note
              </motion.button>
            )}
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredNotes.map((note) => (
              <motion.div
                key={note.note_id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm hover:shadow-2xl transition-all duration-300 border border-white/20 hover:border-purple-200/50 relative overflow-hidden"
              >
                {/* Gradient accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-blue-400"></div>

                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 line-clamp-2 mb-2">
                    {note.note_title}
                  </h2>
                  <p className="text-gray-600 line-clamp-4 text-sm leading-relaxed">
                    {note.note_content}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-400 space-y-1">
                    <div>Created: {formatDate(note.created_on)}</div>
                    <div>Updated: {formatDate(note.last_update)}</div>
                  </div>

                  <div className="flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setEditingNote(note);
                        setShowFormModal(true);
                      }}
                      className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                      title="Edit note"
                    >
                      <FiEdit3 className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => deleteNote(note.note_id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      title="Delete note"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      {/* Floating Add Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          setEditingNote(null);
          setShowFormModal(true);
        }}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-5 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 z-40 group"
        title="Add new note"
      >
        <FiPlus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
      </motion.button>

      {/* Note Form Modal */}
      <AnimatePresence>
        {showFormModal && (
          <NoteForm
            initialData={editingNote}
            onSubmit={editingNote ? (note) => updateNote(editingNote.note_id, note) : addNote}
            loading={loading}
            onClose={() => {
              setShowFormModal(false);
              setEditingNote(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Loading Overlay */}
      {loading && !isRefreshing && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  );
}