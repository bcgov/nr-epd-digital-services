import "./App.css";
import Header from "./app/components/navigation/Header";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SideBar from "./app/components/navigation/SideBar";
import '@bcgov/bc-sans/css/BC_Sans.css'
import { useState } from "react";

function App() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  // Handle mouse enter and leave to control sidebar expansion
  const handleMouseEnter = () => setIsSidebarExpanded(true);
  const handleMouseLeave = () => setIsSidebarExpanded(false);



  // Toggle sidebar expand/collapse on hover or click
  const handleSidebarToggle = () => {
    setIsSidebarExpanded((prevState) => !prevState);
  };

  return (
    <div className="container-fluid p-0">
      <Header />
      <div className="container m-0 p-0">
        <div className={`sidebar-container display-from-medium ${isSidebarExpanded ? "expanded" : ""}`} onMouseEnter={handleSidebarToggle} onMouseLeave={handleSidebarToggle}>
            <SideBar />
        </div>
        <div className={`p-0 main-content-container ${isSidebarExpanded ? "shifted" : ""}`}>
          <Outlet />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
