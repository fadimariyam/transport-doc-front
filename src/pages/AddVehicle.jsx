import "../styles/addForm.css";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import TypeModal from "../components/TypeModal";

import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";

export default function AddVehicle() {

  const nav = useNavigate();

  const token = localStorage.getItem("token");

  const API = import.meta.env.VITE_API;



  /* ================= TYPES ================= */

  const [types, setTypes] = useState([]);

  const loadTypes = async () => {

    const res = await axios.get(
      API + "/types?category=vehicle",
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    setTypes(res.data.map(t => t.name));

  };

  useEffect(() => {
    loadTypes();
  }, []);




  /* ================= MODAL ================= */

  const [showModal, setShowModal] = useState(false);

  const addType = async (newType) => {

    await axios.post(
      API + "/types",
      { name: newType,
        category:"vehicle",
       },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    loadTypes();

    setForm({
      ...form,
      type: newType,
    });

  };



  /* ================= DATE ================= */

  const [date, setDate] = useState(null);



  /* ================= FORM ================= */
const [form, setForm] = useState({

  brand: "",
  name: "",
  plate: "",
  owner: "",
  category: "Fixed",
  type: "",

  current_km: 0,
  last_oil: 0,
  interval: 3000,

});

  const change = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };



  /* ================= DOCUMENTS ================= */

  const [docs, setDocs] = useState([]);

  const addDoc = () => {

    setDocs([
      ...docs,
      {
        name: "",
        expiry: "",
        file: null,
      },
    ]);

  };



  /* ================= REGISTER VEHICLE ================= */


const register = async () => {

  try {

    const token = localStorage.getItem("token");

    /* ================= 1 CREATE VEHICLE ================= */

    const vehicleRes = await axios.post(
      API + "/vehicles",
      {
        name: form.name,
        type: form.type,
        brand: form.brand,
        plate: form.plate,
        owner: form.owner,
        category: form.category,

        current_km: Number(form.current_km || 0),
        last_oil: Number(form.last_oil || 0),
        interval: Number(form.interval || 3000),

      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    console.log("vehicle created", vehicleRes.data);

    const vehicleId = vehicleRes.data.id;



    /* ================= 2 REGISTER QR ================= */

    const qrRes = await axios.post(
      API + "/register/vehicle",
      { id: vehicleId },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    console.log("qr generated", qrRes.data);



    /* ================= 3 UPLOAD DOCUMENTS ================= */

    for (let d of docs) {

      if (!d.file) continue;

      const fd = new FormData();

      fd.append("file", d.file);
      fd.append("item_type", "vehicle");
      fd.append("item_id", vehicleId);
      fd.append("name", d.name);
      fd.append("expiry", d.expiry);

      await axios.post(
        API + "/documents/upload",
        fd,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

    }



    alert("Vehicle Registered");

    nav("/vehicles");

  } catch (err) {

    console.log(err.response?.data || err);

    alert("Register error");

  }

};


  /* ================= UI ================= */

  return (

    <div className="add-page">


      {/* breadcrumb */}

      <div className="breadcrumb">

        <span onClick={() => nav("/dashboard")}>
          Dashboard »
        </span>

        <span onClick={() => nav("/vehicles")}>
          Vehicles »
        </span>

        Add Vehicle

      </div>

      <hr className="dashed" />

      <h2>Add New Vehicle</h2>

      <p>
        Fill in the details to register a new vehicle
      </p>



      {/* CARD */}

      <div className="add-card">

        <div className="card-title">
          Vehicle Details
        </div>


        <div className="form-grid">


          <div className="form-group">

            <label>BRAND NAME</label>

            <input
              name="brand"
              value={form.brand}
              onChange={change}
            />

          </div>


          <div className="form-group">

            <label>VEHICLE NAME</label>

            <input
              name="name"
              value={form.name}
              onChange={change}
            />

          </div>


          <div className="form-group">

            <label>PLATE NUMBER</label>

            <input
              name="plate"
              value={form.plate}
              onChange={change}
            />

          </div>


          <div className="form-group">

            <label>OWNER</label>

            <input
              name="owner"
              value={form.owner}
              onChange={change}
            />

          </div>



          {/* CATEGORY */}

          <div className="form-group">

            <label>CATEGORY</label>

            <div className="radio-group">

              <label>

                <input
                  type="radio"
                  name="category"
                  value="Fixed"
                  checked={
                    form.category === "Fixed"
                  }
                  onChange={change}
                />

                Fixed

              </label>


              <label>

                <input
                  type="radio"
                  name="category"
                  value="Common"
                  checked={
                    form.category === "Common"
                  }
                  onChange={change}
                />

                Common

              </label>

            </div>

          </div>



          {/* TYPE */}

          <div className="form-group">

            <label>TYPE</label>

            <div className="type-row">

              <select
                name="type"
                value={form.type}
                onChange={change}
              >

                {types.map((t, i) => (
                  <option key={i}>
                    {t}
                  </option>
                ))}

              </select>


              <button
                className="add-type-btn"
                onClick={() =>
                  setShowModal(true)
                }
              >
                +
              </button>

            </div>

          </div>
        
        {/* CURRENT KM */}

<div className="form-group">

  <label>CURRENT KM</label>

  <input
    name="current_km"
    value={form.current_km}
    onChange={change}
  />

</div>


{/* LAST OIL */}

<div className="form-group">

  <label>LAST OIL KM</label>

  <input
    name="last_oil"
    value={form.last_oil}
    onChange={change}
  />

</div>


{/* INTERVAL */}

<div className="form-group">

  <label>OIL INTERVAL</label>

  <input
    name="interval"
    value={form.interval}
    onChange={change}
  />

</div>


          {/* DATE */}

          <div className="form-group">

            <label>NEXT OIL DATE</label>

            <div className="date-wrapper">

              <DatePicker
                selected={date}
                onChange={setDate}
                className="date-input"
              />

              <FaCalendarAlt className="date-icon" />

            </div>

          </div>


        </div>



        <div className="card-footer">

          <button
            className="cancel-btn"
            onClick={() => nav(-1)}
          >
            Cancel
          </button>

          <button
            className="register-btn"
            onClick={register}
          >
            ✓ Register Vehicle
          </button>

        </div>

      </div>

    {/* ================= DOCUMENT CARD ================= */}

<div className="add-card">

  <div className="card-title">
    Document Upload
  </div>


  <div className="doc-list">


    {docs.map((d, i) => (

      <div
        key={i}
        className="doc-card"
      >

        <div className="doc-head">
          Document
        </div>


        <div className="doc-row">

          {/* NAME */}

          <div className="doc-field">

            <label>
              NAME
            </label>

            <input
              value={d.name}
              onChange={(e) => {

                const arr = [...docs];

                arr[i].name =
                  e.target.value;

                setDocs(arr);

              }}
            />

          </div>



          {/* EXPIRY */}

          <div className="doc-field">

            <label>
              EXPIRY
            </label>

            <input
              type="date"
              value={d.expiry}
              onChange={(e) => {

                const arr = [...docs];

                arr[i].expiry =
                  e.target.value;

                setDocs(arr);

              }}
            />

          </div>



          {/* FILE */}

          <div className="doc-field">

            <label>
              FILE
            </label>

            <input
              type="file"
              onChange={(e) => {

                const arr = [...docs];

                arr[i].file =
                  e.target.files[0];

                setDocs(arr);

              }}
            />

          </div>



          {/* DELETE */}

          <button
            className="delete-doc"
            onClick={() => {

              setDocs(
                docs.filter(
                  (_, x) =>
                    x !== i
                )
              );

            }}
          >
            ✕
          </button>

        </div>

      </div>

    ))}



    <button
      className="save-doc"
      onClick={addDoc}
    >
      + Add Document
    </button>


  </div>

</div>

      {/* MODAL */}

      {showModal && (

        <TypeModal
          close={() =>
            setShowModal(false)
          }
          addType={addType}
        />

      )}

    </div>

  );

}