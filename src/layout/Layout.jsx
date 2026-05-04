// import { useState } from "react";

// import Header from "./Header";
// import Sidebar from "./Sidebar";
// import Footer from "./Footer";

// import { Outlet } from "react-router-dom";

// import "../styles/layout.css";


// export default function Layout() {

//   const [collapsed, setCollapsed] =
//     useState(false);

//   return (

//     <div className="layout-root">

//       <Header
//         toggle={() =>
//           setCollapsed(!collapsed)
//         }
//       />

//       <div className="app-layout">

//         <Sidebar collapsed={collapsed} />

//         <div className="content">

//           <div className="main">
//             <Outlet />
//           </div>

//           <Footer />

//         </div>

//       </div>

//     </div>

//   );

// }

import { useState, useEffect, useRef } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { Outlet, useLocation } from "react-router-dom";
import "../styles/layout.css";

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const isMobile = () => window.innerWidth <= 768;

  // On mobile: collapse sidebar by default and on route change
  useEffect(() => {
    if (isMobile()) {
      setCollapsed(true);
    }
  }, [location]);

  // Set initial state based on screen size
  useEffect(() => {
    if (isMobile()) {
      setCollapsed(true);
    }
  }, []);

  return (
    <div className="layout-root">
      <Header toggle={() => setCollapsed(!collapsed)} />

      <div className="app-layout">
        <Sidebar collapsed={collapsed} />

        {/* Overlay for mobile when sidebar is open */}
        {!collapsed && isMobile() && (
          <div
            style={{
              position: "fixed",
              inset: "56px 0 0 0",
              background: "rgba(0,0,0,0.35)",
              zIndex: 998,
            }}
            onClick={() => setCollapsed(true)}
          />
        )}

        <div className="content">
          <div className="main">
            <Outlet />
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}