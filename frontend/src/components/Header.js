import React from "react";

const Header = ({
  activeTab,
  setShowCreateModal,
  showNotifications,
  setShowNotifications,
  notifications,
}) => {
  return (
    <div className="bg-white border-b border-gray-200 shadow-md h-20 flex items-center px-6">
      <div className="flex items-center justify-between w-full">
        {/* Left Side */}
        <div className="flex items-center gap-8">
          <h2 className="text-3xl font-bold text-gray-800 capitalize tracking-wide">
            {activeTab}
          </h2>

          {/* Search */}
          <div className="relative">
            {/* <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search tasks, projects..."
              className="pl-10 pr-4 py-2 rounded-xl w-96 text-gray-900 bg-gray-100
                         focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 text-base"
            /> */}
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-6">
          {/* Create Button */}
          {/* <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl 
                       hover:bg-blue-700 flex items-center gap-2 
                       font-medium shadow-md transition-all text-base"
          >
            <Plus size={20} />
            Create
          </button> */}

          {/* Notifications */}
          <div className="relative">
            <button>{/* Notification button here */}</button>
            {/* Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white text-gray-800 rounded-2xl shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-blue-600 text-lg">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="p-4 text-gray-500 text-sm text-center">
                      No new notifications
                    </p>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="p-4 border-b border-gray-200 hover:bg-gray-100 transition"
                      >
                        <p className="text-sm">{notif.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
