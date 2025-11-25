import { useEffect, useState } from "react";

import { getStaticStrapiContent } from "../../lib/strapi";

import Modal from "../Modal/Modal.js";
import NoStrapiData from "../NoStrapiData/NoStrapiData.js";

const LogOutModal = ({ isOpen, onClose, onLogOut, buttonText }) => {
  const [CMSContent, setCMSContent] = useState(null);

  useEffect(() => {
    let alive = true;
    getStaticStrapiContent("LogOutModal")
      .then((data) => alive && setCMSContent(data))
      .catch(console.error);
    return () => {
      alive = false;
    };
  }, []);

  if (!CMSContent) {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <NoStrapiData />
      </Modal>
    );
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Log Out</h2>
      <p className="text-gray-600 mb-6">{CMSContent.AreYouSureMessage}</p>

      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition"
        >
          Cancel
        </button>
        <button
          onClick={onLogOut}
          className="bg-purple text-white font-semibold px-4 py-2 rounded shadow-md active:translate-y-px"
        >
          {CMSContent.LogOutButtonText}
        </button>
      </div>
    </Modal>
  );
};

export default LogOutModal;
