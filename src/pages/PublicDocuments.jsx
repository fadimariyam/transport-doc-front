import "../styles/publicPage.css";
import logo from "../assets/logo.png";

import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function PublicDocuments() {

  const { text } = useParams();
  const rawText = text;
const cleanText = text.includes("scan/")
  ? text.split("scan/")[1]
  : text;

  const API = import.meta.env.VITE_API || "";

  const getFileUrl = (url) => {

  if (!url) return null;

  if (url.startsWith("http"))
    return url;

  const base =
    (API || "").replace("/api", "");

  return base + "/" + url;

};

  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);
  const [expired, setExpired] = useState(false);



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


/* ================= LOAD ================= */


useEffect(() => {

  const check = async () => {

    try {

      const res = await axios.get(
        `${API}/scan/check/${cleanText}`
      );

      // APPROVED

      if (res.data.allowed) {

        loadDocs();

        return;
      }

      if (!res.data.allowed && !res.data.denied) {

  setExpired(true);
  setLoading(false);
  return;

}

      // DENIED

      if (res.data.denied) {

        setDenied(true);
        setLoading(false);
        return;
      }

      // NOT APPROVED

      setLoading(false);

    } catch (err) {

      console.log(err);
      setLoading(false);

    }

  };

  const loadDocs = async () => {

    try {

      const res = await axios.get(
        `${API}/scan/public-docs/${cleanText}`
      );

      setDocs(res.data);

    } catch (err) {

      console.log(err);

    }

    setLoading(false);

  };

  check();

}, [text]);



/* ================= UI ================= */

if (loading) {

  return (
    <div className="public-page">
      Loading...
    </div>
  );

}

if (denied) {

  return (

    <div className="public-page">

      <div className="public-card">

        <img
          src={logo}
          className="public-logo"
        />

        <h3>Access Denied</h3>

        <p>
          Your request was denied
        </p>

      </div>

    </div>

  );

}


if (expired) {
  return (
    <div className="public-page">
      <div className="public-card">
        <h3>Access Expired</h3>
        <p>Please request access again</p>
      </div>
    </div>
  );
}

return (

<div className="public-page">

<div className="watermark">
  {text} • {new Date().toLocaleString()}
</div>

  <div className="public-card">


    {/* LOGO */}

    <img
      src={logo}
      className="public-logo"
    />


    <h2 className="public-title">
      Documents
    </h2>



    {docs.length === 0 && (

      <p>No documents found</p>

    )}


    {docs.map((d) => {

  const status = getStatus(d.expiry);

  const fileUrl = getFileUrl(d.url);

  return (

    <div
      key={d.id}
      className="public-doc"
    >

      <div className="public-doc-head">

        <b>{d.name}</b>

        <span
          className={
            "status " +
            status.toLowerCase()
          }
        >
          {status}
        </span>

      </div>

      <div className="public-expiry">

        Expiry:
        {d.expiry?.slice(0, 10)}

      </div>

      {fileUrl?.endsWith(".pdf") ? (

        <iframe
          src={fileUrl}
          width="100%"
          height="300"
        />

      ) : (

        <img
          src={fileUrl}
          className="public-img"
        />

      )}

    </div>

  );

})}


  </div>


</div>

);

}