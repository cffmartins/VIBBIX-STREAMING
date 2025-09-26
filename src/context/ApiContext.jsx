// importing necessary modules from React
import React, { createContext, useState, useEffect } from "react";
import { setupStorageListener } from "../utils/watchlistUtils";

// creating the context
const ApiContext = createContext();

// API configuration
const API_KEY = "8d01cdd04c60a3858e3d9a27a2fd1a5b";
const BASE_URL = "https://api.themoviedb.org/3";

// provider component to wrap the app and provide context values
function ApiProvider({ children }) {
  // Inicializar os estados da watchlist com dados do localStorage, se existirem
  const [watchlistMovies, setWatchlistMovies] = useState(() => {
    try {
      const saved = localStorage.getItem("watchlistMovies");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Erro ao carregar watchlistMovies do localStorage:", error);
      return [];
    }
  });

  const [watchlistSeries, setWatchlistSeries] = useState(() => {
    try {
      const saved = localStorage.getItem("watchlistSeries");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Erro ao carregar watchlistSeries do localStorage:", error);
      return [];
    }
  });

  const [trendingContent, setTrendingContent] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularSeries, setPopularSeries] = useState([]);
  const [movieGenres, setMovieGenres] = useState([]);
  const [seriesGenres, setSeriesGenres] = useState([]);
  const [moviesByGenre, setMoviesByGenre] = useState({});
  const [seriesByGenre, setSeriesByGenre] = useState({});
  const [loading, setLoading] = useState(true);

  // removed fetchWatchlistMovies and fetchWatchlistSeries
  // now using localStorage to persist the watchlist

  const fetchTrendingContent = async () => {
    const res = await fetch(
      `${BASE_URL}/trending/all/day?api_key=${API_KEY}&language=en-US`
    );
    if (!res.ok) throw new Error("Failed to fetch trending content");
    const data = await res.json();
    return data.results.slice(0, 3);
  };

  const fetchPopularMovies = async () => {
    const res = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
    );
    if (!res.ok) throw new Error("Failed to fetch popular movies");
    const data = await res.json();
    return data.results.slice(0, 12);
  };

  const fetchPopularSeries = async () => {
    const res = await fetch(
      `${BASE_URL}/tv/popular?api_key=${API_KEY}&language=en-US&page=1`
    );
    if (!res.ok) throw new Error("Failed to fetch popular series");
    const data = await res.json();
    return data.results.slice(0, 12);
  };

  const fetchMovieGenres = async () => {
    const res = await fetch(
      `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`
    );
    if (!res.ok) throw new Error("Failed to fetch movie genres");
    const data = await res.json();
    return data.genres;
  };

  const fetchSeriesGenres = async () => {
    const res = await fetch(
      `${BASE_URL}/genre/tv/list?api_key=${API_KEY}&language=en-US`
    );
    if (!res.ok) throw new Error("Failed to fetch series genres");
    const data = await res.json();
    return data.genres;
  };

  const fetchMoviesByGenre = async (genreId) => {
    const res = await fetch(
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=${genreId}&page=1`
    );
    if (!res.ok) throw new Error("Failed to fetch movies by genre");
    const data = await res.json();
    return data.results.slice(0, 15);
  };

  const fetchSeriesByGenre = async (genreId) => {
    const res = await fetch(
      `${BASE_URL}/discover/tv?api_key=${API_KEY}&language=en-US&with_genres=${genreId}&page=1`
    );
    if (!res.ok) throw new Error("Failed to fetch series by genre");
    const data = await res.json();
    return data.results.slice(0, 15);
  };

  const fetchMovieDetails = async (movieId) => {
    const res = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`
    );
    if (!res.ok) throw new Error("Failed to fetch movie details");
    return await res.json();
  };

  const fetchSeriesDetails = async (seriesId) => {
    const res = await fetch(
      `${BASE_URL}/tv/${seriesId}?api_key=${API_KEY}&language=en-US`
    );
    if (!res.ok) throw new Error("Failed to fetch series details");
    return await res.json();
  };

  const fetchTopRatedMovies = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`
      );
      if (!res.ok) throw new Error("Failed to fetch top rated movies");
      const data = await res.json();
      return data.results;
    } catch (error) {
      console.error("Error fetching top rated movies:", error);
      return [];
    }
  };

  const fetchTopRatedSeries = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/tv/top_rated?api_key=${API_KEY}&language=en-US&page=1`
      );
      if (!res.ok) throw new Error("Failed to fetch top rated series");
      const data = await res.json();
      return data.results;
    } catch (error) {
      console.error("Error fetching top rated series:", error);
      return [];
    }
  };

  const fetchUpcomingMovies = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`
      );
      console.log("API response:", res.status);
      if (!res.ok) throw new Error("Failed to fetch upcoming movies");
      const data = await res.json();
      console.log("API data:", data);
      return data.results;
    } catch (error) {
      console.error("Error fetching upcoming movies:", error);
      return [];
    }
  };

  // search functions
  const searchMovies = async (query) => {
    try {
      const res = await fetch(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
          query
        )}&page=1`
      );
      if (!res.ok) throw new Error("Failed to search movies");
      const data = await res.json();
      return data.results;
    } catch (error) {
      console.error("Error searching movies:", error);
      return [];
    }
  };

  const searchTVShows = async (query) => {
    try {
      const res = await fetch(
        `${BASE_URL}/search/tv?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
          query
        )}&page=1`
      );
      if (!res.ok) throw new Error("Failed to search TV shows");
      const data = await res.json();
      return data.results;
    } catch (error) {
      console.error("Error searching TV shows:", error);
      return [];
    }
  };

  const searchMulti = async (query) => {
    try {
      const res = await fetch(
        `${BASE_URL}/search/multi?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
          query
        )}&page=1`
      );
      if (!res.ok) throw new Error("Failed to search content");
      const data = await res.json();
      return data.results;
    } catch (error) {
      console.error("Error searching content:", error);
      return [];
    }
  };

  // watchlist management functions
  const addToWatchlist = (item, type) => {
    if (type === "movie") {
      // Check if the movie is already in the watchlist
      const exists = watchlistMovies.some((movie) => movie.id === item.id);
      if (!exists) {
        const updatedWatchlist = [...watchlistMovies, item];
        setWatchlistMovies(updatedWatchlist);
        // localStorage will be updated automatically by useEffect
      }
    } else if (type === "tv") {
      // Check if the series is already in the watchlist
      const exists = watchlistSeries.some((series) => series.id === item.id);
      if (!exists) {
        const updatedWatchlist = [...watchlistSeries, item];
        setWatchlistSeries(updatedWatchlist);
        // localStorage will be updated automatically by useEffect
      }
    }
  };

  const removeFromWatchlist = (itemId, type) => {
    if (type === "movie") {
      const updatedWatchlist = watchlistMovies.filter(
        (movie) => movie.id !== itemId
      );
      setWatchlistMovies(updatedWatchlist);
      // localStorage will be updated automatically by useEffect
    } else if (type === "tv") {
      const updatedWatchlist = watchlistSeries.filter(
        (series) => series.id !== itemId
      );
      setWatchlistSeries(updatedWatchlist);
      // localStorage will be updated automatically by useEffect
    }
  };

  const isInWatchlist = (itemId, type) => {
    if (type === "movie") {
      return watchlistMovies.some((movie) => movie.id === itemId);
    } else if (type === "tv") {
      return watchlistSeries.some((series) => series.id === itemId);
    }
    return false;
  };

  // Load API data
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [trending, popMovies, popSeries, movGenres, serGenres] =
          await Promise.all([
            fetchTrendingContent(),
            fetchPopularMovies(),
            fetchPopularSeries(),
            fetchMovieGenres(),
            fetchSeriesGenres(),
          ]);

        setTrendingContent(trending);
        setPopularMovies(popMovies);
        setPopularSeries(popSeries);
        setMovieGenres(movGenres);
        setSeriesGenres(serGenres);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Update localStorage when watchlistMovies changes
  useEffect(() => {
    try {
      localStorage.setItem("watchlistMovies", JSON.stringify(watchlistMovies));
    } catch (error) {
      console.error("Error saving watchlistMovies to localStorage:", error);
    }
  }, [watchlistMovies]);

  // Update localStorage when watchlistSeries changes
  useEffect(() => {
    try {
      localStorage.setItem("watchlistSeries", JSON.stringify(watchlistSeries));
    } catch (error) {
      console.error("Error saving watchlistSeries to localStorage:", error);
    }
  }, [watchlistSeries]);

  // Set up listener to sync between tabs
  useEffect(() => {
    const cleanupListener = setupStorageListener(
      setWatchlistMovies,
      setWatchlistSeries
    );
    return () => cleanupListener();
  }, []);

  return (
    <ApiContext.Provider
      value={{
        watchlistMovies,
        watchlistSeries,
        trendingContent,
        popularMovies,
        popularSeries,
        movieGenres,
        seriesGenres,
        moviesByGenre,
        seriesByGenre,
        setWatchlistMovies,
        setWatchlistSeries,
        fetchMoviesByGenre,
        fetchSeriesByGenre,
        fetchMovieDetails,
        fetchSeriesDetails,
        fetchTopRatedMovies,
        fetchTopRatedSeries,
        fetchUpcomingMovies,
        searchMovies,
        searchTVShows,
        searchMulti,
        setMoviesByGenre,
        setSeriesByGenre,
        loading,
        // Watchlist management functions
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
}

export { ApiContext, ApiProvider };
export default ApiProvider;
