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

export default function Equipments() {

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

  const loadEquipments = async () => {

    try {

      const res = await axios.get(
        API + "/equipments",
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

    loadEquipments();

  }, [page, limit, search]);



/*============DELETE========== */
const deleteEquipment = async () => {

  await axios.delete(
    API + "/equipments/" + delId,
    {
      headers: {
        Authorization:
          "Bearer " + token,
      },
    }
  );

  setDelId(null);

  loadEquipments();

};

  /* PAGINATION */

  const totalPages =
    Math.ceil(total / limit);



  return (

    <div className="dashboard-container">


      {/* TITLE */}

      <div className="dashboard-title">
        Equipments
      </div>



      {/* TOOLBAR */}

      <div className="toolbar">


        <div className="filters">

          <button
            className="add-btn"
            onClick={() =>
              navigate("/add-equipment")
            }
          >
            <FaPlus /> Add Equipment
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
              placeholder="Search equipment"
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

              <th>Equipment ID</th>

              <th>Name</th>

              <th>Type</th>

              <th>Serial</th>

              {/* <th>Warranty</th> */}

              <th>Action</th>

            </tr>

          </thead>


          <tbody>

            {data.map((e) => (

              <tr key={e.id}>

                <td>
                  {e.equipment_id}
                </td>

                <td>
                  {e.name}
                </td>

                <td>
                  {e.type}
                </td>

                <td>
                  {e.serial}
                </td>

                {/* <td>
               {
e.warranty
? new Date(e.warranty)
  .toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  )
: "-"
}

                </td> */}

                <td>

                  <button
className="view-btn"
onClick={() =>
navigate(`/equipment/${e.id}`)
}
>
<FaEye />
</button>

<button
className="view-btn"
onClick={() =>
setDelId(e.id)
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
text="Delete this equipment?"
onCancel={() =>
setDelId(null)
}
onConfirm={deleteEquipment}
/>

)}

    </div>

  );

}