import "../styles/viewPage.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

import {
  FaDownload,
  FaPrint,
  FaEye,
  FaFile,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
} from "react-icons/fa";

import ConfirmModal from "../components/ConfirmModal";

export default function ViewEquipment() {

const nav = useNavigate();
const { id } = useParams();
const API = import.meta.env.VITE_API;
/* ================= STATE ================= */

const [edit, setEdit] = useState(false);
const [docs, setDocs] = useState([]);
const [deleteId, setDeleteId] = useState(null);
const [statFilter, setStatFilter] = useState("all");

const [form, setForm] = useState(null);


/* ================= STATUS ================= */

const getStatus = (expiry) => {

  if (!expiry) return "Valid";

  const today = new Date();
  const exp = new Date(expiry);

  const diff =
    (exp - today) /
    (1000 * 60 * 60 * 24);

  if (diff < 0) return "Expired";
  if (diff < 30) return "Soon";

  return "Valid";
};


/* ================= LOAD EQUIPMENT ================= */

const loadEquipment = async () => {

  try {

    const res = await axios.get(
      // "http://localhost:5000/api/equipments/" + id,
       API + "/equipments/" + id,
      {
        headers: {
          Authorization:
            "Bearer " +
            localStorage.getItem("token"),
        },
      }
    );

    setForm(res.data);

  } catch (err) {
    console.log(err);
  }

};


/* ================= LOAD DOCS ================= */

const loadDocs = async () => {

  try {

    const res = await axios.get(
      // "http://localhost:5000/api/documents",
        API + "/documents" ,
      {
        params: {
          item_type: "equipment",
          item_id: id,
        },
        headers: {
          Authorization:
            "Bearer " +
            localStorage.getItem("token"),
        },
      }
    );

    setDocs(res.data);

  } catch (err) {
    console.log(err);
  }

};


useEffect(() => {

  if (id) {
    loadEquipment();
    loadDocs();
  }

}, [id]);


/* ================= ADD DOC ================= */

const addDoc = () => {

  setDocs([
    ...docs,
    {
      id: Date.now(),
      name: "",
      expiry: "",
      file: null,
    },
  ]);

};


/* ================= CHANGE DOC ================= */

const changeDoc = (id, field, value) => {

  setDocs(
    docs.map(d =>
      d.id === id
        ? { ...d, [field]: value }
        : d
    )
  );

};


/* ================= DELETE ================= */

const confirmDelete = async () => {

  try {

    await axios.delete(
      // "http://localhost:5000/api/documents/" +
        API + "/documents/" +
        deleteId,
      {
        headers: {
          Authorization:
            "Bearer " +
            localStorage.getItem("token"),
        },
      }
    );

    setDeleteId(null);

    loadDocs();

  } catch (err) {
    console.log(err);
  }

};


/* ================= UPLOAD ================= */

const uploadDoc = async (doc) => {

  const formData = new FormData();

  formData.append("file", doc.file);
  formData.append("item_type", "equipment");
  formData.append("item_id", id);
  formData.append("name", doc.name);
  formData.append("expiry", doc.expiry);

  await axios.post(
    // "http://localhost:5000/api/documents/upload",
      API + "/documents/uploads",
    formData,
    {
      headers: {
        Authorization:
          "Bearer " +
          localStorage.getItem("token"),
      },
    }
  );

};


/* ================= SAVE ================= */

const saveEquipment = async () => {

  try {

    await axios.put(
      // "http://localhost:5000/api/equipments/" + id,
        API + "/equipments/" + id,
      form,
      {
        headers: {
          Authorization:
            "Bearer " +
            localStorage.getItem("token"),
        },
      }
    );

  } catch (err) {
    console.log(err);
  }

};


const saveAll = async () => {

  await saveEquipment();

  for (let d of docs) {

    if (d.file) {
      await uploadDoc(d);
    }

  }

  setEdit(false);

  loadEquipment();
  loadDocs();

};


/* ================= FILTER ================= */

const filteredDocs =
  statFilter === "all"
    ? docs
    : docs.filter(
        d =>
          getStatus(d.expiry)
            .toLowerCase() ===
          statFilter
      );


if (!form) return null;


/* ================= STATS ================= */

const totalDocs = docs.length;

const validDocs =
  docs.filter(
    d => getStatus(d.expiry) === "Valid"
  ).length;

const soonDocs =
  docs.filter(
    d => getStatus(d.expiry) === "Soon"
  ).length;

const expiredDocs =
  docs.filter(
    d => getStatus(d.expiry) === "Expired"
  ).length;


/* ================= UI ================= */

return (

<div className="viewv-page">

<div className="viewv-title-row">

<h2 className="viewv-title">
{form.name}
</h2>

<div className="viewv-actions">

{!edit && (
<button
className="viewv-btn"
onClick={() => setEdit(true)}
>
Edit
</button>
)}

{edit && (
<>
<button
className="viewv-btn cancel"
onClick={() => setEdit(false)}
>
Cancel
</button>

<button
className="viewv-btn save"
onClick={saveAll}
>
Save
</button>
</>
)}

</div>

</div>



<div className="viewv-grid">


{/* LEFT */}

<div className="viewv-left">


{/* DETAILS */}

<div className="viewv-card">

<div className="viewv-card-header">

<div className="viewv-icon">🏗️</div>

<div className="viewv-head">
EQUIPMENT DETAILS
</div>

</div>


<div className="viewv-details">

<div>
<span>ID</span>
<b>{form.equipment_id}</b>
</div>

<div>
<span>Name</span>

{edit ? (
<input
value={form.name || ""}
onChange={(e)=>
setForm({
...form,
name:e.target.value
})
}
/>
) : (
<b>{form.name}</b>
)}

</div>

<div>
<span>Type</span>

{edit ? (
<input
value={form.type || ""}
onChange={(e)=>
setForm({
...form,
type:e.target.value
})
}
/>
) : (
<b>{form.type}</b>
)}

</div>

<div>
<span>Serial</span>

{edit ? (
<input
value={form.serial || ""}
onChange={(e)=>
setForm({
...form,
serial:e.target.value
})
}
/>
) : (
<b>{form.serial}</b>
)}

</div>

<div>
<span>Handled</span>

{edit ? (
<input
value={form.handled || ""}
onChange={(e)=>
setForm({
...form,
handled:e.target.value
})
}
/>
) : (
<b>{form.handled}</b>
)}

</div>

<div>
<span>Warranty</span>
<b>{form.warranty?.slice(0,10)}</b>
</div>

</div>

</div>



{/* DOCUMENTS */}

<div className="viewv-card">

<div className="viewv-card-header">

<div className="viewv-icon">📄</div>

<div className="viewv-head">
DOCUMENTS
</div>

{edit && (
<button
className="viewv-add"
onClick={addDoc}
>
+ ADD
</button>
)}

</div>


<div className="viewv-doc-grid">

{filteredDocs.map((d) => (

<div
key={d.id}
className="viewv-doc"
>

<div className="viewv-field">

<label>Name</label>

<input
className="viewv-input"
value={d.name}
disabled={!edit}
onChange={(e)=>
changeDoc(
d.id,
"name",
e.target.value
)
}
/>

</div>


<div className="viewv-field">

<label>Expiry</label>

<input
type="date"
className="viewv-input"
value={d.expiry?.slice(0,10)}
disabled={!edit}
onChange={(e)=>
changeDoc(
d.id,
"expiry",
e.target.value
)
}
/>

</div>


{edit && (

<div className="viewv-field">

<label>Upload</label>

<input
type="file"
onChange={(e)=>
changeDoc(
d.id,
"file",
e.target.files[0]
)
}
/>

</div>

)}


<div
className={
"viewv-status " +
(
getStatus(d.expiry) === "Valid"
? "ok"
: getStatus(d.expiry) === "Soon"
? "soon"
: "expired"
)
}
>
{getStatus(d.expiry)}
</div>


<div className="viewv-doc-actions">

<button
onClick={() => window.open(d.url)}
>
<FaEye />
</button>

<button
onClick={() => window.open(d.url)}
>
<FaDownload />
</button>

{edit && (

<button
onClick={() =>
setDeleteId(d.id)
}
>
❌
</button>

)}

</div>

</div>

))}

</div>

</div>

</div>


{/* RIGHT */}

<div className="viewv-right">


{/* STATS */}

<div className="viewv-stats">

<div
className="viewv-stat s1"
onClick={() =>
setStatFilter("all")
}
>
<FaFile />
<span>
{totalDocs}
<small>Total</small>
</span>
</div>


<div
className="viewv-stat s2"
onClick={() =>
setStatFilter("valid")
}
>
<FaCheckCircle />
<span>
{validDocs}
<small>Valid</small>
</span>
</div>


<div
className="viewv-stat s3"
onClick={() =>
setStatFilter("soon")
}
>
<FaClock />
<span>
{soonDocs}
<small>Soon</small>
</span>
</div>


<div
className="viewv-stat s4"
onClick={() =>
setStatFilter("expired")
}
>
<FaExclamationTriangle />
<span>
{expiredDocs}
<small>Expired</small>
</span>
</div>

</div>


{/* QR */}

<div className="viewv-card">

<div className="viewv-card-header">

<div className="viewv-icon">🔳</div>

<div className="viewv-head">
QR CODE
</div>

</div>


<div className="viewv-qr-box">

{form.qr ? (

<img
className="viewv-qr"
src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${form.qr}`}
/>

) : (

<div className="viewv-qr">
QR
</div>

)}

</div>


<div className="viewv-qr-text">
{form.equipment_id} — {form.name}
</div>


</div>

</div>


</div>


{deleteId && (

<ConfirmModal
text="Delete this document?"
onCancel={() =>
setDeleteId(null)
}
onConfirm={confirmDelete}
/>

)}

</div>

);

}