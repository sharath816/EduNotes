// components/NoteForm.js
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function NoteForm({ initialData, onSubmit, loading, onClose }) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isFocused, setIsFocused] = useState({ title: false, content: false });
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.note_title || "");
            setContent(initialData.note_content || "");
        } else {
            setTitle("");
            setContent("");
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim() || loading) return;
        
        onSubmit({ note_title: title, note_content: content });
    };

    const handleClose = () => {
        if (onClose && !isClosing) {
            setIsClosing(true);
            // Add a small delay to allow the animation to complete
            setTimeout(() => {
                onClose();
            }, 300);
        }
    };

    const handleBackdropClick = (e) => {
        // Only close if the backdrop itself is clicked, not its children
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    const handleEscapeKey = (e) => {
        if (e.key === 'Escape') {
            handleClose();
        }
    };

    // Add event listener for Escape key
    useEffect(() => {
        document.addEventListener('keydown', handleEscapeKey);
        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, []);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                onClick={handleBackdropClick}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 rounded-3xl border border-white/20 shadow-2xl w-full max-w-2xl overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-white/5 border-b border-white/10 p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">N</span>
                                </div>
                                <h2 className="text-2xl font-bold text-white">
                                    {initialData ? "Edit Note" : "Create Note"}
                                </h2>
                            </div>
                            <button
                                onClick={handleClose}
                                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 transition-colors duration-200 flex items-center justify-center group"
                                disabled={loading}
                                aria-label="Close form"
                            >
                                <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Title Field */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-300 mb-3">
                                Title
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className={`h-5 w-5 transition-colors duration-200 ${isFocused.title ? 'text-purple-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    onFocus={() => setIsFocused(prev => ({ ...prev, title: true }))}
                                    onBlur={() => setIsFocused(prev => ({ ...prev, title: false }))}
                                    className="w-full pl-10 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                                    placeholder="Enter note title..."
                                    maxLength={100}
                                    disabled={loading}
                                    required
                                    autoFocus
                                />
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-xs text-gray-400">Required</span>
                                <span className="text-xs text-gray-400">{title.length}/100</span>
                            </div>
                        </div>

                        {/* Content Field */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-300 mb-3">
                                Content
                            </label>
                            <div className="relative">
                                <div className="absolute top-3 left-3 pointer-events-none">
                                    <svg className={`h-5 w-5 transition-colors duration-200 ${isFocused.content ? 'text-purple-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    onFocus={() => setIsFocused(prev => ({ ...prev, content: true }))}
                                    onBlur={() => setIsFocused(prev => ({ ...prev, content: false }))}
                                    className="w-full pl-10 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none h-40 disabled:opacity-50"
                                    placeholder="Write your note content..."
                                    maxLength={1000}
                                    disabled={loading}
                                    required
                                />
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-xs text-gray-400">Required</span>
                                <span className="text-xs text-gray-400">{content.length}/1000</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-4 pt-4 border-t border-white/10">
                            <motion.button
                                type="button"
                                onClick={handleClose}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex-1 border border-white/20 text-white py-3 px-6 rounded-xl font-semibold hover:bg-white/5 transition-all duration-200 disabled:opacity-50"
                                disabled={loading}
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={loading || !title.trim() || !content.trim()}
                                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        {initialData ? "Updating..." : "Saving..."}
                                    </div>
                                ) : (
                                    initialData ? "Update Note" : "Save Note"
                                )}
                            </motion.button>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="bg-white/5 border-t border-white/10 p-4">
                        <p className="text-center text-xs text-gray-400">
                            ✨ Your notes are encrypted and securely stored
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}