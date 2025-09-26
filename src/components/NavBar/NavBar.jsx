import { useState, useContext, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ApiContext } from "../../context/ApiContext.jsx";
import "./_NavBar.scss";
import { Compass, Film, Search, Tv, Star } from "lucide-react";
import Button from "../Button/Button.jsx";

function NavBar() {
  const { searchMulti } = useContext(ApiContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const performSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setLoading(true);
    try {
      const results = await searchMulti(query.trim());
      setSearchResults(results.slice(0, 8));
      setShowResults(true);
    } catch (error) {
      console.error("Error searching:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Debounce search
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  };

  const handleResultClick = (content) => {
    if (content.media_type === "movie") {
      navigate(`/movie/${content.id}`);
    } else if (content.media_type === "tv") {
      navigate(`/series/${content.id}`);
    }
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
  };

  const getContentTitle = (content) => {
    return content.title || content.name;
  };

  const getContentDate = (content) => {
    const date = content.release_date || content.first_air_date;
    return date ? date.slice(0, 4) : "";
  };

  const getContentType = (content) => {
    if (content.media_type === "movie") return "Movie";
    if (content.media_type === "tv") return "TV Show";
    return "Unknown";
  };

  return (
    <nav>
      <div className="navbar">
        <div className="nav-links">
          <div className="nav-group">
            <NavLink to="/">
              {({ isActive }) => (
                <Button variant="navbar" className={isActive ? "active" : ""}>
                  <Compass />
                  Discover
                </Button>
              )}
            </NavLink>

            <NavLink to="/movies">
              {({ isActive }) => (
                <Button variant="navbar" className={isActive ? "active" : ""}>
                  <Film />
                  Movies
                </Button>
              )}
            </NavLink>

            <NavLink to="/series">
              {({ isActive }) => (
                <Button variant="navbar" className={isActive ? "active" : ""}>
                  <Tv />
                  Series
                </Button>
              )}
            </NavLink>
          </div>

          <div className="search-group" ref={searchRef}>
            <div className="input-search-wrapper">
              <span className="search-icon">
                <Search size={18} />
              </span>
              <input
                type="text"
                placeholder="Search movies and TV shows..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery && setShowResults(true)}
              />
            </div>

            {showResults && (
              <div className="search-results-dropdown">
                {loading ? (
                  <div className="search-result-item loading">
                    <span>Searching...</span>
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((content) => (
                    <div
                      key={`${content.media_type}-${content.id}`}
                      className="search-result-item"
                      onClick={() => handleResultClick(content)}
                    >
                      <div className="result-poster">
                        <img
                          src={
                            content.poster_path
                              ? `https://image.tmdb.org/t/p/w92${content.poster_path}`
                              : "/avatar.jpg"
                          }
                          alt={getContentTitle(content)}
                        />
                      </div>
                      <div className="result-info">
                        <div className="result-title">
                          {getContentTitle(content)}
                        </div>
                        <div className="result-details">
                          <span className="result-year">
                            {getContentDate(content)}
                          </span>
                          <span className="result-type">
                            {getContentType(content)}
                          </span>
                          <div className="result-rating">
                            <Star size={12} fill="currentColor" />
                            <span>
                              {content.vote_average?.toFixed(1) || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="search-result-item no-results">
                    <span>No results found</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
