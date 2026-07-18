// ============================================
// React Entry Point
// ============================================
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/index.css";
import "./styles/navbar.css";
import "./styles/footer.css";
import "./styles/profile.css";
import "./styles/products.css";
import "./styles/cart.css";
import "./styles/checkout.css";
import "./styles/orderSuccess.css";
import "./styles/orders.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);