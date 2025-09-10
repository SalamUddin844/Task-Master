
export default function CreateModal({ isOpen, onClose, onSubmit }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg font-sans">
        {/* Heading */}
        <h2 className="text-lg md:text-xl font-semibold mb-4">Create New Item</h2>

        {/* Title Input */}
        <input
          type="text"
          placeholder="Enter title"
          className="w-full mb-3 px-3 py-2 border border-gray-300 rounded text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Description */}
        <textarea
          placeholder="Enter description"
          className="w-full mb-3 px-3 py-2 border border-gray-300 rounded text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={4}
        ></textarea>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-base transition"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-base transition"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
