import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";

import App from "./App";

import "./styles/theme.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <BrowserRouter>
    <App />
  </BrowserRouter>

);