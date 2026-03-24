// import "../styles/viewPage.css";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";

// import {
//   FaDownload,
//   FaPrint,
//   FaEye,
//   FaFile,
//   FaCheckCircle,
//   FaClock,
//   FaExclamationTriangle,
// } from "react-icons/fa";

// import ConfirmModal from "../components/ConfirmModal";

// export default function ViewEquipment() {

// const nav = useNavigate();
// const { id } = useParams();
// const API = import.meta.env.VITE_API;
// /* ================= STATE ================= */

// const [edit, setEdit] = useState(false);
// const [docs, setDocs] = useState([]);
// const [newDocs, setNewDocs] = useState([]);  
// const [deleteId, setDeleteId] = useState(null);
// const [statFilter, setStatFilter] = useState("all");

// const [form, setForm] = useState(null);


// /* ================= STATUS ================= */

// const getStatus = (expiry) => {

//   if (!expiry) return "Valid";

//   const today = new Date();
//   const exp = new Date(expiry);

//   const diff =
//     (exp - today) /
//     (1000 * 60 * 60 * 24);

//   if (diff < 0) return "Expired";
//   if (diff < 30) return "Soon";

//   return "Valid";
// };


// /* ================= LOAD EQUIPMENT ================= */

// const loadEquipment = async () => {

//   try {

//     const res = await axios.get(
//        API + "/equipments/" + id,
//       {
//         headers: {
//           Authorization:
//             "Bearer " +
//             localStorage.getItem("token"),
//         },
//       }
//     );

//     setForm(res.data);

//   } catch (err) {
//     console.log(err);
//   }

// };


// /* ================= LOAD DOCS ================= */

// const loadDocs = async () => {

//   try {

//     const res = await axios.get(
//         `${API}/documents`,
//       {
//         params: {
//           item_type: "equipment",
//           item_id: id,
//         },
//         headers: {
//           Authorization:
//             "Bearer " +
//             localStorage.getItem("token"),
//         },
//       }
//     );

//     setDocs(res.data||[]);

//   } catch (err) {
//     console.log(err);
//   }

// };


// useEffect(() => {

//   if (id) {
//     loadEquipment();
//     loadDocs();
//   }

// }, [id]);


// /* ================= ADD DOC ================= */

// const addDoc = () => {

//   setNewDocs([
//     ...newDocs,
//     {
//       id: Date.now(),
//       name: "",
//       expiry: "",
//       file: null,
//     },
//   ]);

// };

// /* ================= CHANGE DOC ================= */

// // const changeDoc = (id, field, value) => {

// //   setDocs(
// //     docs.map(d =>
// //       d.id === id
// //         ? { ...d, [field]: value }
// //         : d
// //     )
// //   );

// // };

// const changeDoc = (id, field, value) => {

//   setDocs(
//     docs.map(d =>
//       d.id === id
//         ? { ...d, [field]: value }
//         : d
//     )
//   );

//   setNewDocs(
//     newDocs.map(d =>
//       d.id === id
//         ? { ...d, [field]: value }
//         : d
//     )
//   );

// };

// /* ================= DELETE ================= */

// const confirmDelete = async () => {

//   try {
 
//     if (!deleteId) return;

//     await axios.delete(
    
//         `${API}/documents/${deleteId}`,
//       {
//         headers: {
//           Authorization:
//             "Bearer " +
//             localStorage.getItem("token"),
//         },
//       }
//     );

//     setDeleteId(null);

//     loadDocs();

//   } catch (err) {
//     console.log(err.response?.data || err);
//     alert("Delete failed ❌");
//   }

// };


// /* ================= UPLOAD ================= */

// const uploadDoc = async (doc) => {

//   const formData = new FormData();

//   formData.append("file", doc.file);
//   formData.append("item_type", "equipment");
//   formData.append("item_id", id);
//   formData.append("name", doc.name);
//   formData.append("expiry", doc.expiry);

