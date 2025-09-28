import { useContext, useState, useEffect } from "react";
import { ApiContext } from "../../context/ApiContext.jsx";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./_TopRated.scss";

function TopRated() {
  const { fetchTopRatedMovies, fetchTopRatedSeries } = useContext(ApiContext);
  const [topMovies, setTopMovies] = useState([]);
  const [topSeries, setTopSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTopRated = async () => {
      setLoading(true);
      try {
        const [movies, series] = await Promise.all([
          fetchTopRatedMovies(),
          fetchTopRatedSeries(),
        ]);

        // get first 6 items from each array
        setTopMovies(movies.slice(0, 6));
        setTopSeries(series.slice(0, 6));
      } catch (error) {
        console.error("Error loading top rated content:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTopRated();
  }, [fetchTopRatedMovies, fetchTopRatedSeries]);

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const handleSeriesClick = (seriesId) => {
    navigate(`/tv/${seriesId}`);
  };

  if (loading) {
    return (
      <div className="top-rated-page">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="top-rated-page">
      <div className="top-rated-header"></div>

      {/* Top Rated Movies Section */}
      <div className="top-rated-section">
        <h2 className="section-title">Top Rated Movies</h2>
        <div className="top-rated-grid">
          {topMovies.map((movie) => (
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
          ))}
        </div>
      </div>

      {/* Top Rated Series Section */}
      <div className="top-rated-section">
        <h2 className="section-title">Top Rated TV Series</h2>
        <div className="top-rated-grid">
          {topSeries.map((series) => (
            <div
              key={series.id}
              className="series-card"
              onClick={() => handleSeriesClick(series.id)}
            >
              <img
                src={`https://image.tmdb.org/t/p/w300${series.poster_path}`}
                alt={series.name}
                className="series-poster"
              />
              <div className="card-overlay">
                <h4 className="card-title">{series.name}</h4>
                <div className="card-rating">
                  <Star size={16} fill="currentColor" />
                  <span>{series.vote_average?.toFixed(1)}</span>
                </div>
                <div className="card-info">
                  <p>{series.first_air_date?.slice(0, 4)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TopRated;
