import { useState } from "react";

import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

import { Outlet } from "react-router-dom";

import "../styles/layout.css";


export default function Layout() {

  const [collapsed, setCollapsed] =
    useState(false);

  return (

    <div className="layout-root">

      <Header
        toggle={() =>
          setCollapsed(!collapsed)
        }
      />

      <div className="app-layout">

        <Sidebar collapsed={collapsed} />

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