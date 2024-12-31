//LanguageContext.js
import React, { createContext, useContext, useState } from "react";
import i18n from "../i18n";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(i18n.language || "he");

  const toggleLanguage = () => {
    const newLanguage = language === "he" ? "en" : "he";
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage); // שינוי שפה ב-i18next
    document.dir = newLanguage === "he" ? "rtl" : "ltr"; // שינוי כיוון טקסט
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
