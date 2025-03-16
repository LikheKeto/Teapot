import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ToastContainer } from "react-toastify";
import { Flowbite } from "flowbite-react";
import { customTheme } from "./lib/theme.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer />
        <Flowbite theme={{ theme: customTheme }}>
          <App />
        </Flowbite>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
