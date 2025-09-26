import { useContext, useState, useRef } from "react";
import { ApiContext } from "../../context/ApiContext.jsx";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./_SeriesPage.scss";

function SeriesPage() {
  const { seriesGenres, loading, fetchSeriesByGenre } = useContext(ApiContext);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [currentGenre, setCurrentGenre] = useState(0);
  const [genreShows, setGenreShows] = useState([]);
  const [loadingShows, setLoadingShows] = useState(false);
  const genresRef = useRef(null);
  const navigate = useNavigate();

  const navigateGenres = (direction) => {
    const maxIndex = Math.ceil(seriesGenres.length / 3) - 1;
    if (direction === "left") {
      setCurrentGenre((prev) => (prev > 0 ? prev - 1 : maxIndex));
    } else {
      setCurrentGenre((prev) => (prev < maxIndex ? prev + 1 : 0));
    }
  };

  const handleGenreClick = async (genreId) => {
    if (selectedGenre === genreId) {
      setSelectedGenre(null);
      setGenreShows([]);
    } else {
      setSelectedGenre(genreId);
      setLoadingShows(true);
      try {
        const shows = await fetchSeriesByGenre(genreId);
        setGenreShows(shows);
      } catch (error) {
        console.error("Error loading TV shows:", error);
      } finally {
        setLoadingShows(false);
      }
    }
  };

  const handleShowClick = (showId) => {
    navigate(`/tv/${showId}`);
  };

  if (loading) {
    return (
      <div className="series-page">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="series-page">
      <div className="genres-section">
        <div className="container">
          <div className="categories-header">
            <div className="categories-title">
              <h2>Categories</h2>
            </div>

            <div className="navigation-controls">
              <button
                className="control-btn"
                onClick={() => navigateGenres("left")}
                aria-label="Scroll left"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                className="control-btn"
                onClick={() => navigateGenres("right")}
                aria-label="Scroll right"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="content-scroll" ref={genresRef}>
            {seriesGenres
              .slice(currentGenre * 3, currentGenre * 3 + 3)
              .map((genre) => (
                <div
                  key={genre.id}
                  className={`genre-card ${
                    selectedGenre === genre.id ? "active" : ""
                  }`}
                  onClick={() => handleGenreClick(genre.id)}
                >
                  <h3>{genre.name}</h3>
                </div>
              ))}
          </div>
        </div>
      </div>

      {selectedGenre && (
        <div className="series-section">
          <h3 className="series-title">
            {seriesGenres.find((g) => g.id === selectedGenre)?.name} Series
          </h3>

          {loadingShows ? (
            <div className="loading-series">Loading series...</div>
          ) : (
            <div className="series-grid">
              {genreShows.map((show) => (
                <div
                  key={show.id}
                  className="series-card"
                  onClick={() => handleShowClick(show.id)}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w300${show.poster_path}`}
                    alt={show.name}
                    className="series-poster"
                  />
                  <div className="card-overlay">
                    <h4 className="card-title">{show.name}</h4>
                    <div className="card-rating">
                      <Star size={16} fill="currentColor" />
                      <span>{show.vote_average?.toFixed(1)}</span>
                    </div>
                    <div className="card-info">
                      <p>{show.first_air_date?.slice(0, 4)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SeriesPage;
