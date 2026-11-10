import express from "express";
import {
  createNote,
  deleteNote,
  getAllNotes,
  getNoteById,
  updateNote,
} from "../controller/notesController.js";

const router = express.Router();

router.get("/", getAllNotes);
router.get("/:id", getNoteById);
router.post("/create", createNote);
router.put("/update/:id", updateNote);
router.delete("/delete/:id", deleteNote);

export default router;
