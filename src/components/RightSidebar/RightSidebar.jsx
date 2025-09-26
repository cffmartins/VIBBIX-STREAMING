import React, { useState } from "react";
import "./_Rightsidebar.scss";
import { Bell, ChevronDown, Settings, LogOut } from "lucide-react";
import Avatar from "@mui/material/Avatar";
import Watchlist from "../Watchlist/Watchlist";

function RightSidebar() {
  // state for dropdown and notifications
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // mock notifications data
  const notifications = [
    {
      id: 1,
      message: "You have a new movie recommendation!",
      time: "Now",
    },
    {
      id: 2,
      message: "New movie releases this week",
      time: "2 min ago",
    },

    {
      id: 3,
      message: "Movie recommendation based on your watchlist",
      time: "1 hour ago",
    },
    {
      id: 4,
      message: "Your friend liked a movie you recommended",
      time: "3 hours ago",
    },
    {
      id: 5,
      message: "Don't miss out on our weekend specials!",
      time: "Yesterday",
    },
  ];

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowProfileDropdown(false);
  };

  const toggleProfileDropdown = (e) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    setShowProfileDropdown((prev) => {
      console.log("Abrindo dropdown do perfil:", !prev);
      return !prev;
    });
    setShowNotifications(false);
  };

  const clearNotifications = () => {
    setShowNotifications(false);
  };

  return (
    <div className="right-sidebar">
      <div className="top-section">
        <div className="icon-bell" onClick={toggleNotifications}>
          <Bell size={24} />
          {showNotifications && (
            <div className="notifications-dropdown">
              <div className="notifications-header">
                <h4>Notifications</h4>
                <button onClick={clearNotifications} className="clear-btn">
                  Clear All
                </button>
              </div>
              <div className="notifications-list">
                {notifications.map((notification) => (
                  <div key={notification.id} className="notification-item">
                    <p className="notification-message">
                      {notification.message}
                    </p>
                    <span className="notification-time">
                      {notification.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="user-profile">
          <ChevronDown
            className="dropdown-icon"
            size={18}
            onClick={toggleProfileDropdown}
          />
          {showProfileDropdown && (
            <div className="profile-dropdown">
              <div className="dropdown-item">My Profile</div>
              <div className="dropdown-item">Subscription</div>
              <div className="dropdown-item">
                <span
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <Settings size={16} /> Settings
                </span>
              </div>
              <div className="dropdown-item">
                <span
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <LogOut size={16} /> Logout
                </span>
              </div>
            </div>
          )}
          <h5>Travis</h5>

          <Avatar
            alt="Travis Howard"
            src="../public/avatar.jpg"
            sx={{ width: 80, height: 80 }}
          />
        </div>
      </div>

      <div className="middle-section">
        <Watchlist showTitle={true} />
      </div>
    </div>
  );
}

export default RightSidebar;
