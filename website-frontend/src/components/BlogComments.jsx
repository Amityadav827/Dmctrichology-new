"use client";
import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { fetchComments, submitComment } from '../services/api';
import { formatDate } from '../utils/dateFormatter';

const BlogComments = ({ blogSlug, initialComments = [] }) => {
  const [comments, setComments] = useState(initialComments);
  const [loading, setLoading] = useState(initialComments.length === 0);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  console.log("[BlogComments] Initializing Comment System...");
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    // Only fetch if we don't have initial comments (or to refresh)
    if (initialComments.length > 0) {
      setLoading(false);
      return;
    }
    
    const loadComments = async () => {
      try {
        const res = await fetchComments(blogSlug);
        if (res?.success) {
          setComments(res.data || []);
        }
      } catch (err) {
        console.error("[BlogComments] Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadComments();
  }, [blogSlug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatusMessage({ type: 'error', text: 'All fields are required' });
      return;
    }
    
    setSubmitting(true);
    setStatusMessage({ type: '', text: '' });

    const payload = {
      blog_slug: blogSlug,
      name: formData.name,
      email: formData.email,
      message: formData.message
    };

    console.log("[BlogComments] Outgoing payload:", payload);

    try {
      const res = await submitComment(payload);

      console.log("[BlogComments] API response:", res);

      if (res?.success) {
        setStatusMessage({ type: 'success', text: 'Comment submitted for review' });
        setFormData({ name: '', email: '', message: '' });
        // We do NOT add it to the local comments list because it needs approval
      } else {
        setStatusMessage({ type: 'error', text: res?.message || 'Failed to post comment' });
      }
    } catch (err) {
      console.error("[BlogComments] Submit error:", err);
      setStatusMessage({ type: 'error', text: 'An error occurred while submitting' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="blog-interactions-wrapper">
      {/* Comments List */}
      <div className="comments-section">
        <h3 className="section-title">Comments ({comments.length})</h3>
        <div className="comments-list">
          {loading ? (
            <p>Loading comments...</p>
          ) : comments.length > 0 ? (
            comments.map((comment, idx) => (
              <div key={idx} className="comment-item">
                <div className="comment-avatar" style={{ backgroundColor: '#1a3760', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  {comment.name?.charAt(0).toUpperCase()}
                </div>
                <div className="comment-content">
                  <div className="comment-header">
                    <h4 className="comment-author">{comment.name}</h4>
                    <span className="comment-date">{formatDate(comment.created_at)}</span>
                  </div>
                  <p className="comment-text">{comment.message || comment.content}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No comments yet. Be the first to reply!</p>
          )}
        </div>
      </div>

      {/* Reply Form */}
      <div className="reply-form-section">
        <h3 className="section-title">Leave A Reply</h3>
        <p className="form-subtitle">Your Email Address Will Not Be Published. Required Fields Are Marked *</p>
        
        {statusMessage.text && (
          <div className={`form-message ${statusMessage.type}`} style={{ padding: '15px', marginBottom: '20px', borderRadius: '4px', backgroundColor: statusMessage.type === 'success' ? '#e6fffa' : '#fff5f5', color: statusMessage.type === 'success' ? '#2c7a7b' : '#c53030', border: `1px solid ${statusMessage.type === 'success' ? '#81e6d9' : '#feb2b2'}` }}>
            {statusMessage.text}
          </div>
        )}

        <form className="reply-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <input 
                type="text" 
                placeholder="Name*" 
                required 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <input 
                type="email" 
                placeholder="Your Email Address*" 
                required 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>
          <div className="form-group">
            <textarea 
              placeholder="Your Message*" 
              rows="6" 
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            ></textarea>
          </div>
          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? 'Posting...' : 'Post Comment'}
            <Send size={14} className="ml-2" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default BlogComments;
