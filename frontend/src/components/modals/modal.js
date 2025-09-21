export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      // onClick={onClose} // close modal on overlay click
    >
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg"
        // onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        {children}
      </div>
    </div>
  );
}
