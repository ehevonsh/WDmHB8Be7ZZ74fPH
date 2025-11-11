import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

import { getStaticStrapiContent, getStrapiUrl } from "../../lib/strapi";
import { useAuth } from "../../lib/auth";
import RegisterModal from "../../UI-components/RegisterModal/RegisterModal.js";
import LogOutModal from "../../UI-components/LogOutModal/LogOutModal.js";

const linkBase = "px-3 py-2 rounded-lg text-sm font-medium transition";
const linkInactive = "text-white hover:text-white hover:bg-gray";

const Navbar = () => {
  const status = useAuth((s) => s.status);
  const createAccount = useAuth((s) => s.createAccount);
  const logOut = useAuth((s) => s.logOut);
  const logIn = useAuth((s) => s.hydrate);

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLogOutModal, setShowLogOutModal] = useState(false);
  const [hasChosenToLogOut, setHasChosenToLogOut] = useState(false);
  const [CMSContent, setCMSContent] = useState(null);

  useEffect(() => {
    setHasChosenToLogOut(
      sessionStorage.getItem("hasChosenToLogOut") === "true"
    );
  }, [hasChosenToLogOut, status]);

  useEffect(() => {
    let alive = true;
    getStaticStrapiContent("Navbar")
      .then((data) => alive && setCMSContent(data))
      .catch(console.error);
    return () => {
      alive = false;
    };
  }, []);

  const STRAPI_URL = getStrapiUrl();

  // Handlers for modals
  const handleRegister = (username) => {
    // The modal now passes the username
    if (username) {
      console.log(username);
      createAccount(username);
      setShowRegisterModal(false);
    }
  };

  const handleLogOut = () => {
    logOut();
    setShowLogOutModal(false);
  };

  if (!CMSContent) return null;
  return (
    <header className="bg-black">
      <div className="gridBox py-3 grid grid-cols-[auto,1fr,auto] items-center gap-6">
        <NavLink to="/" end className="flex items-center gap-2 text-white">
          <img
            src={`${STRAPI_URL}${CMSContent.Logo.url}`}
            alt="Logo"
            className="w-12 h-12 rounded-full"
            fetchPriority="high"
          />
        </NavLink>
        <nav className="flex gap-3 items-center">
          {CMSContent.NavigationMenu.map((link, i) => (
            <NavLink
              key={i}
              to={link.LinkUrl}
              end
              className={`${linkBase} ${linkInactive}`}
            >
              {link.Text}
            </NavLink>
          ))}
        </nav>

        {(status === "idle" || status === "error") && !hasChosenToLogOut && (
          <button
            onClick={() => setShowRegisterModal(true)} // Open modal
            className="bg-purple text-white font-semibold px-4 py-2 rounded shadow-md active:translate-y-px"
          >
            {CMSContent.RegisterButtonText}
          </button>
        )}

        {status === "loggedIn" && !hasChosenToLogOut && (
          <button
            onClick={() => setShowLogOutModal(true)} // Open modal
            className="bg-purple text-white font-semibold px-4 py-2 rounded shadow-md active:translate-y-px"
          >
            {CMSContent.LogOutButtonText}
          </button>
        )}

        {status === "anonymous" && hasChosenToLogOut && (
          <button
            onClick={() => logIn(true)}
            className="bg-purple text-white font-semibold px-4 py-2 rounded shadow-md active:translate-y-px"
          >
            {CMSContent.SignInButtonText}
          </button>
        )}
      </div>

      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onRegister={handleRegister}
        buttonText={CMSContent.RegisterButtonText}
        bodyText="We will generate You an account based off Your browsers data. By registering You grant us permission to analyze Your browser. In the future the site will automatically log You in."
      />

      <LogOutModal
        isOpen={showLogOutModal}
        // onClose={() => setShowLogOutModal(false)}
        onLogOut={handleLogOut}
        buttonText={CMSContent.LogOutButtonText}
      />
    </header>
  );
};

export default Navbar;
