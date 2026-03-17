import { GoAlertFill } from "react-icons/go";
import { MdUpdate } from "react-icons/md";

import "../styles/dashboard.css";

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import {
  FaPlus,
  FaSearch,
  FaTruck,
  FaTools,
  FaEye,
  FaClock,
  FaExclamationTriangle,
  FaThLarge
} from "react-icons/fa";

export default function Dashboard() {

  const navigate = useNavigate();

  const API = import.meta.env.VITE_API;
  const token = localStorage.getItem("token");

  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("all");

  const [statusFilter, setStatusFilter] = useState("all");

  const [page, setPage] = useState(1);

  const popupRef = useRef();



  /* ================= DASHBOARD DATA ================= */

  const [counts, setCounts] = useState({

    totalVehicles: 0,
    totalEquipments: 0,
    soonVehicles: 0,
    soonEquipments: 0,

  });

  const [data, setData] = useState([]);



  /* ================= LOAD DASHBOARD ================= */

  const loadDashboard = async () => {

    try {

      const res = await axios.get(
        API + "/dashboard",
        {
          headers: {
            Authorization:
              "Bearer " + token,
          },
        }
      );

      setCounts(res.data);

      setData(res.data.recent);

    } catch (err) {

      console.log(err);

    }

  };

  useEffect(() => {

    loadDashboard();

  }, []);



  /*-------------POP-UP--------------------*/

  useEffect(() => {

    function handleClick(e) {

      if (
        popupRef.current &&
        !popupRef.current.contains(e.target)
      ) {
        setOpen(false);
      }

    }

    document.addEventListener(
      "click",
      handleClick
    );

    return () =>
      document.removeEventListener(
        "click",
        handleClick
      );

  }, []);



  /* ---------------- FILTER ---------------- */

  let filtered = data;

  filtered =
  filtered.filter(d => {

    const text =
      (
        d.name +
        d.category +
        (d.type || "") +
        (d.vehicle_id || "") +
        (d.equipment_id || "")
      ).toLowerCase();

    return text.includes(
      search.toLowerCase()
    );

  });

if (filter === "vehicle") {
    filtered =
      filtered.filter(
        d => d.category === "Vehicle"
      );
  }

  if (filter === "equipment") {
    filtered =
      filtered.filter(
        d => d.category === "Equipment"
      );
  }


  if (statusFilter === "soon") {
    filtered =
      filtered.filter(
        d =>
          d.status === "Soon" ||
          d.status === "Expired"
      );
  }


  filtered =
    filtered.filter(d =>
      d.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );
  /* ---------------- PAGINATION ---------------- */

  const perPage = 5;

  const totalPages =
    Math.ceil(
      filtered.length / perPage
    );

  const start =
    (page - 1) * perPage;

  const current =
    filtered.slice(
      start,
      start + perPage
    );



  /* ---------------- VIEW ---------------- */

  const handleView = (item) => {

    if (item.category === "Vehicle")
      navigate(`/vehicle/${item.id}`);

    if (item.category === "Equipment")
      navigate(`/equipment/${item.id}`);

  };



  return (

    <div className="dashboard-container">


      {/* TITLE */}

      <div className="dashboard-title">
        Dashboard
      </div>



      {/* ================= CARDS ================= */}

      <div className="cards">


        <div
          className="dashboard-card c1"
          onClick={() => {setFilter("vehicle");
            setStatusFilter("all");
          }}
        >

          <FaTruck />

          <div>

            <h2>
              {counts.totalVehicles}
            </h2>

            <span>
              Total Vehicles
            </span>

          </div>

        </div>



        <div
          className="dashboard-card c2"
          onClick={() => {setFilter("equipment");
            setStatusFilter("all");
          }}
        >

          <FaTools />

          <div>

            <h2>
              {counts.totalEquipments}
            </h2>

            <span>
              Total Equipments
            </span>

          </div>

        </div>

        <div
          className="dashboard-card c3"
          onClick={() => {
            setFilter("vehicle");
            setStatusFilter("soon");
          }}
        >
          <FaClock />
          <div>
            <h2>
              {counts.soonVehicles}
            </h2>
            <span>
              Soon Vehicles
            </span>
          </div>
        </div>


        {/* SOON EQUIPMENTS */}

        <div
          className="dashboard-card c4"
          onClick={() => {
            setFilter("equipment");
            setStatusFilter("soon");
          }}
        >
          <FaExclamationTriangle />
          <div>
            <h2>
              {counts.soonEquipments}
            </h2>
            <span>
              Soon Equipments
            </span>
          </div>
        </div>

      </div>



      {/* ================= TOOLBAR ================= */}

      <div className="toolbar">


        <div className="filters">


          <button
            className="pill"
            onClick={() =>
              navigate("/vehicles")
            }
          >
            <FaTruck /> Vehicles
          </button>


          <button
            className="pill"
            onClick={() =>
              navigate("/equipments")
            }
          >
            <FaTools /> Equipments
          </button>



          <div
            className="add-box"
            ref={popupRef}
          >

            <button
              className="add-btn"
              onClick={(e) => {

                e.stopPropagation();

                setOpen(!open);

              }}
            >
              + Add
            </button>


            {open && (

              <div className="add-popup">

                <div
                  onClick={() =>
                    navigate(
                      "/add-vehicle"
                    )
                  }
                >
                  <FaTruck />
                  Add Vehicle
                </div>


                <div
                  onClick={() =>
                    navigate(
                      "/add-equipment"
                    )
                  }
                >
                  <FaTools />
                  Add Equipment
                </div>

              </div>

            )}

          </div>

        </div>



        <div className="search-area">

          <div className="search-box">

            <FaSearch />

            <input
              placeholder="Search"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

          </div>

        </div>

      </div>



      {/* ================= TABLE ================= */}

      <div className="table-wrapper">

        <table>

          <thead>

            <tr>

              <th>Name</th>

              <th>Category</th>

              <th>Action</th>

            </tr>

          </thead>

          <tbody>

{current.map(item => (

<tr key={item.id}>

<td>{item.name}</td>

<td>{item.category}</td>

<td>

<button
  className="view-btn"
  onClick={() => {

    if (
      item.category ===
      "Vehicle"
    ) {

      navigate(
        "/vehicle/" +
        item.id
      );

    }

    if (
      item.category ===
      "Equipment"
    ) {

      navigate(
        "/equipment/" +
        item.id
      );

    }

  }}
>

<FaEye />

</button>

</td>

</tr>

))}

</tbody>

        </table>

      </div>



      {/* ================= PAGINATION ================= */}

      <div className="pagination">


        <button
          className="page-arrow"
          onClick={() =>
            setPage(page - 1)
          }
          disabled={page === 1}
        >
          ←
        </button>


        {Array.from(
          { length: totalPages },
          (_, i) => (

          <button
            key={i}
            className={
              page === i + 1
                ? "active"
                : ""
            }
            onClick={() =>
              setPage(i + 1)
            }
          >
            {i + 1}
          </button>

        ))}


        <button
          className="page-arrow"
          onClick={() =>
            setPage(page + 1)
          }
          disabled={
            page === totalPages
          }
        >
          →
        </button>

      </div>

    </div>

  );

}