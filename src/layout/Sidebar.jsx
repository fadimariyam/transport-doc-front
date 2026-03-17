import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/otpPage.css";
import {
  FaTachometerAlt,
  FaTruck,
  FaTools
} from "react-icons/fa";

export default function Sidebar({ collapsed }) {

  return (

    <div
      className={
        collapsed
          ? "sidebar collapsed"
          : "sidebar"
      }
    >

      <div className="logo">
         <img src={logo} className="side-logo" />
      </div>


      <nav className="menu">

        <Link to="/dashboard">
          <FaTachometerAlt />
          <span>Dashboard</span>
        </Link>

        <Link to="/vehicles">
          <FaTruck />
          <span>Vehicles</span>
        </Link>

        <Link to="/equipments">
          <FaTools />
          <span>Equipments</span>
        </Link>

      </nav>

    </div>

  );

}