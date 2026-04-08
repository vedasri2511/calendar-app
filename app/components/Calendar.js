"use client";
import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from "date-fns";
import Day from "./Day";
import Notes from "./Notes";
import "../styles/calendar.css";

export default function Calendar() {
  const [selectedRange, setSelectedRange] = useState({
    start: null,
    end: null,
  });

  const today = new Date();
  const start = startOfMonth(today);
  const end = endOfMonth(today);
  const days = eachDayOfInterval({ start, end });

  const handleSelect = (day) => {
    if (!selectedRange.start || selectedRange.end) {
      setSelectedRange({ start: day, end: null });
    } else {
      setSelectedRange({ ...selectedRange, end: day });
    }
  };

  return (
    <div className="calendar-container">
      <div className="calendar-left">
        <img
          src="https://source.unsplash.com/600x400/?nature"
          className="hero-img"
        />

        <h2>{format(today, "MMMM yyyy")}</h2>

        <div className="grid">
          {days.map((day, i) => (
            <Day
              key={i}
              day={day}
              selectedRange={selectedRange}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </div>

      <Notes selectedRange={selectedRange} />
    </div>
  );
}