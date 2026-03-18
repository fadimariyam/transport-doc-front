import "../styles/viewPage.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

import {
  FaDownload,
  FaPrint,
  FaEye,
  FaTrash,
  FaFile,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
} from "react-icons/fa";

import ConfirmModal from "../components/ConfirmModal";

export default function ViewVehicle() {

const nav = useNavigate();
const { id } = useParams();
const API = import.meta.env.VITE_API;

/* ================= STATE ================= */

const [edit, setEdit] = useState(false);
const [docs, setDocs] = useState([]);
const [deleteId, setDeleteId] = useState(null);
const [statFilter, setStatFilter] = useState("all");

const [form, setForm] = useState(null);

const [oil, setOil] = useState({
  current: 0,
  last: 0,
  interval: 0,
});


/*================OIL STATUS==============*/
const getStatus = (expiry) => {

  const today = new Date();
  const exp = new Date(expiry);

  const diff =
    (exp - today) /
    (1000 * 60 * 60 * 24);

  if (diff < 0) return "Expired";
  if (diff < 30) return "Soon";

  return "Valid";
};

/* ================= LOAD VEHICLE ================= */

const loadVehicle = async () => {

  try {

    const res = await axios.get(
      // "http://localhost:5000/api/vehicles/" + id,
        API + "/vehicles/" + id,
      {
        headers: {
          Authorization:
            "Bearer " +
            localStorage.getItem("token"),
        },
      }
    );

    const v = res.data;

    setForm(v);

    const interval =
      v.next_oil - v.last_oil;

    setOil({
      current: v.current_km || 0,
      last: v.last_oil || 0,
      interval: interval || 0,
    });

  } catch (err) {
    console.log(err);
  }

};


/* ================= LOAD DOCS ================= */

const loadDocs = async () => {

  try {

    const res = await axios.get(
      // "http://localhost:5000/api/documents",
      //  `${API}/documents?item_type=vehicle&item_id=${id}`,
      `${API}/documents`,
      {
        params: {
          item_type: "vehicle",
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
    loadVehicle();
    loadDocs();
  }

}, [id]);


/* ================= OIL ================= */

const nextOil =
  Number(oil.last) +
  Number(oil.interval);

let oilStatus = "Normal";

if (oil.current > nextOil)
  oilStatus = "Expired";
else if (oil.current >= nextOil - 500)
  oilStatus = "Soon";


/* ================= ADD DOC ================= */

const addDoc = () => {

  setDocs([
    ...docs,
    {
      id: Date.now(),
      name: "",
      expiry: "",
      status: "Valid",
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
  formData.append("item_type", "vehicle");
  formData.append("item_id", id);
  formData.append("name", doc.name);
  formData.append("expiry", doc.expiry);

  await axios.post(
    // "http://localhost:5000/api/documents/upload",
    API + "/documents/upload" ,
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


/* ================= SAVE VEHICLE ================= */

const saveVehicle = async () => {

  try {

    const next =
      Number(oil.last) +
      Number(oil.interval);

    await axios.put(
      // "http://localhost:5000/api/vehicles/" + id,
      `${API}/vehicles/${id}`,
      {
        name: form.name,
        type: form.type,
        brand: form.brand,
        plate: form.plate,
        owner: form.owner,
        category: form.category,

        current_km: Number(oil.current),
        last_oil: Number(oil.last),
        next_oil: Number(next),
        status: oilStatus,
      },
      {
        headers: {
          Authorization:
            "Bearer " +
            localStorage.getItem("token"),
        },
      }
    );
   alert("Vehicle updated ✅");

  } catch (err) {
    console.log(err.response?.data || err);
    alert("Update failed ❌");

  }

};

/* ================= SAVE ALL ================= */

const saveAll = async () => {

  await saveVehicle();

  for (let d of docs) {

    if (d.file) {
      await uploadDoc(d);
      alert(
d.name + " uploaded"
);

    }

  }
 alert("Saved successfully ✅");

  setEdit(false);

  loadVehicle();
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


/*======================DOC-STATS=========== */
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

{/* TITLE */}

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


{/* VEHICLE DETAILS */}

<div className="viewv-card">

<div className="viewv-card-header">

<div className="viewv-icon">🚚</div>

<div className="viewv-head">
VEHICLE DETAILS
</div>

</div>

<div className="viewv-details">

<div>
<span>VEHICLE ID</span>
<b>{form.vehicle_id}</b>
</div>


<div>
<span>BRAND</span>

{edit ? (
<input
value={form.brand || ""}
onChange={(e)=>
setForm({
...form,
brand: e.target.value
})
}
/>
) : (
<b>{form.brand || "-"}</b>
)}

</div>


<div>
<span>VEHICLE NAME</span>

{edit ? (
<input
value={form.name || ""}
onChange={(e)=>
setForm({
...form,
name: e.target.value
})
}
/>
) : (
<b>{form.name || "-"}</b>
)}

</div>


<div>
<span>PLATE</span>

{edit ? (
<input
value={form.plate || ""}
onChange={(e)=>
setForm({
...form,
plate: e.target.value
})
}
/>
) : (
<b>{form.plate || "-"}</b>
)}

</div>


<div>
<span>OWNER</span>

{edit ? (
<input
value={form.owner || ""}
onChange={(e)=>
setForm({
...form,
owner: e.target.value
})
}
/>
) : (
<b>{form.owner || "-"}</b>
)}

</div>

<div>
<span>CATEGORY</span>

{edit ? (
<select
value={form.category || "Fixed"}
onChange={(e)=>
setForm({
...form,
category: e.target.value
})
}
>
<option value="Fixed">Fixed</option>
<option value="Common">Common</option>
</select>
) : (
<b>{form.category || "-"}</b>
)}

</div>

<div>
<span>TYPE</span>

{edit ? (
<input
value={form.type || ""}
onChange={(e)=>
setForm({
...form,
type: e.target.value
})
}
/>
) : (
<b>{form.type || "-"}</b>
)}

</div>


<div>
<span>CURRENT KM</span>

{edit ? (
<input
value={oil.current}
onChange={(e)=>
setOil({
...oil,
current: e.target.value
})
}
/>
) : (
<b>{oil.current}</b>
)}

</div>


<div>
<span>LAST OIL KM</span>

{edit ? (
<input
value={oil.last}
onChange={(e)=>
setOil({
...oil,
last: e.target.value
})
}
/>
) : (
<b>{oil.last}</b>
)}

</div>


<div>
<span>INTERVAL</span>

{edit ? (
<input
value={oil.interval}
onChange={(e)=>
setOil({
...oil,
interval: e.target.value
})
}
/>
) : (
<b>{oil.interval}</b>
)}

</div>


<div>
<span>NEXT OIL KM</span>
<b>{nextOil}</b>
</div>


<div>
<span>OIL STATUS</span>

<b
className={
oilStatus === "Normal"
? "viewv-status ok"
: oilStatus === "Soon"
? "viewv-status soon"
: "viewv-status expired"
}
>
{oilStatus}
</b>

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

<label>Document Name</label>

<input
className="viewv-input"
value={d.name}
disabled={!edit}
onChange={(e) =>
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
onChange={(e) =>
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
onChange={(e) =>
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
onClick={() => {

  if (!d.url) {
    alert("No file");
    return;
  }

  const fileUrl =
    d.url.startsWith("http")
      ? d.url
      // : "http://localhost:5000/" + d.url;
      : `${API.replace("/api","")}/${d.url}`;

  window.open(fileUrl, "_blank");

}}
>
<FaEye />
</button>


<button
onClick={async () => {

  if (!d.url) return;

  try {

    const res = await fetch(d.url);

    const blob = await res.blob();

    const url =
      window.URL.createObjectURL(blob);

    const fileName =
      d.url.split("/").pop();

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      fileName || "file";

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);

  } catch (err) {

    console.log(err);

    alert("Download failed");

  }

}}
>
<FaDownload />
</button>


{edit && (

<button
className="viewv-del"
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



{/* QR CARD */}

<div className="viewv-card">

<div className="viewv-card-header">

<div className="viewv-icon">
🔳
</div>

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
{form.vehicle_id} — {form.name}
</div>


<div className="viewv-qr-sub">
Permanent QR • Does not change on edit
</div>


<div className="viewv-qr-actions">

<button className="qr-btn"
onClick={async () => {

  const url =
    `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${form.qr}`;

  const res = await fetch(url);

  const blob = await res.blob();

  const blobUrl =
    window.URL.createObjectURL(blob);

  const a =
    document.createElement("a");

  a.href = blobUrl;

  a.download =
    form.vehicle_id + ".png";

  document.body.appendChild(a);

  a.click();

  a.remove();

  window.URL.revokeObjectURL(blobUrl);

}}
>
<FaDownload /> Download
</button>

<button className="qr-btn"
onClick={() => {

  const url =
    `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${form.qr}`;

  const win = window.open("", "PRINT");

  win.document.write(`
    <html>
      <head>
        <title>Print QR</title>
      </head>
      <body style="text-align:center;">
        <img src="${url}" />
        <script>
          window.onload = function() {
            window.print();
            window.close();
          }
        </script>
      </body>
    </html>
  `);

  win.document.close();

}}>
<FaPrint /> Print
</button>

</div>

</div>


</div>


</div>


{/* DELETE CONFIRM */}

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