//   await axios.post(
//       API + "/documents/upload",
//     formData,
//     {
//       headers: {
//         Authorization:
//           "Bearer " +
//           localStorage.getItem("token"),
//       },
//     }
//   );

// };


// /* ================= SAVE ================= */

// const saveEquipment = async () => {

//   try {

//     await axios.put(
//       `${API}/equipments/${id}`,
//       form,
//       {
//         headers: {
//           Authorization:
//             "Bearer " +
//             localStorage.getItem("token"),
//         },
//       }
//     );

//     alert("Updated successfully ✅");

//   } catch (err) {

//     console.log(err.response?.data || err);
//     alert("Update failed ❌");

//   }

// };



// // const saveAll = async () => {

// //   await saveEquipment();

// //   // upload ONLY new docs
// //   for (let d of newDocs) {
// //     if (d.file) {
// //       await uploadDoc(d);
// //     }
// //   }

// //   alert("Saved successfully ✅");

// //   setEdit(false);

// //   setNewDocs([]); // clear temp docs

// //   loadEquipment();
// //   loadDocs();

// // };

// const saveAll = async () => {

//   try {

//     await saveEquipment();

//     for (let d of newDocs) {

//       if (d.file) {
//         await uploadDoc(d);
//       }

//     }

//     setEdit(false);
//     setNewDocs([]);

//     await loadEquipment();
//     await loadDocs();

//     alert("Saved successfully");

//   } catch (err) {

//     console.log(err);
//     alert("Save failed");

//   }

// };


// /* ================= FILTER ================= */

// const allDocs = [...docs, ...newDocs];

// const filteredDocs =
//   statFilter === "all"
//     ? allDocs
//     : allDocs.filter(
//         d =>
//           getStatus(d.expiry)
//             .toLowerCase() ===
//           statFilter
//       );


// if (!form) return null;


// /* ================= STATS ================= */

// const totalDocs = docs.length;

// const validDocs =
//   docs.filter(
//     d => getStatus(d.expiry) === "Valid"
//   ).length;

// const soonDocs =
//   docs.filter(
//     d => getStatus(d.expiry) === "Soon"
//   ).length;

// const expiredDocs =
//   docs.filter(
//     d => getStatus(d.expiry) === "Expired"
//   ).length;




// /*===============GET URL======================= */
// const getFileUrl = (url) => {

//   if (!url) return null;

//   if (url.startsWith("http")) {
//     return url;
//   }

//   const base =
//     import.meta.env.VITE_API.replace("/api", "");

//   return base + "/" + url.replace(/^\/+/, "");

// };



// /* ================= UI ================= */

// return (

// <div className="viewv-page">

// <div className="viewv-title-row">

// <h2 className="viewv-title">
// {form.name}
// </h2>

// <div className="viewv-actions">

// {!edit && (
// <button
// className="viewv-btn"
// onClick={() => setEdit(true)}
// >
// Edit
// </button>
// )}

// {edit && (
// <>
// <button
// className="viewv-btn cancel"
// onClick={() => setEdit(false)}
// >
// Cancel
// </button>

// <button
// className="viewv-btn save"
// onClick={saveAll}
// >
// Save
// </button>
// </>
// )}

// </div>

// </div>



// <div className="viewv-grid">


// {/* LEFT */}

// <div className="viewv-left">


// {/* DETAILS */}

// <div className="viewv-card">

// <div className="viewv-card-header">

// <div className="viewv-icon">🏗️</div>

// <div className="viewv-head">
// EQUIPMENT DETAILS
// </div>

// </div>


// <div className="viewv-details">

// <div>
// <span>ID</span>
// <b>{form.equipment_id}</b>
// </div>

// <div>
// <span>Name</span>

// {edit ? (
// <input
// value={form.name || ""}
// onChange={(e)=>
// setForm({
// ...form,
// name:e.target.value
// })
// }
// />
// ) : (
// <b>{form.name}</b>
// )}

// </div>

// <div>
// <span>Type</span>

