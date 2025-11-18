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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    setIsMenuOpen(false);
  };

  const handleLinkClick = () => setIsMenuOpen(false);

  const renderAuthButtons = (extraClasses = "") => {
    if ((status === "idle" || status === "error") && !hasChosenToLogOut) {
      return (
        <button
          onClick={() => setShowRegisterModal(true)} // Open modal
          className={`bg-purple text-white font-semibold px-4 py-2 rounded shadow-md active:translate-y-px ${extraClasses}`}
        >
          {CMSContent.RegisterButtonText}
        </button>
      );
    }

    if (status === "loggedIn" && !hasChosenToLogOut) {
      return (
        <button
          onClick={() => setShowLogOutModal(true)} // Open modal
          className={`bg-purple text-white font-semibold px-4 py-2 rounded shadow-md active:translate-y-px ${extraClasses}`}
        >
          {CMSContent.LogOutButtonText}
        </button>
      );
    }

    if (status === "anonymous" && hasChosenToLogOut) {
      return (
        <button
          onClick={() => logIn(true)}
          className={`bg-purple text-white font-semibold px-4 py-2 rounded shadow-md active:translate-y-px ${extraClasses}`}
        >
          {CMSContent.SignInButtonText}
        </button>
      );
    }
    return null;
  };

  if (!CMSContent) return null;
  return (
    <header className="bg-black">
      <div className="gridBox py-3 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-3">
          <NavLink to="/" end className="flex items-center gap-2 text-white">
            <img
              src={`${STRAPI_URL}${CMSContent.Logo.url}`}
              alt="Logo"
              className="w-12 h-12 rounded-full"
              fetchPriority="high"
            />
          </NavLink>
          <button
            type="button"
            className="text-white border border-white/50 rounded px-3 py-2 text-sm md:hidden"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? "Close" : "Menu"}
          </button>
        </div>

        <nav className="hidden md:flex gap-3 items-center flex-1">
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

        <div className="hidden md:flex items-center gap-3">
          {renderAuthButtons()}
        </div>

        {isMenuOpen && (
          <div className="w-full flex flex-col gap-3 md:hidden">
            <nav className="flex flex-col gap-2">
              {CMSContent.NavigationMenu.map((link, i) => (
                <NavLink
                  key={i}
                  to={link.LinkUrl}
                  end
                  onClick={handleLinkClick}
                  className={`${linkBase} ${linkInactive} w-full text-left`}
                >
                  {link.Text}
                </NavLink>
              ))}
            </nav>
            <div className="flex flex-col gap-2">
              {renderAuthButtons("w-full text-center")}
            </div>
          </div>
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
        onClose={() => setShowLogOutModal(false)}
        onLogOut={handleLogOut}
        buttonText={CMSContent.LogOutButtonText}
      />
    </header>
  );
};

export default Navbar;
