import { isWithinInterval } from "date-fns";

export default function Day({
  day,
  selectedRange,
  onSelect,
  isSelectedStart,
  isSelectedEnd,
  isInCurrentMonth,
  isToday,
}) {
  const isInRange =
    selectedRange.start &&
    selectedRange.end &&
    isWithinInterval(day, {
      start: selectedRange.start,
      end: selectedRange.end,
    });

  const className = [
    "day-cell",
    isSelectedStart ? "is-start" : "",
    isSelectedEnd ? "is-end" : "",
    isInRange ? "is-range" : "",
    isInCurrentMonth ? "" : "is-muted",
    isToday ? "is-today" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const selectionState = isSelectedStart
    ? "start date"
    : isSelectedEnd
      ? "end date"
      : isInRange
        ? "in selected range"
        : "available date";

  return (
    <button
      type="button"
      className={className}
      onClick={() => onSelect(day)}
      aria-label={`${day.toDateString()}, ${selectionState}`}
      aria-pressed={isSelectedStart || isSelectedEnd || isInRange}
    >
      <span className="day-number">{day.getDate()}</span>
      {isToday ? <span className="day-pill">Today</span> : null}
    </button>
  );
}