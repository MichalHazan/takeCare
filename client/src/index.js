//index.js
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { LanguageProvider } from "./context/LanguageContext";
//import "./i18n";
import { CssBaseline } from "@mui/material";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux"; // Redux
import store from "./components/store"
    //components/store"; // Redux store

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <Provider store={store}> {/* Redux Provider */}
                <LanguageProvider>
                    <CssBaseline />
                    <Router>
                    <App />
                    </Router>
                </LanguageProvider>
        </Provider>
    </React.StrictMode>
);

reportWebVitals();