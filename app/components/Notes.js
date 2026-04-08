"use client";
import { useState, useEffect } from "react";

export default function Notes() {
  const [note, setNote] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("note");
    if (saved) setNote(saved);
  }, []);

  const saveNote = () => {
    localStorage.setItem("note", note);
  };

  return (
    <div className="notes">
      <h3>Notes</h3>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Write notes..."
      />

      <button onClick={saveNote}>Save</button>
    </div>
  );
}