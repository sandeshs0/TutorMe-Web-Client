const Modal = ({ onClose, children }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-md">
          {children}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-white"
          >
            ✕
          </button>
        </div>
      </div>
    );
  };
  
  export default Modal;
  