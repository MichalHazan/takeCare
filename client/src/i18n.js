import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";

i18n
    .use(HttpApi)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: "he", // שפה ברירת מחדל
        debug: false,
        interpolation: {
            escapeValue: false, // React עושה זאת כבר
        },
        backend: {
            loadPath: "/locales/{{lng}}.json", // נתיב הקבצים
        },
        detection: {
            order: ["queryString", "cookie", "localStorage", "navigator"],
            caches: ["cookie"], // שמירת השפה בקוקי
        },
    });

export default i18n;


