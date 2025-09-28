import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { ChevronLeft, Play, Plus, Star, X } from "lucide-react";
import Button from "../../components/Button/Button";
import { Link } from "react-router-dom";
import { ApiContext } from "../../context/ApiContext.jsx";
import "./_DetailsPage.scss";

// api configuration
const API_KEY = "8d01cdd04c60a3858e3d9a27a2fd1a5b";
const BASE_URL = "https://api.themoviedb.org/3";

const DetailsPage = () => {
  const { mediaType, id } = useParams();
  const [details, setDetails] = useState(null);
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } =
    useContext(ApiContext);
  const [inWatchlist, setInWatchlist] = useState(false);

  useEffect(() => {
    // scroll to top when page loads or id changes
    window.scrollTo({ top: 0, behavior: "instant" });

    const fetchDetails = async () => {
      try {
        setLoading(true);

        // fetch details from api
        const detailsResponse = await fetch(
          `${BASE_URL}/${mediaType}/${id}?api_key=${API_KEY}&language=en-US`
        );

        if (!detailsResponse.ok) {
          throw new Error("Failed to fetch details");
        }

        const detailsData = await detailsResponse.json();

        // fetch credits from api
        const creditsResponse = await fetch(
          `${BASE_URL}/${mediaType}/${id}/credits?api_key=${API_KEY}&language=en-US`
        );

        const creditsData = creditsResponse.ok
          ? await creditsResponse.json()
          : { cast: [], crew: [] };

        setDetails(detailsData);
        setCredits(creditsData);

        // check if item is already in watchlist
        const isItemInWatchlist = isInWatchlist(parseInt(id), mediaType);
        setInWatchlist(isItemInWatchlist);
      } catch (err) {
        console.error("Error fetching details:", err);
        setError("Failed to load details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id && mediaType) {
      fetchDetails();
    }
  }, [id, mediaType]);

  // update watchlist status when watchlist data changes
  useEffect(() => {
    if (id && mediaType && details) {
      const isItemInList = isInWatchlist(parseInt(id), mediaType);
      setInWatchlist(isItemInList);
    }
  }, [id, mediaType, isInWatchlist, details]);

  if (loading) {
    return (
      <div className="details-page">
        <div className="loading">Loading details...</div>
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="details-page">
        <div className="error">{error || "Content not found"}</div>
        <Link to="/" className="back-link">
          <ChevronLeft size={20} /> Back to Home
        </Link>
      </div>
    );
  }

  // get director or creators
  const director = credits?.crew?.find(
    (person) => person.job === "Director" || person.job === "Creator"
  );

  // get main cast (limit to 10)
  const mainCast = credits?.cast?.slice(0, 10) || [];

  // get main crew members (limit to key roles)
  const mainCrew =
    credits?.crew
      ?.filter((person) =>
        [
          "Director",
          "Producer",
          "Screenplay",
          "Writer",
          "Director of Photography",
          "Editor",
          "Music",
          "Costume Design",
        ].includes(person.job)
      )
      .slice(0, 15) || [];

  // format runtime for movies
  const formatRuntime = (minutes) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // function to add or remove from watchlist
  const toggleWatchlist = (e) => {
    e.preventDefault();

    if (inWatchlist) {
      removeFromWatchlist(parseInt(id), mediaType);
      setInWatchlist(false);
    } else {
      addToWatchlist(details, mediaType);
      setInWatchlist(true);
    }
  };

  return (
    <div className="details-container">
      {/* Back button - outside the content */}
      <div className="navigation-section">
        <Link to="/" className="back-button">
          <ChevronLeft size={20} /> Back
        </Link>
      </div>

      <div className="details-page">
        {/* Hero section with backdrop */}
        <div className="details-hero">
          <div className="details-backdrop">
            <img
              src={`https://image.tmdb.org/t/p/original${details.backdrop_path}`}
              alt={details.title || details.name}
            />
            <div className="details-overlay"></div>
          </div>

          <div className="details-content">
            <div className="details-poster">
              <img
                src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
                alt={details.title || details.name}
              />
            </div>

            <div className="details-info">
              <h1 className="details-title">{details.title || details.name}</h1>

              <div className="details-meta">
                <span className="details-year">
                  {(details.release_date || details.first_air_date || "").slice(
                    0,
                    4
                  )}
                </span>

                {mediaType === "movie" ? (
                  <span className="details-runtime">
                    {formatRuntime(details.runtime)}
                  </span>
                ) : (
                  <span className="details-seasons">
                    {details.number_of_seasons} Season
                    {details.number_of_seasons !== 1 ? "s" : ""}
                  </span>
                )}

                <span className="details-rating">
                  <Star size={16} fill="currentColor" />
                  {details.vote_average.toFixed(1)}
                </span>
              </div>

              {/* Genres */}
              <div className="details-genres">
                {details.genres.map((genre) => (
                  <span key={genre.id} className="genre-tag">
                    {genre.name}
                  </span>
                ))}
              </div>

              {/* Action buttons */}
              <div className="details-actions">
                <Button variant="watchmore" className="details-watch-btn">
                  <Play size={20} fill="currentColor" /> Watch Now
                </Button>
                <Button
                  variant="watchlist"
                  className="details-watchlist-btn"
                  onClick={toggleWatchlist}
                >
                  {inWatchlist ? (
                    <>
                      <X size={20} /> Remove from Watchlist
                    </>
                  ) : (
                    <>
                      <Plus size={20} /> Add to Watchlist
                    </>
                  )}
                </Button>
              </div>

              {/* Overview */}
              <div className="details-overview">
                <h3>Overview</h3>
                <p>{details.overview || "No overview available."}</p>
              </div>

              {/* Credits */}
              <div className="details-credits">
                {director && (
                  <div className="credit-item">
                    <span className="credit-label">
                      {mediaType === "movie" ? "Director:" : "Creator:"}
                    </span>
                    <span className="credit-value">{director.name}</span>
                  </div>
                )}

                {/* Cast with photos */}
                {mainCast.length > 0 && (
                  <div className="cast-section">
                    <h3 className="cast-heading">Cast</h3>
                    <div className="cast-list">
                      {mainCast.map((actor) => (
                        <div key={actor.id} className="cast-item">
                          <div className="cast-photo">
                            <img
                              src={
                                actor.profile_path
                                  ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                                  : "https://via.placeholder.com/185x278/CCCCCC/FFFFFF?text=No+Image"
                              }
                              alt={actor.name}
                            />
                          </div>
                          <div className="cast-name">{actor.name}</div>
                          <div className="cast-character">
                            {actor.character}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Crew section */}
                {mainCrew.length > 0 && (
                  <div className="crew-section">
                    <h3 className="crew-heading">Crew</h3>
                    <div className="crew-list">
                      {mainCrew.map((crewMember) => (
                        <div
                          key={`${crewMember.id}-${crewMember.job}`}
                          className="crew-item"
                        >
                          <div className="crew-name">{crewMember.name}</div>
                          <div className="crew-job">{crewMember.job}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;
