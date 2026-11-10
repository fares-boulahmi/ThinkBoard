import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import NoteCard from "../Components/NoteCard";
import NotesNotFound from "../Components/NoteNotFound";
import RateLimitedUI from "../Components/RateLimitedUI";
import axiosInstance from "../lib/axios";

const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  // Delete note function
  const deleteNote = async (noteId) => {
    try {
      await axiosInstance.delete(`notes/delete/${noteId}`);
      // Remove the deleted note from the state
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
      toast.success("Note deleted successfully!");
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("An error occurred while deleting the note.");
    }
  };

  // Fetch notes from the backend API
  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        // const response = await fetch(`${backendUrl}`);
        const response = await axiosInstance.get(`/notes`);
        setNotes(response.data);
        setIsRateLimited(false);
      } catch (error) {
        console.error("Error fetching notes:", error);
        if (error.response && error.response.status === 429) {
          setIsRateLimited(true);
        } else {
          toast.error("An error occurred while fetching notes.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);
  return (
    <div className="flex flex-col items-center justify-center ">
      <h1 className="text-2xl font-bold m-4 ">Notes</h1>

      <Toaster position="top-right" />
      {loading ? (
        <span className="loading loading-spinner text-primary  m-10"></span>
      ) : (
        notes.length !== 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4  max-w-[80%] m-auto">
            {notes.map((note) => (
              <NoteCard key={note._id} note={note} deleteNote={deleteNote} />
            ))}
          </div>
        )
      )}
      {notes.length === 0 && !loading && !isRateLimited && <NotesNotFound />}
      {isRateLimited && <RateLimitedUI />}
    </div>
  );
};

export default HomePage;
