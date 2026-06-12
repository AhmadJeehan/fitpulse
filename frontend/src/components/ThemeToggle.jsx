export default function ThemeToggle({ theme, toggle }) {
  return (
    <button
      onClick={toggle}
      className="relative w-14 h-7 bg-gray-300 dark:bg-gray-600 rounded-full transition-colors duration-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      aria-label="Toggle dark mode"
    >
      <div
        className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-500 flex items-center justify-center text-sm ${
          theme === 'dark' ? 'translate-x-7' : 'translate-x-0'
        }`}
      >
        {theme === 'dark' ? '🌙' : '☀️'}
      </div>
    </button>
  );
}
