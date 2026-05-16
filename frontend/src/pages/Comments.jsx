import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Trash2, Check, X, MessageSquare, ExternalLink } from "lucide-react";
import Loader from "../components/Loader";
import Table from "../components/Table";
import api from "../api/client";

const formatDate = (dateString) => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      setLoading(true);
      console.log("[CommentsPage] Fetching comments from /blog-comments/admin/all");
      const res = await api.get("/blog-comments/admin/all");
      console.log("[CommentsPage] API Response:", res.data);
      
      if (res.data.success) {
        // STEP 5 - SAFE RESPONSE MAPPING
        setComments(res.data.comments || []);
      }
    } catch (error) {
      console.error("[CommentsPage] Fetch Error:", error);
      // STEP 6 - SAFE FALLBACKS (Never show error toast if we can just show empty list)
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      const res = await api.patch(`/blog-comments/admin/${id}`, { status });
      if (res.data.success) {
        toast.success(`Comment ${status} successfully`);
        fetchComments();
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      const res = await api.delete(`/blog-comments/admin/${id}`);
      if (res.data.success) {
        toast.success("Comment deleted");
        fetchComments();
      }
    } catch (error) {
      toast.error("Failed to delete comment");
    }
  };

  const columns = [
    { key: "blog", label: "Blog Title" },
    { key: "user", label: "User / Email" },
    { key: "message", label: "Message" },
    { key: "status", label: "Status" },
    { key: "date", label: "Date" },
    { key: "actions", label: "Actions", align: "right" },
  ];

  if (loading) return <Loader />;

  return (
    <div style={{ padding: "1.5rem" }}>
      <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0F172A", marginBottom: "0.5rem" }}>
            Comment Moderation
          </h1>
          <p style={{ color: "#64748B", fontSize: "0.875rem" }}>
            Manage and moderate blog comments
          </p>
        </div>
      </div>

      <Table columns={columns}>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <tr key={comment.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
              <td style={{ padding: "1rem 1.25rem" }}>
                <div style={{ fontWeight: 600, color: "#1E293B", maxWidth: "200px" }}>
                  {comment.blog_title || "N/A"}
                </div>
                <div style={{ fontSize: "0.75rem", color: "#94A3B8", marginTop: "4px" }}>
                  <a 
                    href={`${import.meta.env.VITE_FRONTEND_URL || 'https://dmctrichology-mkm4.vercel.app'}/blog/${comment.blog_slug}`} 
                    target="_blank" 
                    rel="noreferrer"
                    style={{ display: "flex", alignItems: "center", gap: "4px", color: "inherit" }}
                  >
                    View Blog <ExternalLink size={10} />
                  </a>
                </div>
              </td>
              <td style={{ padding: "1rem 1.25rem" }}>
                <div style={{ fontWeight: 500, color: "#334155" }}>{comment.name}</div>
                <div style={{ fontSize: "0.75rem", color: "#64748B" }}>{comment.email}</div>
              </td>
              <td style={{ padding: "1rem 1.25rem" }}>
                <div style={{ maxWidth: "300px", fontSize: "0.875rem", color: "#475569", lineHeight: "1.5" }}>
                  {comment.message}
                </div>
              </td>
              <td style={{ padding: "1rem 1.25rem" }}>
                <span style={{
                  padding: "4px 10px",
                  borderRadius: "99px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  textTransform: "capitalize",
                  backgroundColor: 
                    comment.status === 'approved' ? '#DCFCE7' : 
                    comment.status === 'rejected' ? '#FEE2E2' : '#FEF3C7',
                  color: 
                    comment.status === 'approved' ? '#166534' : 
                    comment.status === 'rejected' ? '#991B1B' : '#92400E',
                }}>
                  {comment.status}
                </span>
              </td>
              <td style={{ padding: "1rem 1.25rem", color: "#64748B", fontSize: "0.75rem" }}>
                {formatDate(comment.created_at)}
              </td>
              <td style={{ padding: "1rem 1.25rem", textAlign: "right" }}>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                  {comment.status !== 'approved' && (
                    <button
                      onClick={() => handleStatusUpdate(comment.id, 'approved')}
                      title="Approve"
                      style={{ padding: "6px", borderRadius: "8px", border: "1px solid #E2E8F0", color: "#16A34A", cursor: "pointer", backgroundColor: "white" }}
                    >
                      <Check size={16} />
                    </button>
                  )}
                  {comment.status !== 'rejected' && (
                    <button
                      onClick={() => handleStatusUpdate(comment.id, 'rejected')}
                      title="Reject"
                      style={{ padding: "6px", borderRadius: "8px", border: "1px solid #E2E8F0", color: "#DC2626", cursor: "pointer", backgroundColor: "white" }}
                    >
                      <X size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(comment.id)}
                    title="Delete"
                    style={{ padding: "6px", borderRadius: "8px", border: "1px solid #E2E8F0", color: "#64748B", cursor: "pointer", backgroundColor: "white" }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={6} style={{ padding: "3rem", textAlign: "center", color: "#94A3B8" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
                <MessageSquare size={48} opacity={0.2} />
                <p>No comments found</p>
              </div>
            </td>
          </tr>
        )}
      </Table>
    </div>
  );
};

export default Comments;
