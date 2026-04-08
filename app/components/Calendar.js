"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  differenceInCalendarDays,
} from "date-fns";
import Day from "./Day";
import Notes from "./Notes";
import "../styles/calendar.css";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const MONTH_BACKGROUNDS = [
  {
    title: "Taj Mahal Dawn",
    subtitle: "Agra's marble silhouette at sunrise sets a serene tone for the month.",
    image: "/months/january.jpg",
    tint: "#d9b08c",
    glow: "rgba(194, 120, 84, 0.24)",
    position: "center center",
  },
  {
    title: "Varanasi Ghats",
    subtitle: "Riverside life, ritual lamps, and layered history on the Ganges.",
    image: "/months/february.jpg",
    tint: "#c58f5c",
    glow: "rgba(165, 105, 57, 0.24)",
    position: "center center",
  },
  {
    title: "Jaipur Royal Pink",
    subtitle: "Palaces, arcades, and sandstone symmetry from the Pink City.",
    image: "/months/march.jpg",
    tint: "#d48a8a",
    glow: "rgba(177, 92, 92, 0.24)",
    position: "center center",
  },
  {
    title: "Hampi Stone Ruins",
    subtitle: "Ancient temple fragments and boulder landscapes with quiet drama.",
    image: "/months/april.jpg",
    tint: "#b8895a",
    glow: "rgba(135, 91, 45, 0.22)",
    position: "center center",
  },
  {
    title: "Kerala Backwaters",
    subtitle: "Palm-lined waterways and houseboats bring slower, softer motion.",
    image: "/months/may.jpg",
    tint: "#6ea58d",
    glow: "rgba(55, 110, 93, 0.22)",
    position: "center center",
  },
  {
    title: "Golden Temple Glow",
    subtitle: "A warm, reflective waterline and the quiet dignity of Amritsar.",
    image: "/months/june.jpg",
    tint: "#d9b66a",
    glow: "rgba(176, 129, 45, 0.22)",
    position: "center center",
  },
  {
    title: "Konark Carvings",
    subtitle: "Stone wheels and sculpted reliefs from Odisha's Sun Temple heritage.",
    image: "/months/july.jpg",
    tint: "#c7a06b",
    glow: "rgba(143, 97, 50, 0.22)",
    position: "center center",
  },
  {
    title: "Mysore Palace",
    subtitle: "Ornate domes and ceremonial grandeur from Karnataka's royal legacy.",
    image: "/months/august.jpg",
    tint: "#c0a4d6",
    glow: "rgba(108, 77, 140, 0.22)",
    position: "center center",
  },
  {
    title: "Udaipur Lakes",
    subtitle: "Water reflections and palace edges with a calm, cinematic rhythm.",
    image: "/months/september.jpg",
    tint: "#86b5d7",
    glow: "rgba(60, 108, 146, 0.22)",
    position: "center center",
  },
  {
    title: "Goa Heritage",
    subtitle: "Colonial facades, coastal light, and a softer tropical palette.",
    image: "/months/october.jpg",
    tint: "#d5a08a",
    glow: "rgba(162, 105, 80, 0.22)",
    position: "center center",
  },
  {
    title: "Rann of Kutch",
    subtitle: "A wide salt desert horizon paired with craft and color traditions.",
    image: "/months/november.jpg",
    tint: "#d1b7a0",
    glow: "rgba(161, 121, 94, 0.22)",
    position: "center center",
  },
  {
    title: "Kolkata Tram Light",
    subtitle: "Old-world streets, layered urban memory, and a grounded civic mood.",
    image: "/months/december.jpg",
    tint: "#aab3d9",
    glow: "rgba(75, 86, 133, 0.22)",
    position: "center center",
  },
];

function buildRangeLabel(start, end) {
  if (!start && !end) {
    return "Pick a start date and an end date.";
  }

  if (start && !end) {
    return `${format(start, "EEE, MMM d")} • choose an end date`;
  }

  return `${format(start, "MMM d")} → ${format(end, "MMM d, yyyy")}`;
}

