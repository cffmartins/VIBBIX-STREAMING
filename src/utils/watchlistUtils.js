// listens for localStorage changes and updates state accordingly
export const setupStorageListener = (
  setWatchlistMovies,
  setWatchlistSeries
) => {
  const handleStorageChange = (e) => {
    // check if the change is relevant to the watchlist
    if (e.key === "watchlistMovies") {
      try {
        const newMovies = JSON.parse(e.newValue || "[]");
        setWatchlistMovies(newMovies);
      } catch (error) {
        console.error(
          "Error processing watchlistMovies from storage event:",
          error
        );
      }
    } else if (e.key === "watchlistSeries") {
      try {
        const newSeries = JSON.parse(e.newValue || "[]");
        setWatchlistSeries(newSeries);
      } catch (error) {
        console.error(
          "Error processing watchlistSeries from storage event:",
          error
        );
      }
    }
  };
  // Adicionar o event listener
  // add the event listener
  window.addEventListener("storage", handleStorageChange);

  // Retornar uma função para remover o listener quando não for mais necessário
  // return a function to remove the listener when not needed
  return () => {
    window.removeEventListener("storage", handleStorageChange);
  };
};

// checks if an item is already in the watchlist
export const isItemInWatchlist = (
  id,
  type,
  watchlistMovies,
  watchlistSeries
) => {
  if (type === "movie") {
    return watchlistMovies.some((movie) => movie.id === id);
  } else if (type === "tv") {
    return watchlistSeries.some((series) => series.id === id);
  }
  return false;
};

// adds an item to the watchlist with validation
export const addItemToWatchlist = (
  item,
  type,
  watchlistMovies,
  watchlistSeries,
  setWatchlistMovies,
  setWatchlistSeries
) => {
  if (!item || !item.id) {
    console.error("Invalid item to add to watchlist", item);
    return false;
  }

  if (type === "movie") {
    if (watchlistMovies.some((movie) => movie.id === item.id)) {
      return false; // already exists
    }
    setWatchlistMovies([...watchlistMovies, item]);
    return true;
  } else if (type === "tv") {
    if (watchlistSeries.some((series) => series.id === item.id)) {
      return false; // already exists
    }
    setWatchlistSeries([...watchlistSeries, item]);
    return true;
  }

  return false;
};

// removes an item from the watchlist
export const removeItemFromWatchlist = (
  itemId,
  type,
  watchlistMovies,
  watchlistSeries,
  setWatchlistMovies,
  setWatchlistSeries
) => {
  if (type === "movie") {
    setWatchlistMovies(watchlistMovies.filter((movie) => movie.id !== itemId));
    return true;
  } else if (type === "tv") {
    setWatchlistSeries(
      watchlistSeries.filter((series) => series.id !== itemId)
    );
    return true;
  }

  return false;
};