// {edit ? (
// <input
// value={form.type || ""}
// onChange={(e)=>
// setForm({
// ...form,
// type:e.target.value
// })
// }
// />
// ) : (
// <b>{form.type}</b>
// )}

// </div>

// <div>
// <span>Serial</span>

// {edit ? (
// <input
// value={form.serial || ""}
// onChange={(e)=>
// setForm({
// ...form,
// serial:e.target.value
// })
// }
// />
// ) : (
// <b>{form.serial}</b>
// )}

// </div>

// <div>
// <span>Handled By</span>

// {edit ? (
// <input
// value={form.handled_by || ""}
// onChange={(e)=>
// setForm({
// ...form,
// handled_by:e.target.value
// })
// }
// />
// ) : (
// <b>{form.handled_by}</b>
// )}

// </div>

// <div>
// <span>Warranty</span>
// <b>{form.warranty?.slice(0,10)}</b>
// </div>

// </div>

// </div>



// {/* DOCUMENTS */}

// <div className="viewv-card">

// <div className="viewv-card-header">

// <div className="viewv-icon">📄</div>

// <div className="viewv-head">
// DOCUMENTS
// </div>

// {edit && (
// <button
// className="viewv-add"
// onClick={addDoc}
// >
// + ADD
// </button>
// )}

// </div>


// <div className="viewv-doc-grid">

// {filteredDocs.map((d) => (

// <div
// key={d.id}
// className="viewv-doc"
// >

// <div className="viewv-field">

// <label>Name</label>

// <input
// className="viewv-input"
// value={d.name}
// disabled={!edit}
// onChange={(e)=>
// changeDoc(
// d.id,
// "name",
// e.target.value
// )
// }
// />

// </div>


// <div className="viewv-field">

// <label>Expiry</label>

// <input
// type="date"
// className="viewv-input"
// value={d.expiry?.slice(0,10)}
// disabled={!edit}
// onChange={(e)=>
// changeDoc(
// d.id,
// "expiry",
// e.target.value
// )
// }
// />

// </div>


// {edit && (

// <div className="viewv-field">

// <label>Upload</label>

// <input
// type="file"
// onChange={(e)=>
// changeDoc(
// d.id,
// "file",
// e.target.files[0]
// )
// }
// />

// </div>

// )}


// <div
// className={
// "viewv-status " +
// (
// getStatus(d.expiry) === "Valid"
// ? "ok"
// : getStatus(d.expiry) === "Soon"
// ? "soon"
// : "expired"
// )
// }
// >
// {getStatus(d.expiry)}
// </div>


// <div className="viewv-doc-actions">

// <button
// onClick={() => {

//   if (!d.url) {
//     alert("No file");
//     return;
//   }

//   const fileUrl =getFileUrl(d.url);
//     // d.url.startsWith("http")
//     //   ? d.url
//     //   : `${API.replace("/api","")}/${d.url}`;

//   window.open(fileUrl, "_blank");

// }}
// >
// <FaEye />
// </button>



// <button
// onClick={() => {

//   const fileUrl = getFileUrl(d.url);

//   if (!fileUrl) {
//     alert("No file");
//     return;
//   }

//   const a = document.createElement("a");

//   a.href = fileUrl;
//   a.target = "_blank";
//   a.download = "";

//   document.body.appendChild(a);
//   a.click();
//   a.remove();

// }}
// >
// <FaDownload />
// </button>


// {edit && (

// <button
// onClick={async () => {

//   if (!d.url) {
//     alert("No file");
//     return;
//   }

//   try {

//     const fileUrl =
//       d.url.startsWith("http")
//         ? d.url
//         : `${API.replace("/api","")}/${d.url}`;

//     const res = await fetch(fileUrl);
//     const blob = await res.blob();

//     const url = window.URL.createObjectURL(blob);

//     const link = document.createElement("a");

//     link.href = url;
//     link.download = d.name || "file";

