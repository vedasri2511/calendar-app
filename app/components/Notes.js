"use client";
import { useEffect, useState } from "react";

function storageKey(prefix, value) {
  return `${prefix}-${value}`;
}

export default function Notes({ monthKey, monthLabel, selectedRange, selectionLabel }) {
  const [monthNote, setMonthNote] = useState("");
  const [rangeNote, setRangeNote] = useState("");
  const [monthReady, setMonthReady] = useState(false);
  const [rangeReady, setRangeReady] = useState(false);

  const activeRangeKey =
    selectedRange.start && selectedRange.end
      ? `${selectedRange.start.toISOString().slice(0, 10)}_${selectedRange.end.toISOString().slice(0, 10)}`
      : null;

  const monthStorageKey = storageKey("calendar-month-note", monthKey);
  const rangeStorageKey = activeRangeKey ? storageKey("calendar-range-note", activeRangeKey) : null;

  useEffect(() => {
    const savedMonthNote = window.localStorage.getItem(monthStorageKey);
    setMonthNote(savedMonthNote ?? "");
    setMonthReady(true);
  }, [monthStorageKey]);

  useEffect(() => {
    if (!rangeStorageKey) {
      setRangeNote("");
      setRangeReady(true);
      return;
    }

    const savedRangeNote = window.localStorage.getItem(rangeStorageKey);
    setRangeNote(savedRangeNote ?? "");
    setRangeReady(true);
  }, [rangeStorageKey]);

  useEffect(() => {
    if (!monthReady) {
      return;
    }

    window.localStorage.setItem(monthStorageKey, monthNote);
  }, [monthNote, monthReady, monthStorageKey]);

  useEffect(() => {
    if (!rangeReady || !rangeStorageKey) {
      return;
    }

    window.localStorage.setItem(rangeStorageKey, rangeNote);
  }, [rangeNote, rangeReady, rangeStorageKey]);

  return (
    <section className="notes-panel" aria-label="Calendar notes">
      <div className="notes-header">
        <div>
          <p className="calendar-toolbar-label">Notes</p>
          <h3>{monthLabel}</h3>
        </div>
        <span className="notes-chip">Saved locally</span>
      </div>

      <div className="notes-block">
        <label htmlFor="month-note">Month memo</label>
        <textarea
          id="month-note"
          value={monthNote}
          onChange={(event) => setMonthNote(event.target.value)}
          placeholder="Plan reviews, deadlines, reminders, and anything that belongs to the month as a whole."
        />
      </div>

      <div className="notes-block">
        <label htmlFor="range-note">Selected range note</label>
        <div className="notes-context">{selectionLabel}</div>
        <textarea
          id="range-note"
          value={rangeNote}
          onChange={(event) => setRangeNote(event.target.value)}
          placeholder={
            selectedRange.start && selectedRange.end
              ? "Add a note for this date span."
              : "Pick a start and end date to unlock a range note."
          }
          disabled={!rangeStorageKey}
        />
      </div>
    </section>
  );
}
