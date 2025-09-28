import React, { useContext, useRef } from "react";
import { ChevronLeft, ChevronRight, X, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ApiContext } from "../../context/ApiContext.jsx";
import "./_Watchlist.scss";

// reusable Watchlist component
function Watchlist({ showTitle = true, maxItems = null }) {
  const { watchlistMovies, watchlistSeries, loading, removeFromWatchlist } =
    useContext(ApiContext);
  const moviesRef = useRef(null);
  const seriesRef = useRef(null);
  const navigate = useNavigate();

  // limit number of items shown if needed
  const displayMovies = maxItems
    ? watchlistMovies.slice(0, maxItems)
    : watchlistMovies;
  const displaySeries = maxItems
    ? watchlistSeries.slice(0, maxItems)
    : watchlistSeries;

  const scrollLeft = (ref) => {
    ref.current?.scrollBy({ left: -150, behavior: "smooth" });
  };

  const scrollRight = (ref) => {
    ref.current?.scrollBy({ left: 150, behavior: "smooth" });
  };

  return (
    <div className="watchlist-component">
      {showTitle && <h3 className="watchlist-title">WATCHLIST</h3>}
      <div className="watchlist-header">
        <h5>Movies</h5>
        <div className="watchlist-controls">
          <button
            className="controls-btn"
            onClick={() => scrollLeft(moviesRef)}
            aria-label="Scroll left"
          >
            <ChevronLeft />
          </button>
          <button
            className="controls-btn"
            onClick={() => scrollRight(moviesRef)}
            aria-label="Scroll right"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
      <div className="watchlist-scroll" ref={moviesRef}>
        {loading ? (
          <div className="loading-message">Loading movies...</div>
        ) : displayMovies.length > 0 ? (
          displayMovies.map((item) => (
            <div
              key={item.id}
              className="watchlist-card"
              onClick={() => navigate(`/movie/${item.id}`)}
              style={{ cursor: "pointer" }}
            >
              <div className="watchlist-content">
                <div className="watchlist-image-container">
                  <img
                    src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                    alt={item.title}
                    className="watchlist-img"
                  />
                  <div className="watchlist-overlay">
                    <div className="watchlist-info">
                      <h5 className="watchlist-movie-title">{item.title}</h5>
                    </div>
                    <div className="watchlist-bottom">
                      <button
                        className="watch-btn"
                        aria-label={`Watch ${item.title}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/movie/${item.id}`);
                        }}
                      >
                        <Play size={20} color="#fff" fill="#fff" />
                      </button>
                      <button
                        className="add-remove-btn"
                        aria-label="Remover da watchlist"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromWatchlist(item.id, "movie");
                        }}
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-content">No movies in your watchlist</div>
        )}
      </div>
      <div className="watchlist-header">
        <h5>Series</h5>
        <div className="watchlist-controls">
          <button
            className="controls-btn"
            onClick={() => scrollLeft(seriesRef)}
            aria-label="Scroll left"
          >
            <ChevronLeft />
          </button>
          <button
            className="controls-btn"
            onClick={() => scrollRight(seriesRef)}
            aria-label="Scroll right"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
      <div className="watchlist-scroll" ref={seriesRef}>
        {loading ? (
          <div className="loading-message">Loading series...</div>
        ) : displaySeries.length > 0 ? (
          displaySeries.map((item) => (
            <div
              key={item.id}
              className="watchlist-card"
              onClick={() => navigate(`/tv/${item.id}`)}
              style={{ cursor: "pointer" }}
            >
              <div className="watchlist-content">
                <div className="watchlist-image-container">
                  <img
                    src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                    alt={item.name}
                    className="watchlist-img"
                  />
                  <div className="watchlist-overlay">
                    <div className="watchlist-info">
                      <h5 className="watchlist-movie-title">{item.name}</h5>
                    </div>
                    <div className="watchlist-bottom">
                      <button
                        className="watch-btn"
                        aria-label={`Watch ${item.name}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/tv/${item.id}`);
                        }}
                      >
                        <Play size={20} color="#fff" fill="#fff" />
                      </button>
                      <button
                        className="add-remove-btn"
                        aria-label="Remover da watchlist"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromWatchlist(item.id, "tv");
                        }}
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-content">No series in your watchlist</div>
        )}
      </div>
    </div>
  );
}

export default Watchlist;