//     document.body.appendChild(link);
//     link.click();

//     link.remove();

//     window.URL.revokeObjectURL(url);

//   } catch (err) {

//     console.log(err);
//     alert("Download failed ❌");

//   }

// }}

// >
// ❌
// </button>

// )}

// </div>

// </div>

// ))}

// </div>

// </div>

// </div>


// {/* RIGHT */}

// <div className="viewv-right">


// {/* STATS */}

// <div className="viewv-stats">

// <div
// className="viewv-stat s1"
// onClick={() =>
// setStatFilter("all")
// }
// >
// <FaFile />
// <span>
// {totalDocs}
// <small>Total</small>
// </span>
// </div>


// <div
// className="viewv-stat s2"
// onClick={() =>
// setStatFilter("valid")
// }
// >
// <FaCheckCircle />
// <span>
// {validDocs}
// <small>Valid</small>
// </span>
// </div>


// <div
// className="viewv-stat s3"
// onClick={() =>
// setStatFilter("soon")
// }
// >
// <FaClock />
// <span>
// {soonDocs}
// <small>Soon</small>
// </span>
// </div>


// <div
// className="viewv-stat s4"
// onClick={() =>
// setStatFilter("expired")
// }
// >
// <FaExclamationTriangle />
// <span>
// {expiredDocs}
// <small>Expired</small>
// </span>
// </div>

// </div>


// {/* QR */}

// <div className="viewv-card">

// <div className="viewv-card-header">

// <div className="viewv-icon">🔳</div>

// <div className="viewv-head">
// QR CODE
// </div>

// </div>


// <div className="viewv-qr-box">

// {form.qr ? (

// <img
// className="viewv-qr"
// src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${form.qr}`}
// />

// ) : (

// <div className="viewv-qr">
// QR
// </div>

// )}

// </div>


// <div className="viewv-qr-text">
// {form.equipment_id} — {form.name}
// </div>


// </div>

// </div>


// </div>


// {deleteId && (

// <ConfirmModal
// text="Delete this document?"
// onCancel={() =>
// setDeleteId(null)
// }
// onConfirm={confirmDelete}
// />

// )}

// </div>

// );

// }
//---------------------------------------------------------------------------------------

import "../styles/viewPage.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

