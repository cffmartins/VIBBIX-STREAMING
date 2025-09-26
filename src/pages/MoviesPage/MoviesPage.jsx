import { useContext, useState, useRef } from "react";
import { ApiContext } from "../../context/ApiContext.jsx";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./_MoviesPage.scss";

function MoviesPage() {
  const { movieGenres, loading, fetchMoviesByGenre } = useContext(ApiContext);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [currentGenre, setCurrentGenre] = useState(0);
  const [genreMovies, setGenreMovies] = useState([]);
  const [loadingMovies, setLoadingMovies] = useState(false);
  const genresRef = useRef(null);
  const navigate = useNavigate();

  const navigateGenres = (direction) => {
    const maxIndex = Math.ceil(movieGenres.length / 3) - 1;
    if (direction === "left") {
      setCurrentGenre((prev) => (prev > 0 ? prev - 1 : maxIndex));
    } else {
      setCurrentGenre((prev) => (prev < maxIndex ? prev + 1 : 0));
    }
  };

  const handleGenreClick = async (genreId) => {
    if (selectedGenre === genreId) {
      setSelectedGenre(null);
      setGenreMovies([]);
    } else {
      setSelectedGenre(genreId);
      setLoadingMovies(true);
      try {
        const movies = await fetchMoviesByGenre(genreId);
        setGenreMovies(movies);
      } catch (error) {
        console.error("Error loading movies:", error);
      } finally {
        setLoadingMovies(false);
      }
    }
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  if (loading) {
    return (
      <div className="movies-page">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="movies-page">
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
            {movieGenres
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
        <div className="movies-section">
          <h3 className="movies-title">
            {movieGenres.find((g) => g.id === selectedGenre)?.name} Movies
          </h3>

          {loadingMovies ? (
            <div className="loading-movies">Loading movies...</div>
          ) : (
            <div className="movies-grid">
              {genreMovies.map((movie) => {
                return (
                  <div
                    key={movie.id}
                    className="movie-card"
                    onClick={() => handleMovieClick(movie.id)}
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                      alt={movie.title}
                      className="movie-poster"
                    />
                    <div className="card-overlay">
                      <h4 className="card-title">{movie.title}</h4>
                      <div className="card-rating">
                        <Star size={16} fill="currentColor" />
                        <span>{movie.vote_average?.toFixed(1)}</span>
                      </div>
                      <div className="card-info">
                        <p>{movie.release_date?.slice(0, 4)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MoviesPage;