export default function Calendar() {
  const [viewMonth, setViewMonth] = useState(new Date());
  const [isTurning, setIsTurning] = useState(false);
  const [turnDirection, setTurnDirection] = useState("next");
  const [selectedRange, setSelectedRange] = useState({
    start: null,
    end: null,
  });
  const turnTimersRef = useRef({ enter: null, exit: null });

  const background = MONTH_BACKGROUNDS[viewMonth.getMonth() % MONTH_BACKGROUNDS.length];

  const monthStart = startOfMonth(viewMonth);
  const monthEnd = endOfMonth(viewMonth);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const selectedCount = useMemo(() => {
    if (!selectedRange.start || !selectedRange.end) {
      return selectedRange.start ? 1 : 0;
    }

    return differenceInCalendarDays(selectedRange.end, selectedRange.start) + 1;
  }, [selectedRange.end, selectedRange.start]);

  const selectionLabel = buildRangeLabel(selectedRange.start, selectedRange.end);

  useEffect(() => {
    return () => {
      window.clearTimeout(turnTimersRef.current.enter);
      window.clearTimeout(turnTimersRef.current.exit);
    };
  }, []);

  const handleSelect = (day) => {
    if (!selectedRange.start || selectedRange.end) {
      setSelectedRange({ start: day, end: null });
      return;
    }

    if (isSameDay(day, selectedRange.start)) {
      setSelectedRange({ start: day, end: null });
      return;
    }

    if (day < selectedRange.start) {
      setSelectedRange({ start: day, end: selectedRange.start });
      return;
    }

    setSelectedRange({ ...selectedRange, end: day });
  };

  const jumpMonth = (offset) => {
    window.clearTimeout(turnTimersRef.current.enter);
    window.clearTimeout(turnTimersRef.current.exit);

    setTurnDirection(offset > 0 ? "next" : "prev");
    setIsTurning(false);

    turnTimersRef.current.enter = window.setTimeout(() => {
      setViewMonth((current) => addMonths(current, offset));
      setIsTurning(true);

      turnTimersRef.current.exit = window.setTimeout(() => {
        setIsTurning(false);
      }, 760);
    }, 16);
  };

  const resetSelection = () => {
    setSelectedRange({ start: null, end: null });
  };

  return (
    <section
      className="calendar-shell"
      style={{
        "--calendar-bg-image": `url("${background.image}")`,
        "--calendar-bg-position": background.position,
        "--hero-tint": background.tint,
        "--hero-glow": background.glow,
      }}
    >
      <div className={`calendar-card${isTurning ? ` is-turning is-${turnDirection}` : ""}`}>
        <div className="calendar-rings" aria-hidden="true">
          {Array.from({ length: 14 }).map((_, index) => (
            <span key={index} />
          ))}
        </div>

        <div className="calendar-layout">
          <main className="calendar-content">
            <div className="calendar-toolbar">
              <div>
                <p className="calendar-toolbar-label">Current sheet</p>
                <h2>{format(viewMonth, "MMMM yyyy")}</h2>
              </div>

              <div className="calendar-actions">
                <button type="button" onClick={() => jumpMonth(-1)} className="calendar-nav-button">
                  ←
                </button>
                <button type="button" onClick={resetSelection} className="calendar-secondary-button">
                  Clear range
                </button>
                <button type="button" onClick={() => jumpMonth(1)} className="calendar-nav-button">
                  →
                </button>
              </div>
            </div>

            <div className="calendar-summary">
              <article>
                <span>Selection</span>
                <strong>{selectionLabel}</strong>
              </article>
              <article>
                <span>Days selected</span>
                <strong>{selectedCount || "—"}</strong>
              </article>
              <article>
                <span>Today</span>
                <strong>{format(new Date(), "MMM d")}</strong>
              </article>
            </div>

            <div className="weekday-row" aria-hidden="true">
              {WEEKDAYS.map((weekday) => (
                <span key={weekday}>{weekday}</span>
              ))}
            </div>

            <div className="calendar-grid" role="grid" aria-label={format(viewMonth, "MMMM yyyy") + " calendar"}>
              {days.map((day) => (
                <Day
                  key={day.toISOString()}
                  day={day}
                  selectedRange={selectedRange}
                  onSelect={handleSelect}
                  isSelectedStart={selectedRange.start ? isSameDay(day, selectedRange.start) : false}
                  isSelectedEnd={selectedRange.end ? isSameDay(day, selectedRange.end) : false}
                  isInCurrentMonth={isSameMonth(day, viewMonth)}
                  isToday={isToday(day)}
                />
              ))}
            </div>
          </main>

          <aside className="calendar-sidebar">
            <Notes
              monthKey={format(viewMonth, "yyyy-MM")}
              monthLabel={format(viewMonth, "MMMM yyyy")}
              selectedRange={selectedRange}
              selectionLabel={selectionLabel}
            />
          </aside>
        </div>
      </div>
    </section>
  );
}