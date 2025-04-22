import React, { useState, useEffect, useRef } from 'react';

interface FilterButtonProps<T> {
  options: T[]; // Array of filter options
  selectedOption: T; // Currently selected option
  onFilterChange: (option: T) => void; // Callback when the filter changes
  labelExtractor: (option: T) => string; // Function to extract label for each option
  defaultOption?: T; // Default option for the filter
}

export const FilterButton = <T,>({
  options,
  selectedOption,
  onFilterChange,
  labelExtractor,
  defaultOption,
}: FilterButtonProps<T>) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const hasDefaultOptionBeenSet = useRef(false); // Track if the default option has been applied

  // Set the default option only once on initial render
  useEffect(() => {
    if (defaultOption && !hasDefaultOptionBeenSet.current) {
      onFilterChange(defaultOption);
      hasDefaultOptionBeenSet.current = true; // Mark the default option as applied
    }
  }, [defaultOption, onFilterChange]);

  const handleOptionClick = (option: T) => {
    onFilterChange(option);
    setIsDropdownOpen(false); // Close the dropdown after selecting an option
  };

  return (
    <div className="relative inline-block text-left">
      {/* Button to toggle dropdown */}
      <button
        className="px-4 py-2 bg-brand-blue text-white rounded"
        onClick={() => setIsDropdownOpen((prev) => !prev)}
      >
        Filter Students
      </button>

      {/* Dropdown menu */}
      {isDropdownOpen && (
        <div className="absolute mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg z-10">
          {options.map((option, index) => (
            <button
              key={index}
              className={`block w-full text-left px-4 py-2 text-sm ${
                selectedOption === option
                  ? 'bg-brand-blue text-white'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
              onClick={() => handleOptionClick(option)}
            >
              {labelExtractor(option)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};