import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(document.getElementById("root"));
const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

// ✅ Log before rendering
console.log("CLIENT ID CHECK:", process.env.REACT_APP_GOOGLE_CLIENT_ID);
console.log("CLIENT ID:", clientId);

root.render(
  <GoogleOAuthProvider clientId={clientId}>
    <App />
  </GoogleOAuthProvider>
);
