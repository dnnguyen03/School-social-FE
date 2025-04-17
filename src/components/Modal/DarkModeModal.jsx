import { useState, useEffect, useRef } from "react";
import { Sun, Moon, X } from "lucide-react";

const DarkModeModal = ({ onClose }) => {
  const [theme, setTheme] = useState("light"); // Mặc định là light
  const modalRef = useRef(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={modalRef}
      className="p-4 bg-white dark:bg-gray-900 rounded-xl shadow-md w-64 relative"
    >
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-black dark:hover:text-white"
        onClick={() => onClose(false)}
      >
        <X className="w-5 h-5" />
      </button>
      <h2 className="text-lg font-semibold text-black dark:text-white">
        Giao diện
      </h2>
      <div className="mt-3 flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-xl">
        <button
          className={`flex-1 py-2 rounded-lg flex items-center justify-center transition-all ${
            theme === "light" ? "bg-white shadow text-black" : "text-gray-400"
          }`}
          onClick={() => toggleTheme("light")}
        >
          <Sun className="w-5 h-5" />
        </button>
        <button
          className={`flex-1 py-2 rounded-lg flex items-center justify-center transition-all ${
            theme === "dark" ? "bg-white shadow text-black" : "text-gray-400"
          }`}
          onClick={() => toggleTheme("dark")}
        >
          <Moon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default DarkModeModal;
