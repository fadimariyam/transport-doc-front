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
  const API = import.meta.env.VITE_API || "";

  const [edit, setEdit]         = useState(false);
  const [docs, setDocs]         = useState([]);
  const [newDocs, setNewDocs]   = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [statFilter, setStatFilter] = useState("all");
  const [form, setForm]         = useState(null);

  /* ---- helpers ---- */
  const getStatus = (expiry) => {
    if (!expiry) return "Valid";
    const diff = (new Date(expiry) - new Date()) / (1000 * 60 * 60 * 24);
    if (diff < 0) return "Expired";
    if (diff < 30) return "Soon";
    return "Valid";
  };

  const getFileUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    return (API || "").replace("/api", "") + "/" + url.replace(/^\/+/, "");
  };

  const statusClass = (s) =>
    s === "Valid" ? "ok" : s === "Soon" ? "soon" : "expired";

  /* ---- load ---- */
  const loadEquipment = async () => {
    const res = await axios.get(API + "/equipments/" + id, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    });
    setForm(res.data);
  };

  const loadDocs = async () => {
    const res = await axios.get(`${API}/documents`, {
      params: { item_type: "equipment", item_id: id },
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    });
    setDocs(res.data || []);
  };

  useEffect(() => {
    if (id) { loadEquipment(); loadDocs(); }
  }, [id]);

  /* ---- doc helpers ---- */
  const addDoc = () =>
    setNewDocs([...newDocs, { id: Date.now(), name: "", expiry: "", file: null }]);

  const changeDoc = (docId, field, value) => {
    setDocs(docs.map((d) => (d.id === docId ? { ...d, [field]: value } : d)));
    setNewDocs(newDocs.map((d) => (d.id === docId ? { ...d, [field]: value } : d)));
  };

  const confirmDelete = async () => {
    await axios.delete(`${API}/documents/${deleteId}`, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    });
    setDeleteId(null);
    loadDocs();
  };

  const uploadDoc = async (doc) => {
    const fd = new FormData();
    fd.append("file", doc.file);
    fd.append("item_type", "equipment");
    fd.append("item_id", id);
    fd.append("name", doc.name);
    fd.append("expiry", doc.expiry);
    await axios.post(API + "/documents/upload", fd, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    });
  };

  const saveEquipment = async () => {
    let warranty = form.warranty;
    if (!warranty || warranty === "") warranty = null;

    let status = "Normal";
    if (warranty) {
      const diff = (new Date(warranty) - Date.now()) / (1000 * 60 * 60 * 24);
      if (diff < 0) status = "Expired";
      else if (diff < 30) status = "Soon";
    }

    await axios.put(
      `${API}/equipments/${id}`,
      {
        name:       form.name || "",
        type:       form.type || "",
        serial:     form.serial || "",
        handled_by: form.handled_by || "",
        warranty,
        status,
      },
      { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
    );
  };

  const saveAll = async () => {
    await saveEquipment();
    for (let d of newDocs) {
      if (d.file) await uploadDoc(d);
    }
    setEdit(false);
    setNewDocs([]);
    await loadEquipment();
    await loadDocs();
  };

  /* ---- filter ---- */
  const allDocs = [...docs, ...newDocs];
  const filteredDocs =
    statFilter === "all"
      ? allDocs
      : allDocs.filter((d) => getStatus(d.expiry).toLowerCase() === statFilter);

  if (!form) return null;

  const totalDocs   = docs.length;
  const validDocs   = docs.filter((d) => getStatus(d.expiry) === "Valid").length;
  const soonDocs    = docs.filter((d) => getStatus(d.expiry) === "Soon").length;
  const expiredDocs = docs.filter((d) => getStatus(d.expiry) === "Expired").length;

  /* ======================================================= */
  return (
    <div className="viewv-page">

      {/* TITLE ROW */}
      <div className="viewv-title-row">
        <h2 className="viewv-title">{form.name}</h2>
        <div className="viewv-actions">
          {!edit ? (
            <button className="viewv-btn" onClick={() => setEdit(true)}>Edit</button>
          ) : (
            <>
              <button className="viewv-btn cancel" onClick={() => setEdit(false)}>Cancel</button>
              <button className="viewv-btn save" onClick={saveAll}>Save</button>
            </>
          )}
        </div>
      </div>

      <div className="viewv-grid">

        {/* ============ LEFT ============ */}
        <div className="viewv-left">

          {/* EQUIPMENT DETAILS */}
          <div className="viewv-card">
            <div className="viewv-card-header">
              <div className="viewv-icon">🏗️</div>
              <div className="viewv-head">EQUIPMENT DETAILS</div>
            </div>

            <div className="viewv-details">

              <div><span>ID</span><b>{form.equipment_id}</b></div>

              <div>
                <span>NAME</span>
                {edit
                  ? <input value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  : <b>{form.name}</b>}
              </div>

              <div>
                <span>TYPE</span>
                {edit
                  ? <input value={form.type || ""} onChange={(e) => setForm({ ...form, type: e.target.value })} />
                  : <b>{form.type}</b>}
              </div>

              <div>
                <span>SERIAL</span>
                {edit
                  ? <input value={form.serial || ""} onChange={(e) => setForm({ ...form, serial: e.target.value })} />
                  : <b>{form.serial}</b>}
              </div>

              <div>
                <span>HANDLED BY</span>
                {edit
                  ? <input value={form.handled_by || ""} onChange={(e) => setForm({ ...form, handled_by: e.target.value })} />
                  : <b>{form.handled_by}</b>}
              </div>

              <div>
                <span>WARRANTY</span>
                {edit
                  ? (
                    <input
                      type="date"
                      value={form.warranty ? form.warranty.slice(0, 10) : ""}
                      onChange={(e) => setForm({ ...form, warranty: e.target.value })}
                    />
                  )
                  : <b>{form.warranty ? form.warranty.slice(0, 10) : "-"}</b>}
              </div>

            </div>
          </div>

          {/* DOCUMENTS */}
          <div className="viewv-card">
            <div className="viewv-card-header">
              <div className="viewv-icon">📄</div>
              <div className="viewv-head">DOCUMENTS</div>
              {edit && (
                <button className="viewv-add" onClick={addDoc}>+ ADD</button>
              )}
            </div>

            <div className="viewv-doc-grid">
              {filteredDocs.map((d) => {
                const st = getStatus(d.expiry);
                const fileUrl = getFileUrl(d.url);
                return (
                  <div key={d.id} className="viewv-doc">

                    {/* NAME */}
                    <div className="viewv-field">
                      <label>Document Name</label>
                      <input
                        type="text"
                        className="viewv-input"
                        value={d.name || ""}
                        disabled={!edit}
                        onChange={(e) => changeDoc(d.id, "name", e.target.value)}
                      />
                    </div>

                    {/* EXPIRY */}
                    <div className="viewv-field">
                      <label>Expiry Date</label>
                      <input
                        type="date"
                        className="viewv-input"
                        value={d.expiry ? d.expiry.slice(0, 10) : ""}
                        disabled={!edit}
                        onChange={(e) => changeDoc(d.id, "expiry", e.target.value)}
                      />
                    </div>

                    {/* FILE — edit only */}
                    {edit && (
                      <div className="viewv-field">
                        <label>Upload File</label>
                        <input
                          type="file"
                          onChange={(e) =>
                            changeDoc(d.id, "file", e.target.files[0])
                          }
                        />
                      </div>
                    )}

                    {/* STATUS */}
                    <div className={`viewv-status ${statusClass(st)}`}>
                      {st}
                    </div>

                    {/* ACTIONS */}
                    <div className="viewv-doc-actions">
                      <button
                        title="View"
                        onClick={() => {
                          if (fileUrl) window.open(fileUrl, "_blank");
                          else alert("No file");
                        }}
                      >
                        <FaEye />
                      </button>

                      <button
                        title="Download"
                        onClick={async () => {
                          if (!fileUrl) return alert("No file");
                          try {
                            const res = await fetch(fileUrl);
                            const blob = await res.blob();
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = d.name || "file";
                            document.body.appendChild(a);
                            a.click();
                            a.remove();
                            window.URL.revokeObjectURL(url);
                          } catch {
                            alert("Download failed");
                          }
                        }}
                      >
                        <FaDownload />
                      </button>

                      {edit && (
                        <button
                          title="Delete"
                          style={{ background: "#fee2e2", color: "#991b1b" }}
                          onClick={() => {
                            if (!d.url)
                              setNewDocs(newDocs.filter((x) => x.id !== d.id));
                            else setDeleteId(d.id);
                          }}
                        >
                          ✕
                        </button>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* ============ RIGHT ============ */}
        <div className="viewv-right">

          {/* STATS */}
          <div className="viewv-stats">
            <div className="viewv-stat s1" onClick={() => setStatFilter("all")}>
              <FaFile /><span>{totalDocs}<small>Total</small></span>
            </div>
            <div className="viewv-stat s2" onClick={() => setStatFilter("valid")}>
              <FaCheckCircle /><span>{validDocs}<small>Valid</small></span>
            </div>
            <div className="viewv-stat s3" onClick={() => setStatFilter("soon")}>
              <FaClock /><span>{soonDocs}<small>Soon</small></span>
            </div>
            <div className="viewv-stat s4" onClick={() => setStatFilter("expired")}>
              <FaExclamationTriangle /><span>{expiredDocs}<small>Expired</small></span>
            </div>
          </div>

          {/* QR */}
          <div className="viewv-card">
            <div className="viewv-card-header">
              <div className="viewv-icon">🔳</div>
              <div className="viewv-head">QR CODE</div>
            </div>

            <div className="viewv-qr-box">
              {form.qr ? (
                <img
                  className="viewv-qr"
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${form.qr}`}
                  alt="QR"
                />
              ) : (
                <div className="viewv-qr">QR</div>
              )}
            </div>

            <div className="viewv-qr-text">{form.equipment_id} — {form.name}</div>
            <div className="viewv-qr-sub">Permanent QR • Does not change on edit</div>

            <div className="viewv-qr-actions">
              <button
                className="qr-btn"
                onClick={async () => {
                  const url = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${form.qr}`;
                  const res = await fetch(url);
                  const blob = await res.blob();
                  const blobUrl = window.URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = blobUrl;
                  a.download = form.equipment_id + ".png";
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                  window.URL.revokeObjectURL(blobUrl);
                }}
              >
                <FaDownload /> Download
              </button>

              <button
                className="qr-btn"
                onClick={() => {
                  const url = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${form.qr}`;
                  const win = window.open("", "PRINT");
                  win.document.write(`
                    <html><head><title>Print QR</title></head>
                    <body style="text-align:center;">
                      <img src="${url}" />
                      <script>
                        window.onload=function(){window.print();window.close();}
                      <\/script>
                    </body></html>
                  `);
                  win.document.close();
                }}
              >
                <FaPrint /> Print
              </button>
            </div>
          </div>

        </div>
      </div>

      {deleteId && (
        <ConfirmModal
          text="Delete this document?"
          onCancel={() => setDeleteId(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}