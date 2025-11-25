import { useState, useEffect } from "react";

import { getStaticStrapiContent } from "../../lib/strapi";

import Modal from "../Modal/Modal.js";
import NoStrapiData from "../NoStrapiData/NoStrapiData.js";

const RegisterModal = ({ isOpen, onClose, onRegister }) => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [CMSContent, setCMSContent] = useState(null);

  useEffect(() => {
    let alive = true;
    getStaticStrapiContent("RegisterModal")
      .then((data) => alive && setCMSContent(data))
      .catch(console.error);
    return () => {
      alive = false;
    };
  }, []);

  const handleRegisterClick = () => {
    if (!username.trim()) {
      setError("Please enter a username.");
      return;
    }
    setError("");
    onRegister(username); // Pass the username
    setUsername(""); // Clear input
  };

  // Reset state on close
  const handleClose = () => {
    setUsername("");
    setError("");
    onClose();
  };

  if (!CMSContent) {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <NoStrapiData />
      </Modal>
    );
  }
  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Register New Account
      </h2>
      <p className="text-gray-600 mb-6">{CMSContent.DisclaimerText}</p>

      <div className="mb-4">
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Choose a Username
        </label>
        <input
          type="text"
          id="username"
          value={username}
          minLength={5}
          maxLength={50}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder={CMSContent.TextInputAriaText ?? "e.g., cool_user_123"}
          autoComplete="off"
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={handleClose}
          className="px-4 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleRegisterClick}
          className="bg-purple text-white font-semibold px-4 py-2 rounded shadow-md active:translate-y-px"
        >
          {CMSContent.RegisterButtonText || "Register"}
        </button>
      </div>
    </Modal>
  );
};

export default RegisterModal;
