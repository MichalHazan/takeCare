//App
import React from "react";
import { useLanguage } from "./context/LanguageContext";
import Navbar from "./components/Navbar";
import Main from "./components/Main";
import Margins from "./components/Margins";

function App() {
  const { language } = useLanguage();

  return (
    <div dir={language === "he" ? "rtl" : "ltr"}>
      <Navbar />
      <Main />
        <Margins/>
    </div>
  );
}

export default App;
