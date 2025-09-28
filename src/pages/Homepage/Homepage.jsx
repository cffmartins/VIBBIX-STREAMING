import React, { useContext, useRef, useState } from "react";
// importing api
import { ApiContext } from "../../context/ApiContext";
// importing icons
import { ChevronLeft, ChevronRight, Play, Star, Plus, X } from "lucide-react";
import Button from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";
import "./_Homepage.scss";

function Homepage() {
  const {
    trendingContent,
    popularMovies,
    popularSeries,
    loading,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
  } = useContext(ApiContext);
  const navigate = useNavigate();
  const trendingRef = useRef(null);
  const moviesRef = useRef(null);
  const seriesRef = useRef(null);

  // state for current slide indices
  const [currentTrending, setCurrentTrending] = useState(0);
  const [currentMovies, setCurrentMovies] = useState(0);
  const [currentSeries, setCurrentSeries] = useState(0);

  const navigateTrending = (direction) => {
    if (direction === "left") {
      setCurrentTrending((prev) =>
        prev > 0 ? prev - 1 : trendingContent.length - 1
      );
    } else {
      setCurrentTrending((prev) =>
        prev < trendingContent.length - 1 ? prev + 1 : 0
      );
    }
  };

  const navigateMovies = (direction) => {
    const maxIndex = Math.ceil(popularMovies.length / 3) - 1;
    if (direction === "left") {
      setCurrentMovies((prev) => (prev > 0 ? prev - 1 : maxIndex));
    } else {
      setCurrentMovies((prev) => (prev < maxIndex ? prev + 1 : 0));
    }
  };

  const navigateSeries = (direction) => {
    const maxIndex = Math.ceil(popularSeries.length / 3) - 1;
    if (direction === "left") {
      setCurrentSeries((prev) => (prev > 0 ? prev - 1 : maxIndex));
    } else {
      setCurrentSeries((prev) => (prev < maxIndex ? prev + 1 : 0));
    }
  };

  // const isTablet = window.matchMedia("(max-width: 1024px)").matches;
  // const isMobile = window.matchMedia("(max-width: 768px)").matches;

  if (loading) {
    return (
      <div className="homepage">
        <div className="loading">Loading amazing content...</div>
      </div>
    );
  }

  // function to handle adding to watchlist with error handling
  const handleAddToWatchlist = (item, type) => {
    try {
      addToWatchlist(item, type);
    } catch (error) {
      console.error("Error adding to watchlist:", error);
    }
  };

  return (
    <div className="homepage">
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-slider" ref={trendingRef}>
            {trendingContent.length > 0 && (
              <div className="hero-card">
                <div className="hero-background">
                  <img
                    src={`https://image.tmdb.org/t/p/w1280${trendingContent[currentTrending]?.backdrop_path}`}
                    alt={
                      trendingContent[currentTrending]?.title ||
                      trendingContent[currentTrending]?.name
                    }
                    className="hero-backdrop"
                  />
                  <div className="hero-overlay"></div>
                </div>

                {/* info slider */}
                <div
                  className="hero-top-info"
                  onClick={() => {
                    const item = trendingContent[currentTrending];
                    const mediaType =
                      item.media_type || (item.first_air_date ? "tv" : "movie");
                    navigate(`/${mediaType}/${item.id}`);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <h1 className="hero-title">
                    {trendingContent[currentTrending]?.title ||
                      trendingContent[currentTrending]?.name}
                  </h1>
                  <div className="hero-meta">
                    <span className="hero-rating">
                      <Star size={16} fill="currentColor" />
                      {trendingContent[currentTrending]?.vote_average?.toFixed(
                        1
                      )}
                    </span>
                    <span className="hero-year">
                      {trendingContent[currentTrending]?.release_date?.slice(
                        0,
                        4
                      ) ||
                        trendingContent[currentTrending]?.first_air_date?.slice(
                          0,
                          4
                        )}
                    </span>
                    <span className="hero-genre">Action, Drama</span>
                  </div>
                </div>
                <div className="hero-content"></div>
                {/* slider - bottom controls (desktop layout) */}
                <div className="hero-bottom-controls">
                  <Button
                    variant="watchmore"
                    className="hero-watch-btn"
                    onClick={() => {
                      const item = trendingContent[currentTrending];
                      const mediaType =
                        item.media_type ||
                        (item.first_air_date ? "tv" : "movie");
                      navigate(`/${mediaType}/${item.id}`);
                    }}
                  >
                    <Play size={20} fill="currentColor" />
                    Watch
                  </Button>
                  <div className="hero-indicators">
                    {trendingContent.map((_, index) => (
                      <button
                        key={index}
                        className={`indicator ${
                          index === currentTrending ? "active" : ""
                        }`}
                        onClick={() => setCurrentTrending(index)}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                  <Button
                    variant="watchlist"
                    className="hero-watchlist-btn"
                    onClick={() => {
                      const item = trendingContent[currentTrending];
                      const mediaType =
                        item.media_type ||
                        (item.first_air_date ? "tv" : "movie");
                      const itemId = item.id;
                      const isItemInWatchlist = isInWatchlist(
                        itemId,
                        mediaType
                      );
                      if (isItemInWatchlist) {
                        removeFromWatchlist(itemId, mediaType);
                      } else {
                        addToWatchlist(item, mediaType);
                      }
                    }}
                    aria-label={
                      isInWatchlist(
                        trendingContent[currentTrending]?.id,
                        trendingContent[currentTrending]?.media_type ||
                          (trendingContent[currentTrending]?.first_air_date
                            ? "tv"
                            : "movie")
                      )
                        ? "Remove from watchlist"
                        : "Add to watchlist"
                    }
                  >
                    {isInWatchlist(
                      trendingContent[currentTrending]?.id,
                      trendingContent[currentTrending]?.media_type ||
                        (trendingContent[currentTrending]?.first_air_date
                          ? "tv"
                          : "movie")
                    ) ? (
                      <X size={20} />
                    ) : (
                      <Plus size={20} />
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* hero navigation */}
          <div className="hero-navigation">
            <button
              className="hero-nav-btn prev-btn"
              onClick={() => navigateTrending("left")}
              aria-label="Previous"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className="hero-nav-btn next-btn"
              onClick={() => navigateTrending("right")}
              aria-label="Next"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </section>
      {/* popular movies */}
      <section className="content-section">
        <div className="section-header">
          <h2 className="section-title">Popular Movies</h2>
          <div className="section-controls">
            <button
              className="control-btn"
              onClick={() => navigateMovies("left")}
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className="control-btn"
              onClick={() => navigateMovies("right")}
              aria-label="Scroll right"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        <div className="content-scroll" ref={moviesRef}>
          {popularMovies
            .slice(currentMovies * 3, currentMovies * 3 + 3)
            .map((movie) => (
              <div
                key={movie.id}
                className="content-card"
                onClick={() => navigate(`/movie/${movie.id}`)}
                style={{ cursor: "pointer" }}
              >
                <div className="card-image">
                  <img
                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                    alt={movie.title}
                    className="content-poster"
                  />
                  <div className="content-info">
                    <h4 className="content-title">{movie.title}</h4>
                  </div>
                  <div className="card-overlay">
                    <button
                      className="card-watch-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/movie/${movie.id}`);
                      }}
                      aria-label={`Watch ${movie.title}`}
                    >
                      <Play size={18} color="#fff" fill="#fff" />
                    </button>
                    <button
                      className="card-plus-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        const isItemInWatchlist = isInWatchlist(
                          movie.id,
                          "movie"
                        );
                        if (isItemInWatchlist) {
                          removeFromWatchlist(movie.id, "movie");
                        } else {
                          handleAddToWatchlist(movie, "movie");
                        }
                      }}
                      aria-label={
                        isInWatchlist(movie.id, "movie")
                          ? `Remove ${movie.title} from watchlist`
                          : `Add ${movie.title} to watchlist`
                      }
                    >
                      {isInWatchlist(movie.id, "movie") ? (
                        <X size={18} />
                      ) : (
                        <Plus size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* popular series */}
      <section className="content-section">
        <div className="section-header">
          <h2 className="section-title">Popular Series</h2>
          <div className="section-controls">
            <button
              className="control-btn"
              onClick={() => navigateSeries("left")}
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className="control-btn"
              onClick={() => navigateSeries("right")}
              aria-label="Scroll right"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        <div className="content-scroll" ref={seriesRef}>
          {popularSeries
            .slice(currentSeries * 3, currentSeries * 3 + 3)
            .map((series) => (
              <div
                key={series.id}
                className="content-card"
                onClick={() => navigate(`/tv/${series.id}`)}
                style={{ cursor: "pointer" }}
              >
                <div className="card-image">
                  <img
                    src={`https://image.tmdb.org/t/p/w300${series.poster_path}`}
                    alt={series.name}
                    className="content-poster"
                  />
                  <div className="content-info">
                    <h4 className="content-title">{series.name}</h4>
                  </div>
                  <div className="card-overlay">
                    <button
                      className="card-watch-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/tv/${series.id}`);
                      }}
                      aria-label={`Watch ${series.name}`}
                    >
                      <Play size={18} color="#fff" fill="#fff" />
                    </button>
                    <button
                      className="card-plus-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        const isItemInWatchlist = isInWatchlist(
                          series.id,
                          "tv"
                        );
                        if (isItemInWatchlist) {
                          removeFromWatchlist(series.id, "tv");
                        } else {
                          handleAddToWatchlist(series, "tv");
                        }
                      }}
                      aria-label={
                        isInWatchlist(series.id, "tv")
                          ? `Remove ${series.name} from watchlist`
                          : `Add ${series.name} to watchlist`
                      }
                    >
                      {isInWatchlist(series.id, "tv") ? (
                        <X size={18} />
                      ) : (
                        <Plus size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}

export default Homepage;
