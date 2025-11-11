import { useState } from 'react';
import Modal from '../Modal/Modal.js';

const RegisterModal = ({ isOpen, onClose, onRegister, buttonText, bodyText }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleRegisterClick = () => {
    if (!username.trim()) {
      setError('Please enter a username.');
      return;
    }
    setError('');
    onRegister(username); // Pass the username
    setUsername(''); // Clear input
  };

  // Reset state on close
  const handleClose = () => {
    setUsername('');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Register New Account</h2>
      <p className="text-gray-600 mb-6">
        {bodyText}
      </p>

      <div className="mb-4">
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
          Choose a Username
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="e.g., cool_user_123"
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
          {buttonText || 'Register'}
        </button>
      </div>
    </Modal>
  );
};

export default RegisterModal;