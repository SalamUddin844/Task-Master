import { X } from "lucide-react";

const ConfirmationModal = ({ 
  isOpen, 
  title = "Confirm Action", 
  message = "Are you sure?", 
  onConfirm, 
  onCancel, 
  confirmText = "Confirm", 
  cancelText = "Cancel" 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 transition-opacity animate-fade-in">
      <div className="bg-white w-full max-w-sm p-6 rounded-2xl shadow-2xl relative transform transition-all scale-95 animate-slide-in">
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition"
        >
          <X size={22} />
        </button>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>

        {/* Message */}
        <p className="text-gray-600 mb-6">{message}</p>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-400 transition"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
