import { NavLink } from "react-router-dom";

const linkBase = "px-3 py-2 rounded-lg text-sm font-medium transition";
const linkInactive = "text-white hover:text-white hover:bg-gray";
const Navbar = () => {
  return (
    <header className="bg-black border-b border-dashed border-purple-400/50">
      <div className="max-w-5xl mx-auto px-5 py-3 grid grid-cols-[auto,1fr,auto] items-center gap-6">
        <NavLink to="/" end className="flex items-center gap-2 text-white">
          <img src="/logo192.png" alt="Logo" className="w-9 h-9 rounded-full" />
        </NavLink>
        <nav className="flex gap-3 items-center">
          <NavLink to="/about-us" end className={`${linkBase} ${linkInactive}`}>
            About us
          </NavLink>
          <NavLink className={`${linkBase} ${linkInactive}`} to="/">
            Posts
          </NavLink>
          <NavLink to="/about-us" end className={`${linkBase} ${linkInactive}`}>
            My profile
          </NavLink>
          <NavLink
            to="/about-us"
            end
            onClick={(e) => e.preventDefault()}
            className={`${linkBase} ${linkInactive}`}
          >
            Users
          </NavLink>
        </nav>
        <button
          onClick={() => alert("Register clicked (stub)")}
          className="bg-purple text-white font-semibold px-4 py-2 rounded shadow-md active:translate-y-px"
        >
          Register
        </button>
      </div>
    </header>
  );
};

export default Navbar;
