import { ArrowLeftIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router";
import axiosInstance from "../lib/axios";

const NoteDetailPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  // const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("All fields are required");
      return;
    }

    setLoadingUpdate(true);
    try {
      await axiosInstance.put(`/notes/update/${id}`, {
        title,
        content,
      });

      toast.success("Note updated successfully!");
      // navigate("/");
    } catch (error) {
      console.log("Error updating note", error);
      if (error.response.status === 429) {
        toast.error("Slow down! You're updating notes too fast", {
          duration: 4000,
          icon: "💀",
        });
      } else {
        toast.error("Failed to update note");
      }
    } finally {
      setLoadingUpdate(false);
    }
  };
  // Delete note function
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await axiosInstance.delete(`/notes/delete/${id}`);
      toast.success("Note deleted successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("An error occurred while deleting the note.");
    }
  };
  useEffect(() => {
    // Fetch the note details from the backend API using the note ID from the URL
    const fetchNoteDetails = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/notes/${id}`);
        const { title, content } = response.data;
        setTitle(title);
        setContent(content);
      } catch (error) {
        console.error("Error fetching note details:", error);
        toast.error("An error occurred while fetching note details.");
      } finally {
        setLoading(false);
      }
    };

    fetchNoteDetails();
  }, [id]);

  return (
    <div className="min-h-screen bg-base-200">
      {loading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <span className="loading loading-spinner text-primary text-4xl"></span>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <Toaster position="top-right" />
          <div className="max-w-2xl mx-auto">
            <div className="flex items-top justify-between mb-6">
              <Link to={"/"} className="btn btn-ghost mb-6">
                <ArrowLeftIcon className="size-5" />
                Back to Notes
              </Link>
              <button
                onClick={handleDelete}
                className="btn btn-error btn-outline"
              >
                <Trash2Icon className="h-5 w-5" />
                Delete Note
              </button>
            </div>

            <div className="card bg-base-100">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-4">Edit Note</h2>
                <form onSubmit={handleSubmit}>
                  <div className="form-control mb-4">
                    <label className="label">
                      <span className="label-text">Title</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Note Title"
                      className="input input-bordered"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="form-control mb-4">
                    <label className="label">
                      <span className="label-text">Content</span>
                    </label>
                    <textarea
                      placeholder="Write your note here..."
                      className="textarea textarea-bordered h-32"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </div>

                  <div className="card-actions justify-end">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loadingUpdate}
                    >
                      {loadingUpdate ? "Saving..." : "Edit Note"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default NoteDetailPage;