import {
  FaDownload,
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
const API = import.meta.env.VITE_API || "";

/* ================= STATE ================= */

const [edit, setEdit] = useState(false);
const [docs, setDocs] = useState([]);
const [newDocs, setNewDocs] = useState([]);
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

/* ================= FILE URL ================= */

const getFileUrl = (url) => {

  if (!url) return null;

  if (url.startsWith("http"))
    return url;

  const base =
    (API || "").replace("/api", "")

  return base + "/" + url.replace(/^\/+/, "");

};

/* ================= LOAD ================= */

const loadEquipment = async () => {

  const res = await axios.get(
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

};

const loadDocs = async () => {

  const res = await axios.get(
    `${API}/documents`,
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

  setDocs(res.data || []);

};

useEffect(() => {

  if (id) {
    loadEquipment();
    loadDocs();
  }

}, [id]);

/* ================= ADD DOC ================= */

const addDoc = () => {

  setNewDocs([
    ...newDocs,
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

  setNewDocs(
    newDocs.map(d =>
      d.id === id
        ? { ...d, [field]: value }
        : d
    )
  );

};

/* ================= DELETE ================= */

const confirmDelete = async () => {

  await axios.delete(
    `${API}/documents/${deleteId}`,
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

};

/* ================= UPLOAD ================= */

const uploadDoc = async (doc) => {

  const fd = new FormData();

  fd.append("file", doc.file);
  fd.append("item_type", "equipment");
  fd.append("item_id", id);
  fd.append("name", doc.name);
  fd.append("expiry", doc.expiry);

  await axios.post(
    API + "/documents/upload",
    fd,
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

  let warranty = form.warranty;

  // ✅ fix for DATE column
  if (!warranty || warranty === "") {
    warranty = null;
  }

  let status = "Normal";

  if (warranty) {

    const diff =
      (new Date(warranty) - Date.now()) /
      (1000 * 60 * 60 * 24);

    if (diff < 0) status = "Expired";
    else if (diff < 30) status = "Soon";

  }

  const payload = {
    name: form.name || "",
    type: form.type || "",
    serial: form.serial || "",
    handled_by: form.handled_by || "",
    warranty: warranty,   // ✅ null if empty
    status: status,
  };

  console.log("PUT payload =", payload);

  await axios.put(
    `${API}/equipments/${id}`,
    payload,
    {
      headers: {
        Authorization:
          "Bearer " +
          localStorage.getItem("token"),
      },
    }
  );

};

const saveAll = async () => {

  await saveEquipment();

  for (let d of newDocs) {

    if (d.file) {
      await uploadDoc(d);
    }

  }

  setEdit(false);
  setNewDocs([]);

  await loadEquipment();
  await loadDocs();

};

/* ================= FILTER ================= */

const allDocs = [...docs, ...newDocs];

const filteredDocs =
  statFilter === "all"
    ? allDocs
    : allDocs.filter(
        d =>
          getStatus(d.expiry)
            .toLowerCase() === statFilter
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
<span>Handled By</span>

{edit ? (
<input
value={form.handled_by || ""}
onChange={(e)=>
setForm({
...form,
handled_by:e.target.value
})
}
/>
) : (
<b>{form.handled_by}</b>
)}

</div>

{/* <div>
<span>Warranty</span>
<b>{form.warranty?.slice(0,10)}</b>
</div> */}
<div>
<span>Warranty</span>

{edit ? (

<input
type="date"
value={form.warranty?.slice(0,10) || ""}
onChange={(e)=>
setForm({
...form,
warranty: e.target.value
})
}
/>

) : (

<b>{form.warranty?.slice(0,10)}</b>

)}

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

{filteredDocs.map((d) => {

const fileUrl = getFileUrl(d.url);

return (

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
onClick={() => fileUrl && window.open(fileUrl)}
>
<FaEye />
</button>

<button
onClick={() => {

if (!fileUrl) return;

const a = document.createElement("a");

a.href = fileUrl;
a.target = "_blank";
a.download = "";

a.click();

}}
>
<FaDownload />
</button>

{edit && (

<button
onClick={() => {

if (!d.url) {
setNewDocs(
newDocs.filter(
x => x.id !== d.id
)
);
} else {
setDeleteId(d.id);
}

}}
>
❌
</button>

)}

</div>

</div>

);

})}

</div>

</div>

</div>



{/* RIGHT */}

<div className="viewv-right">

<div className="viewv-stats">

<div
className="viewv-stat s1"
onClick={() => setStatFilter("all")}
>
<FaFile />
<span>{totalDocs}<small>Total</small></span>
</div>

<div
className="viewv-stat s2"
onClick={() => setStatFilter("valid")}
>
<FaCheckCircle />
<span>{validDocs}<small>Valid</small></span>
</div>

<div
className="viewv-stat s3"
onClick={() => setStatFilter("soon")}
>
<FaClock />
<span>{soonDocs}<small>Soon</small></span>
</div>

<div
className="viewv-stat s4"
onClick={() => setStatFilter("expired")}
>
<FaExclamationTriangle />
<span>{expiredDocs}<small>Expired</small></span>
</div>

</div>


{/* QR */}

{/* <div className="viewv-card">

<div className="viewv-card-header">

<div className="viewv-icon">🔳</div>

<div className="viewv-head">
QR CODE
</div>

</div>

<div className="viewv-qr-box">

<img
className="viewv-qr"
src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${
window.location.origin + "/scan/" + form.qr.split("scan/")[1]
}`}
/>

</div>

<div className="viewv-qr-text">
{form.equipment_id} — {form.name}
</div>

</div> */}

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
  
{/*  */}

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