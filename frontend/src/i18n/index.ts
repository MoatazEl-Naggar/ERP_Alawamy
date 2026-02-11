import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      login: "Login",
      username: "Username",
      password: "Password",
      dashboard: "Dashboard",
      customers: "Customers",
      suppliers: "Suppliers",
      purchases: "Purchases",
      receiving: "Receiving",
      shipments: "Shipments",
      treasuries: "Treasuries",
      expenses: "Expenses",
      inventory: "Inventory",
      reports: "Reports",
      logout: "Logout"
    }
  },
  ar: {
    translation: {
      login: "تسجيل الدخول",
      username: "اسم المستخدم",
      password: "كلمة المرور",
      dashboard: "لوحة التحكم",
      customers: "العملاء",
      suppliers: "الموردين",
      purchases: "المشتريات",
      receiving: "الاستلام",
      shipments: "الشحن",
      treasuries: "الخزائن",
      expenses: "المصروفات",
      inventory: "المخزون",
      reports: "التقارير",
      logout: "تسجيل الخروج"
    }
  },
  zh: {
    translation: {
      login: "登录",
      username: "用户名",
      password: "密码",
      dashboard: "仪表盘",
      customers: "客户",
      suppliers: "供应商",
      purchases: "采购",
      receiving: "收货",
      shipments: "发货",
      treasuries: "金库",
      expenses: "费用",
      inventory: "库存",
      reports: "报表",
      logout: "登出"
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});

i18n.on("languageChanged", (lng) => {
  document.body.dir = lng === "ar" ? "rtl" : "ltr";
});


export default i18n;
