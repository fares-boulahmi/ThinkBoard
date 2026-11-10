import Note from "../models/Notes.js";
export async function getAllNotes(req, res) {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching notes", error: err });
  }
}
export async function getNoteById(req, res) {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.status(200).json(note);
  } catch (err) {
    res.status(500).json({ message: "Error fetching note", error: err });
  }
}
export async function createNote(req, res) {
  try {
    const { title, content } = req.body;
    const newNote = new Note({
      title: title,
      content: content,
    });

    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (err) {
    res.status(500).json({ message: "Error creating note", error: err });
  }
}
export async function updateNote(req, res) {
  try {
    const { title, content } = req.body;
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true, runValidators: true },
    );
    if (!updatedNote) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.status(200).json(updatedNote);
  } catch (err) {
    res.status(500).json({ message: "Error updating note", error: err });
  }
}
export async function deleteNote(req, res) {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.status(200).json({
      message: `Note with id : ${req.params.id} has been deleted and the note is ${deletedNote}`,
    });
  } catch (err) {
    res.status(500).json({ message: "Error deleting note", error: err });
  }
}
