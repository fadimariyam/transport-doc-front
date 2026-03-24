import "../styles/addForm.css";


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import TypeModal from "../components/TypeModal";

import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";

export default function AddEquipment() {

  const nav = useNavigate();

  const token = localStorage.getItem("token");

  const API = import.meta.env.VITE_API;


  /* ================= TYPES ================= */

  const [types, setTypes] = useState([]);

  const loadTypes = async () => {

    const res = await axios.get(
      API + "/types?category=equipment",
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
        category: "equipment",
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

    name: "",
    type: "",
    serial: "",
    handled_by: "",
    warranty: "",

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


  /* ================= REGISTER ================= */

  const register = async () => {

    try {

      const res = await axios.post(
        API + "/equipments",
        {
          name: form.name,
          type: form.type,
          serial: form.serial,
          handled_by: form.handled_by,
          warranty: form.warranty,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      const equipmentId = res.data.id;


      /* QR */

      await axios.post(
        API + "/register/equipment",
        { id: equipmentId },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );


      /* DOCUMENTS */

      for (let d of docs) {

        if (!d.file) continue;

        const fd = new FormData();

        fd.append("file", d.file);
        fd.append("item_type", "equipment");
        fd.append("item_id", equipmentId);
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


      alert("Equipment Registered");

      nav("/equipments");

    } catch (err) {

      console.log(err);

      alert("Error");

    }

  };


  /* ================= UI ================= */

  return (

    <div className="add-page">


      <div className="breadcrumb">

        <span onClick={() => nav("/dashboard")}>
          Dashboard »
        </span>

        <span onClick={() => nav("/equipments")}>
          Equipments »
        </span>

        Add Equipment

      </div>

      <hr className="dashed" />

      <h2>Add New Equipment</h2>

      <p>
        Fill in the details to register new equipment
      </p>


      <div className="add-card">

        <div className="card-title">
          Equipment Details
        </div>


        <div className="form-grid">


          <div className="form-group">

            <label>NAME</label>

            <input
              name="name"
              value={form.name}
              onChange={change}
            />

          </div>


          <div className="form-group">

            <label>SERIAL</label>

            <input
              name="serial"
              value={form.serial}
              onChange={change}
            />

          </div>


          <div className="form-group">

            <label>HANDLED BY</label>

            <input
              name="handled_by"
              value={form.handled_by}
              onChange={change}
            />

          </div>


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
                onClick={() => setShowModal(true)}
              >
                +
              </button>

            </div>

          </div>


          <div className="form-group">

            <label>WARRANTY</label>

            <div className="date-wrapper">

              <DatePicker
                selected={date}
                onChange={(d) => {
                  setDate(d);
                  setForm({
                    ...form,
                    warranty: d,
                  });
                }}
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
            ✓ Register Equipment
          </button>

        </div>

      </div>


      {/* DOCUMENTS */}

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


                <div className="doc-field">

                  <label>NAME</label>

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


                <div className="doc-field">

                  <label>EXPIRY</label>

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


                <div className="doc-field">

                  <label>FILE</label>

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


      {showModal && (

        <TypeModal
          close={() => setShowModal(false)}
          addType={addType}
        />

      )}

    </div>

  );

}