import "../styles/otpPage.css";
import logo from "../assets/logo.png";

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import axios from "axios";

export default function OTPPage() {

  const { text } = useParams();
  const rawText = text;

const cleanText = text.includes("scan/")
  ? text.split("scan/")[1]
  : text;

  const nav = useNavigate();

  const API = import.meta.env.VITE_API;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [status, setStatus] =
    useState("form"); 
  // form | waiting | approved | denied



/* ================= SEND REQUEST ================= */

const sendRequest = async () => {

  try {

    await axios.post(
      API + "/scan/request",
      {
        qr_text: cleanText,
        name,
        email,
        phone,
      }
    );

    setStatus("waiting");

    startChecking();

  } catch (err) {

    alert("Error");

  }

};



/* ================= CHECK LOOP ================= */

const startChecking = () => {

  const interval = setInterval(async () => {

    try {

      const res =
        await axios.get(
          API + "/scan/check/" + text
        );

      console.log(res.data);


      if (res.data.allowed) {

        clearInterval(interval);

        setStatus("approved");

        setTimeout(() => {

          nav(
            "/public/" + text,
            {
              state: {
                approved: true,
              },
            }
          );

        }, 800);

      }


      if (res.data.denied) {

        clearInterval(interval);

        setStatus("denied");

      }

    } catch (err) {}

  }, 2000);

};
/* ================= UI ================= */

return (

<div className="otp-page">

<div className="otp-card">

<img
src={logo}
className="otp-logo"
/>



{/* FORM */}

{status === "form" && (

<>

<h3 className="otp-title">
Access Request
</h3>

<p className="otp-sub">
Enter details to view documents
</p>


<input
className="otp-input"
placeholder="Name"
value={name}
onChange={(e)=>
setName(e.target.value)
}
/>

<input
className="otp-input"
placeholder="Email"
value={email}
onChange={(e)=>
setEmail(e.target.value)
}
/>

<input
className="otp-input"
placeholder="Phone"
value={phone}
onChange={(e)=>
setPhone(e.target.value)
}
/>


<button
className="otp-btn"
onClick={sendRequest}
>
Submit Request
</button>

</>

)}



{/* WAITING */}

{status === "waiting" && (

<>

<h3 className="otp-title">
Waiting approval
</h3>

<p className="otp-sub">
Admin must approve
</p>

</>

)}



{/* APPROVED */}

{status === "approved" && (

<>

<h3 className="otp-title">
Approved ✓
</h3>

<p className="otp-sub">
Opening documents...
</p>

</>

)}



{/* DENIED */}

{status === "denied" && (

<>

<h3 className="otp-title">
Denied
</h3>

<p className="otp-sub">
Your request was denied
</p>

</>

)}

</div>

</div>

);

}