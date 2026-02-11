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
      logout: "Logout",
      customersTitle: "Customers",
      suppliersTitle: "Suppliers",
      addCustomer: "Add Customer",
      addSupplier: "Add Supplier",
      edit: "Edit",
      delete: "Delete",
      save: "Save",
      cancel: "Cancel",
      name: "Name",
      number: "Number",
      phone: "Phone",
      email: "Email",
      address: "Address",
      accountNumber: "Account Number",

      purchasesTitle: "Purchase Invoices",
      newInvoice: "New Invoice",
      supplier: "Supplier",
      date: "Date",
      items: "Items",
      notes: "Notes",

      receivingTitle: "Receiving Invoices",
      shipmentsTitle: "Shipments",
      containerNumber: "Container Number",
      shippingCompany: "Shipping Company",

      treasuriesTitle: "Treasuries",
      balance: "Balance",

      expensesTitle: "Expense Categories",
      type: "Type",

      reportsTitle: "Financial Reports",
      startDate: "Start Date",
      endDate: "End Date",
      loadReports: "Load Reports",

      dashboardTitle: "Dashboard",
      lowStock: "Low Stock Alert"

    }
  },
  ar: {
    translation: {
      customersTitle: "العملاء",
      suppliersTitle: "الموردين",
      addCustomer: "إضافة عميل",
      addSupplier: "إضافة مورد",
      edit: "تعديل",
      delete: "حذف",
      save: "حفظ",
      cancel: "إلغاء",
      name: "الاسم",
      number: "الرقم",
      phone: "الهاتف",
      email: "البريد الإلكتروني",
      address: "العنوان",
      accountNumber: "رقم الحساب",

      purchasesTitle: "فواتير المشتريات",
      newInvoice: "فاتورة جديدة",
      supplier: "المورد",
      date: "التاريخ",
      items: "الأصناف",
      notes: "ملاحظات",

      receivingTitle: "فواتير الاستلام",
      shipmentsTitle: "الشحنات",
      containerNumber: "رقم الحاوية",
      shippingCompany: "شركة الشحن",

      treasuriesTitle: "الخزائن",
      balance: "الرصيد",

      expensesTitle: "بنود المصروفات",
      type: "النوع",

      reportsTitle: "التقارير المالية",
      startDate: "من تاريخ",
      endDate: "إلى تاريخ",
      loadReports: "تحميل التقارير",

      dashboardTitle: "لوحة التحكم",
      lowStock: "تنبيه انخفاض المخزون",

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
      customersTitle: "客户",
      suppliersTitle: "供应商",
      addCustomer: "新增客户",
      addSupplier: "新增供应商",
      edit: "编辑",
      delete: "删除",
      save: "保存",
      cancel: "取消",
      name: "名称",
      number: "编号",
      phone: "电话",
      email: "邮箱",
      address: "地址",
      accountNumber: "账户编号",

      purchasesTitle: "采购发票",
      newInvoice: "新发票",
      supplier: "供应商",
      date: "日期",
      items: "项目",
      notes: "备注",

      receivingTitle: "收货单",
      shipmentsTitle: "发货",
      containerNumber: "集装箱号",
      shippingCompany: "运输公司",

      treasuriesTitle: "金库",
      balance: "余额",

      expensesTitle: "费用类别",
      type: "类型",

      reportsTitle: "财务报表",
      startDate: "开始日期",
      endDate: "结束日期",
      loadReports: "加载报表",

      dashboardTitle: "仪表盘",
      lowStock: "低库存提醒",

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
