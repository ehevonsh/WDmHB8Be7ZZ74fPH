import React from 'react';
import Modal from '../Modal/Modal.js';

const LogOutModal = ({ isOpen, onClose, onLogOut, buttonText }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Log Out</h2>
      <p className="text-gray-600 mb-6">
        Are you sure you want to log out?
      </p>

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
          {buttonText || 'Log Out'}
        </button>
      </div>
    </Modal>
  );
};

export default LogOutModal;