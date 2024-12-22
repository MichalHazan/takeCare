import React from "react";
import { useLanguage } from "./context/LanguageContext";
import Navbar from "./components/Navbar";
import Main from "./components/Main";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import theme from "./theme"; 
function App() {
  const { language } = useLanguage();

  return (
    <div dir={language === "he" ? "rtl" : "ltr"}>
       <ThemeProvider theme={theme}>
      <Navbar />
      <Main />
      </ThemeProvider>
    </div>
  );
}

export default App;