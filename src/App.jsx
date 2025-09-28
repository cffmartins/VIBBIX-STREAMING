import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.scss";
import Layout from "./components/Layout/Layout.jsx";
import Homepage from "./pages/Homepage/Homepage.jsx";
import MoviesPage from "./pages/MoviesPage/MoviesPage.jsx";
import SeriesPage from "./pages/SeriesPage/SeriesPage.jsx";
import TopRated from "./pages/TopRated/TopRated.jsx";
import Upcoming from "./pages/Upcoming/Upcoming.jsx";
import DetailsPage from "./pages/DetailsPage/DetailsPage.jsx";
import { ApiProvider } from "./context/ApiContext.jsx";
import WatchlistPage from "./pages/WatchlistPage/WatchlistPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <ApiProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/series" element={<SeriesPage />} />
            <Route path="/categories" element={<div>Categories Page</div>} />
            <Route path="/top-rated" element={<TopRated />} />
            <Route path="/upcoming" element={<Upcoming />} />
            <Route path="/:mediaType/:id" element={<DetailsPage />} />
            <Route path="/watchlist" element={<WatchlistPage />} />
          </Routes>
        </Layout>
      </ApiProvider>
    </BrowserRouter>
  );
}

export default App;
