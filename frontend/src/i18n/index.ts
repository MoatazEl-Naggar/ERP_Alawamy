import i18n from "i18next";
import { initReactI18next } from "react-i18next";

/* ================= EN ================= */
import enCommon from "./en/common.json";
import enAuth from "./en/auth.json";
import enNavigation from "./en/navigation.json";
import enCustomers from "./en/customers.json";
import enSuppliers from "./en/suppliers.json";
import enPurchases from "./en/purchases.json";
import enReceiving from "./en/receiving.json";
import enShipments from "./en/shipments.json";
import enFinance from "./en/finance.json";
import enReports from "./en/reports.json";

/* ================= AR ================= */
import arCommon from "./ar/common.json";
import arAuth from "./ar/auth.json";
import arNavigation from "./ar/navigation.json";
import arCustomers from "./ar/customers.json";
import arSuppliers from "./ar/suppliers.json";
import arPurchases from "./ar/purchases.json";
import arReceiving from "./ar/receiving.json";
import arShipments from "./ar/shipments.json";
import arFinance from "./ar/finance.json";
import arReports from "./ar/reports.json";

/* ================= ZH ================= */
import zhCommon from "./zh/common.json";
import zhAuth from "./zh/auth.json";
import zhNavigation from "./zh/navigation.json";
import zhCustomers from "./zh/customers.json";
import zhSuppliers from "./zh/suppliers.json";
import zhPurchases from "./zh/purchases.json";
import zhReceiving from "./zh/receiving.json";
import zhShipments from "./zh/shipments.json";
import zhFinance from "./zh/finance.json";
import zhReports from "./zh/reports.json";

/* ================= LANGUAGE INIT ================= */

const savedLang = localStorage.getItem("lang") || "ar";

/* Apply direction on first load */
document.body.dir = savedLang === "ar" ? "rtl" : "ltr";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        ...enCommon,
        ...enAuth,
        ...enNavigation,
        ...enCustomers,
        ...enSuppliers,
        ...enPurchases,
        ...enReceiving,
        ...enShipments,
        ...enFinance,
        ...enReports
      }
    },

    ar: {
      translation: {
        ...arCommon,
        ...arAuth,
        ...arNavigation,
        ...arCustomers,
        ...arSuppliers,
        ...arPurchases,
        ...arReceiving,
        ...arShipments,
        ...arFinance,
        ...arReports
      }
    },

    zh: {
      translation: {
        ...zhCommon,
        ...zhAuth,
        ...zhNavigation,
        ...zhCustomers,
        ...zhSuppliers,
        ...zhPurchases,
        ...zhReceiving,
        ...zhShipments,
        ...zhFinance,
        ...zhReports
      }
    }
  },

  lng: savedLang,
  fallbackLng: "ar",
  interpolation: {
    escapeValue: false
  }
});

/* Save language + change direction */
i18n.on("languageChanged", (lng) => {
  localStorage.setItem("lang", lng);
  document.body.dir = lng === "ar" ? "rtl" : "ltr";
});

export default i18n;
