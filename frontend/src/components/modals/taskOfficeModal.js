
const Modal = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="bg-white rounded-2xl p-6 w-full max-w-xl relative shadow-2xl pointer-events-auto">
        {/* Modal content */}
        {children}
      </div>
    </div>
  );
};

export default Modal;
