import NavBar from "../NavBar/NavBar";
import LeftSidebar from "../LeftSideBar/LeftSidebar";
import RightSidebar from "../RightSidebar/RightSidebar";
import "./_Layout.scss";

export default function Layout({ children }) {
  return (
    <div className="app-layout">
      <LeftSidebar />
      <div className="main-content">
        <NavBar />
        {children}
      </div>
      <RightSidebar />
    </div>
  );
}
