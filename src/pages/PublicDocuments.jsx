import "../styles/publicPage.css";
import logo from "../assets/logo.png";

import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function PublicDocuments() {

  const { text } = useParams();

  const API = import.meta.env.VITE_API;

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

/*=========TIME SET============ */
if (!res.data.allowed && !res.data.denied) {
  setExpired(true);
  setLoading(false);
  return;
}

/* ================= LOAD ================= */


useEffect(() => {

  const check = async () => {

    try {

      const res = await axios.get(
        // API + "/scan/check/" + text
        `${API}/scan/check/${text}`
      );

      // APPROVED

      if (res.data.allowed) {

        loadDocs();

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
        // API + "/scan/public-docs/" + text
        `${API}/scan/public-docs/${text}`
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

  {/* <div className="watermark">
  Accessed: {new Date().toLocaleString()}
</div> */}

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

      const status =
        getStatus(d.expiry);

      return (

        <div
          key={d.id}
          className="public-doc"
        >


          {/* NAME */}

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



          {/* EXPIRY */}

          <div className="public-expiry">

            Expiry:
            {d.expiry?.slice(0, 10)}

          </div>



          {/* PREVIEW */}

          {d.url?.endsWith(".pdf") ? (

            <iframe
              src={d.url}
              width="100%"
              height="300"
            />

          ) : (

            <img
              src={d.url}
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