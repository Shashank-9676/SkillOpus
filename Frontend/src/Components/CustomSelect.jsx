import Select from "react-select";

export default function CustomSelect({
  label,
  value,
  onChange,
  options = [],
  loading = false,
  Color,
}) {
  const selectedOption = options.find((opt) => opt.value === value) || null;

  const customStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor:
        Color === "blue" ? "rgba(255, 255, 255, 0.1)" : "#f9fafb", // Match inputs
      borderColor: state.isFocused
        ? "#3b82f6"
        : Color === "blue"
          ? "rgba(255, 255, 255, 0.2)"
          : "#e5e7eb",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(59, 130, 246, 0.5)" : "none",
      borderRadius: "0.75rem", // rounded-xl
      padding: "6px",
      transition: "all 0.3s",
      cursor: "pointer",
      "&:hover": {
        borderColor: "#3b82f6",
      },
      minHeight: "52px", // Match input height
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "white",
      color: "#1f2937",
      borderRadius: "0.75rem",
      overflow: "hidden",
      boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      zIndex: 100,
    }),
    option: (base, { isFocused, isSelected }) => ({
      ...base,
      backgroundColor: isSelected ? "#3b82f6" : isFocused ? "#eff6ff" : "white",
      color: isSelected ? "white" : "#1f2937",
      cursor: "pointer",
      padding: "10px 12px",
    }),
    singleValue: (base) => ({
      ...base,
      color: Color === "blue" ? "white" : "#1f2937",
      fontWeight: 500,
    }),
    placeholder: (base) => ({
      ...base,
      color: Color === "blue" ? "rgba(255, 255, 255, 0.6)" : "#9ca3af",
    }),
    input: (base) => ({
      ...base,
      color: Color === "blue" ? "white" : "#1f2937",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: Color === "blue" ? "rgba(255, 255, 255, 0.6)" : "#9ca3af",
      "&:hover": {
        color: Color === "blue" ? "white" : "#6b7280",
      },
    }),
  };

  return (
    <Select
      required
      isLoading={loading}
      placeholder={label}
      styles={customStyles}
      options={options}
      value={selectedOption}
      onChange={(selected) => onChange(selected ? selected.value : "")}
      isSearchable
      isClearable
      components={{ IndicatorSeparator: () => null }}
    />
  );
}
