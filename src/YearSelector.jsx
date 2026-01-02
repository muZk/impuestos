import React, { useState, useRef, useEffect } from "react";

function getAvailableYears() {
  const currentYear = new Date().getFullYear();
  // Show years from 2020 to next year
  const years = [];
  for (let y = currentYear + 1; y >= 2020; y--) {
    years.push(y);
  }
  return years;
}

export default function YearSelector({ year, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const years = getAvailableYears();

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (selectedYear) => {
    onChange(selectedYear);
    setIsOpen(false);
  };

  return (
    <span className="year-selector" ref={containerRef}>
      <button
        className="year-selector__trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {year}
      </button>
      {isOpen && (
        <ul className="year-selector__dropdown" role="listbox">
          {years.map((y) => (
            <li key={y}>
              <button
                className={`year-selector__option ${y === year ? "year-selector__option--active" : ""}`}
                onClick={() => handleSelect(y)}
                role="option"
                aria-selected={y === year}
              >
                {y}
              </button>
            </li>
          ))}
        </ul>
      )}
    </span>
  );
}
