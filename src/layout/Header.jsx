import { FaBars } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";

import { useNavigate } from "react-router-dom";

export default function Header({ toggle }) {

  const navigate = useNavigate();

  const logout = () => {

  localStorage.removeItem("token");

  window.location.href = "/";

};

  return (

    <div className="header">

      <div className="header-left">

        <button
          className="menu-btn"
          onClick={toggle}
        >
          <FaBars />
        </button>

        <div className="header-text">

          <div className="title">
            Document Tracker
          </div>

          <div className="sub">
            Al-Nasiya Transport-Department
          </div>

        </div>

      </div>


      <button
        className="logout-btn"
        onClick={logout}
      >
        <FaSignOutAlt /> Logout
      </button>

    </div>

  );
}