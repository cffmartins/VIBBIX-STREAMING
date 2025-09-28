import React, { useContext } from "react";
import { ApiContext } from "../../context/ApiContext";
import Watchlist from "../../components/Watchlist/Watchlist";
import "./_WatchlistPage.scss";

const WatchlistPage = () => {
  return (
    <div className="watchlist-page">
      <h2 className="watchlist-title">My Watchlist</h2>
      <Watchlist showTitle={false} />
    </div>
  );
};

export default WatchlistPage;
