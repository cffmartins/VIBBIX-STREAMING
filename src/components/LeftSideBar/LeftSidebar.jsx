import { NavLink } from "react-router-dom";
import { useState } from "react";
import "./_LeftSidebar.scss";
import {
  CalendarDays,
  House,
  List,
  Star,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Film,
  Tv,
} from "lucide-react";

function LeftSidebar() {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  const toggleCategories = () => {
    setIsCategoriesOpen(!isCategoriesOpen);
  };
  return (
    <div className="left-sidebar">
      <div className="left-sidebar-logo">
        <img src="/logo.png" alt="VIBBIX" />
      </div>
      <div className="left-sidebar-links">
        <h4>MENU</h4>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <House size={16} />
          Home
        </NavLink>

        <div className="dropdown-container">
          <button className="dropdown-trigger" onClick={toggleCategories}>
            <List size={16} />
            Categories
            <span className="dropdown-chevron">
              {isCategoriesOpen ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </span>
          </button>

          {isCategoriesOpen && (
            <div className="dropdown-menu">
              <NavLink
                to="/movies"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <Film size={16} />
                Movies
              </NavLink>
              <NavLink
                to="/series"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <Tv size={16} />
                Series
              </NavLink>
            </div>
          )}
        </div>
        <NavLink
          to="/top-rated"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <Star size={16} />
          Top Rated
        </NavLink>
        <NavLink
          to="/upcoming"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <CalendarDays size={16} />
          Upcoming
        </NavLink>
      </div>
    </div>
  );
}

export default LeftSidebar;
