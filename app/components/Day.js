import { isWithinInterval, isSameDay } from "date-fns";

export default function Day({ day, selectedRange, onSelect }) {
  let className = "day";

  if (selectedRange.start && isSameDay(day, selectedRange.start)) {
    className += " start";
  }

  if (selectedRange.end && isSameDay(day, selectedRange.end)) {
    className += " end";
  }

  if (
    selectedRange.start &&
    selectedRange.end &&
    isWithinInterval(day, {
      start: selectedRange.start,
      end: selectedRange.end,
    })
  ) {
    className += " in-range";
  }

  return (
    <div className={className} onClick={() => onSelect(day)}>
      {day.getDate()}
    </div>
  );
}