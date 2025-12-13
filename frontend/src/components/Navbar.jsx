import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();

  const navLinkClass = (path) =>
    `text-sm font-medium transition ${
      pathname === path
        ? "text-blue-600"
        : "text-gray-700 hover:text-blue-600"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-gray-50/60 backdrop-blur-sm border-b border-gray-200 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center w-full">

        {/* Left: Brand */}
        <div className="flex items-center">
          <Link to="/" className="text-lg font-semibold tracking-tight text-gray-900">EY FlowBot</Link>
        </div>

        {/* Center: Navigation */}
        <div className="hidden md:flex items-center gap-8 flex-1 justify-center">
          <Link to="/" className={navLinkClass("/")}>Home</Link>
          <Link to="/consultant" className={navLinkClass("/consultant")}>Consultant</Link>
          <Link to="/planner" className={navLinkClass("/planner")}>Planner</Link>
          <Link to="/ecoloan" className={navLinkClass("/ecoloan")}>Ecoloan</Link>
          <Link to="/offers" className={navLinkClass("/offers")}>Offers</Link>
          <Link to="/terms" className={navLinkClass("/terms")}>T&C</Link>
        </div>

        {/* Right: Sign Up */}
        <div className="flex items-center">
          <button className="px-5 py-2 rounded-full bg-blue-600 text-white text-sm font-medium shadow hover:bg-blue-700 transition">
            Sign up
          </button>
        </div>

      </div>
    </nav>
  );
}
