import { useContext, useState, useEffect } from "react";
import { ApiContext } from "../../context/ApiContext.jsx";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./_Upcoming.scss";

function Upcoming() {
  const { fetchUpcomingMovies } = useContext(ApiContext);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUpcoming = async () => {
      console.log("Loading upcoming movies...");
      setLoading(true);
      try {
        const movies = await fetchUpcomingMovies();
        console.log("Upcoming movies received:", movies);

        setUpcomingMovies(movies);
        console.log("All movies:", movies);
      } catch (error) {
        console.error("Error loading upcoming movies:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUpcoming();
  }, [fetchUpcomingMovies]);
  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  if (loading) {
    return (
      <div className="upcoming-page">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="upcoming-page">
      <div className="upcoming-header"></div>
      <div className="upcoming-section">
        <h2 className="section-title">Upcoming Movies</h2>
        <div className="upcoming-grid">
          {upcomingMovies.length === 0 ? (
            <p>No movies found.</p>
          ) : (
            upcomingMovies.map((movie) => (
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Upcoming;
