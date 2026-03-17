import "../styles/dashboard.css";

import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import axios from "axios";

import {
  FaPlus,
  FaSearch,
  FaEye,
  FaTrash
} from "react-icons/fa";


import ConfirmModal from "../components/ConfirmModal";

export default function Vehicles() {

  const navigate = useNavigate();

  const API = import.meta.env.VITE_API;

  const token = localStorage.getItem("token");

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(5);

  const [data, setData] = useState([]);

  const [total, setTotal] = useState(0);

  const [delId, setDelId] = useState(null);



  /* ================= LOAD ================= */

  const loadVehicles = async () => {

    try {

      const res = await axios.get(
        API + "/vehicles",
        {
          params: {
            page,
            limit,
            search,
          },
          headers: {
            Authorization:
              "Bearer " + token,
          },
        }
      );

      setData(res.data.rows);

      setTotal(res.data.total);

    } catch (err) {

      console.log(err);

    }

  };


  useEffect(() => {

    loadVehicles();

  }, [page, limit, search]);

/*========DELETE================ */
const deleteVehicle = async () => {

  await axios.delete(
    API + "/vehicles/" + delId,
    {
      headers: {
        Authorization:
          "Bearer " + token,
      },
    }
  );

  setDelId(null);

  loadVehicles();

};

  /* PAGINATION */

  const totalPages =
    Math.ceil(total / limit);



  return (

    <div className="dashboard-container">


      {/* TITLE */}

      <div className="dashboard-title">
        Vehicles
      </div>



      {/* TOOLBAR */}

      <div className="toolbar">


        <div className="filters">

          <button
            className="add-btn"
            onClick={() =>
              navigate("/add-vehicle")
            }
          >
            <FaPlus /> Add Vehicle
          </button>

        </div>



        <div className="search-area">


          <div className="search-box">

            <FaSearch />

            <input
              value={search}
              onChange={(e) => {

                setSearch(
                  e.target.value
                );

                setPage(1);

              }}
              placeholder="Search vehicle"
            />

          </div>


          <select
            className="limit"
            value={limit}
            onChange={(e) => {

              setLimit(
                Number(
                  e.target.value
                )
              );

              setPage(1);

            }}
          >

            <option value={5}>5</option>

            <option value={10}>10</option>

            <option value={20}>20</option>

          </select>

        </div>

      </div>



      {/* TABLE */}

      <div className="table-wrapper">

        <table>

          <thead>

            <tr>

              <th>Vehicle ID</th>

              <th>Owner </th>

              <th>Brand</th>

              <th>Name</th>

              <th>Type</th>

              <th>Oil Status</th>

              <th>Action</th>

            </tr>

          </thead>


          <tbody>

            {data.map((v) => (

              <tr key={v.id}>

                <td>
                  {v.vehicle_id}
                </td>
                
                <td>
                  {v.owner}
                </td>

                <td>
                  {v.brand}
                </td>

                <td>
                  {v.name}
                </td>

                <td>
                  {v.type}
                </td>

                <td>

                  <span
                    className={
                      v.status === "Normal"
                        ? "badge green"
                        : v.status === "Soon"
                        ? "badge orange"
                        : "badge red"
                    }
                  >
                    {v.status}
                  </span>

                </td>

                <td>

                  {/* <button
                    className="view-btn"
                    onClick={() =>
                      navigate(
                        `/vehicle/${v.id}`
                      )
                    }
                  >
                    <FaEye />
                  </button> */}
                  <button
className="view-btn"
onClick={() =>
navigate(
`/vehicle/${v.id}`
)
}
>
<FaEye />
</button>

<button
className="view-btn"
onClick={() =>
setDelId(v.id)
}
>
<FaTrash />
</button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>



      {/* PAGINATION */}

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


{/* MODAL */}
{delId && (

<ConfirmModal
text="Delete this vehicle?"
onCancel={() =>
setDelId(null)
}
onConfirm={deleteVehicle}
/>

)}

    </div>

  );

}