import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      appName: "ERP System",

      addUser: "Add User",
      editUser: "Edit User",
      role: "Role",

      /* ================== AUTH ================== */
      login: "Login",
      loginTitle: "ERP Login",
      loginFailed: "Login failed",
      username: "Username",
      password: "Password",
      logout: "Logout",

      /* ================== NAV ================== */
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

      /* ================== COMMON ================== */
      actions: "Actions",
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
      date: "Date",
      notes: "Notes",
      balance: "Balance",
      amount: "Amount",
      item: "Item",

      /* ================== DASHBOARD ================== */
      dashboardTitle: "Dashboard",
      inventoryItems: "Inventory Items",
      netCash: "Net Cash",
      lowStock: "Low Stock Alert",

      /* ================== CUSTOMERS ================== */
      customersTitle: "Customers",
      addCustomer: "Add Customer",
      editCustomer: "Edit Customer",
      customerNumber: "Customer Number",

      /* ================== SUPPLIERS ================== */
      suppliersTitle: "Suppliers",
      addSupplier: "Add Supplier",
      editSupplier: "Edit Supplier",
      supplierNumber: "Supplier Number",

      /* ================== PURCHASES ================== */
      purchasesTitle: "Purchase Invoices",
      newInvoice: "New Invoice",
      invoiceNumber: "Invoice Number",
      referenceNo: "Reference No",
      supplier: "Supplier",
      items: "Items",
      addItem: "Add Item",
      itemName: "Item Name",
      cartons: "Cartons",
      units: "Units",
      price: "Price",
      total: "Total",
      saveInvoice: "Save Invoice",

      /* ================== RECEIVING ================== */
      receivingTitle: "Receiving Invoices",
      newReceiving: "New Receiving",
      receivingNumber: "Receiving Number",
      purchaseInvoice: "Purchase Invoice",
      purchaseRef: "Purchase Ref",
      receivedItems: "Received Items",
      received: "Received",
      receivedCartons: "Received Cartons",
      receivedUnits: "Received Units",
      damagedUnits: "Damaged Units",

      /* ================== SHIPMENTS ================== */
      shipmentsTitle: "Shipments",
      newShipment: "New Shipment",
      shipmentItems: "Shipment Items",
      containerNumber: "Container Number",
      shippingCompany: "Shipping Company",
      shipped: "Shipped",
      shippedCartons: "Shipped Cartons",
      shippedUnits: "Shipped Units",
      saveShipment: "Save Shipment",
      customer: "Customer",
      receivingInvoice: "Receiving Invoice",

      /* ================== TREASURY ================== */
      treasuriesTitle: "Treasuries",
      addTreasury: "Add Treasury",
      newTreasury: "New Treasury",
      treasuryName: "Treasury Name",

      /* ================== EXPENSES ================== */
      expensesTitle: "Expense Categories",
      addExpense: "Add Expense",
      editExpense: "Edit Expense",
      type: "Type",
      expense: "Expense",
      expenseSummary: "Expense Summary",
      expenseTypeHint: "salary / general / etc",

      /* ================== INVENTORY ================== */
      inventoryReport: "Inventory Report",

      /* ================== REPORTS ================== */
      reportsTitle: "Financial Reports",
      startDate: "Start Date",
      endDate: "End Date",
      loadReports: "Load Reports",
      totalCashIn: "Total Cash In",
      totalCashOut: "Total Cash Out",
      netBalance: "Net Balance",
      categoryId: "Category ID",
      totalSpent: "Total Spent",
      treasuryMovements: "Treasury Movements",
      receipts: "Receipts",
      payments: "Payments",
      voucher: "Voucher",
      treasury: "Treasury",

      registration: "Registration",
      transactions: "Transactions",
      financeManagement: "Financial Management",
      reportsMenu: "Reports",

      usersRegistration: "User Registration",
      customersRegistration: "Customer Registration",
      suppliersRegistration: "Supplier Registration",
      financeRegistration: "Financial Setup",

      users: "Users",
      userPermissions: "User Permissions",

      treasurySetup: "Treasury Setup",
      expenseCategories: "Expense Categories",

      purchaseDraft: "Purchase Draft Invoice",
      receivingGInvoice: "Receiving Goods Invoice",
      containerLoading: "Container Loading Invoice",

      paymentVoucher: "Payment Voucher",
      receiptVoucher: "Receipt Voucher",
      voucherReview: "Voucher Review"

    }
  },

  /* ================== ARABIC ================== */

  ar: {
    translation: {
      appName: "نظام ERP",

      registration: "التسجيل",
usersRegistration: "تسجيل المستخدمين",
customersRegistration: "تسجيل العملاء",
suppliersRegistration: "تسجيل الموردين",
financeRegistration: "إعدادات الماليات",

transactions: "الحركة",
purchaseDraft: "فاتورة شراء مبدئية",
receivingGInvoice: "فاتورة استلام بضاعة",
containerLoading: "فاتورة تعبئة حاوية",

financeManagement: "الإدارة المالية",
paymentVoucher: "سند صرف",
receiptVoucher: "سند قبض",
voucherReview: "مراجعة السندات",

reportsMenu: "التقارير",

addUser: "إضافة مستخدم",
editUser: "تعديل مستخدم",
role: "الدور",

      login: "تسجيل الدخول",
      loginTitle: "تسجيل دخول النظام",
      loginFailed: "فشل تسجيل الدخول",
      username: "اسم المستخدم",
      password: "كلمة المرور",
      logout: "تسجيل الخروج",

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

      actions: "الإجراءات",
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
      date: "التاريخ",
      notes: "ملاحظات",
      balance: "الرصيد",
      amount: "المبلغ",
      item: "الصنف",

      dashboardTitle: "لوحة التحكم",
      inventoryItems: "عناصر المخزون",
      netCash: "صافي النقد",
      lowStock: "تنبيه انخفاض المخزون",

      customersTitle: "العملاء",
      addCustomer: "إضافة عميل",
      editCustomer: "تعديل عميل",
      customerNumber: "رقم العميل",

      suppliersTitle: "الموردين",
      addSupplier: "إضافة مورد",
      editSupplier: "تعديل مورد",
      supplierNumber: "رقم المورد",

      purchasesTitle: "فواتير المشتريات",
      newInvoice: "فاتورة جديدة",
      invoiceNumber: "رقم الفاتورة",
      referenceNo: "رقم المرجع",
      supplier: "المورد",
      items: "الأصناف",
      addItem: "إضافة صنف",
      itemName: "اسم الصنف",
      cartons: "كرتون",
      units: "وحدات",
      price: "السعر",
      total: "الإجمالي",
      saveInvoice: "حفظ الفاتورة",

      receivingTitle: "فواتير الاستلام",
      newReceiving: "استلام جديد",
      receivingNumber: "رقم الاستلام",
      purchaseInvoice: "فاتورة الشراء",
      purchaseRef: "مرجع الشراء",
      receivedItems: "الأصناف المستلمة",
      received: "المستلم",
      receivedCartons: "الكرتون المستلم",
      receivedUnits: "الوحدات المستلمة",
      damagedUnits: "الوحدات التالفة",

      shipmentsTitle: "الشحنات",
      newShipment: "شحنة جديدة",
      shipmentItems: "أصناف الشحنة",
      containerNumber: "رقم الحاوية",
      shippingCompany: "شركة الشحن",
      shipped: "المشحون",
      shippedCartons: "الكرتون المشحون",
      shippedUnits: "الوحدات المشحونة",
      saveShipment: "حفظ الشحنة",
      customer: "العميل",
      receivingInvoice: "فاتورة الاستلام",

      treasuriesTitle: "الخزائن",
      addTreasury: "إضافة خزنة",
      newTreasury: "خزنة جديدة",
      treasuryName: "اسم الخزنة",

      expensesTitle: "بنود المصروفات",
      addExpense: "إضافة مصروف",
      editExpense: "تعديل مصروف",
      type: "النوع",
      expense: "مصروف",
      expenseSummary: "ملخص المصروفات",
      expenseTypeHint: "راتب / عام / إلخ",

      inventoryReport: "تقرير المخزون",

      reportsTitle: "التقارير المالية",
      startDate: "من تاريخ",
      endDate: "إلى تاريخ",
      loadReports: "تحميل التقارير",
      totalCashIn: "إجمالي الداخل",
      totalCashOut: "إجمالي الخارج",
      netBalance: "صافي الرصيد",
      categoryId: "رقم الفئة",
      totalSpent: "إجمالي المصروف",
      treasuryMovements: "حركات الخزنة",
      receipts: "الإيصالات",
      payments: "المدفوعات",
      voucher: "رقم السند",
      treasury: "الخزنة"
    }
  },

  /* ================== CHINESE ================== */

  zh: {
    translation: {
      appName: "ERP 系统",

      registration: "注册管理",
usersRegistration: "用户管理",
customersRegistration: "客户登记",
suppliersRegistration: "供应商登记",
financeRegistration: "财务设置",

transactions: "业务流程",
purchaseDraft: "采购草稿发票",
receivingGInvoice: "收货单",
containerLoading: "装柜发货单",

financeManagement: "财务管理",
paymentVoucher: "付款凭证",
receiptVoucher: "收款凭证",
voucherReview: "凭证审核",

reportsMenu: "报表",

addUser: "新增用户",
editUser: "编辑用户",
role: "角色",

      login: "登录",
      loginTitle: "ERP 登录",
      loginFailed: "登录失败",
      username: "用户名",
      password: "密码",
      logout: "登出",

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

      actions: "操作",
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
      date: "日期",
      notes: "备注",
      balance: "余额",
      amount: "金额",
      item: "项目",

      dashboardTitle: "仪表盘",
      inventoryItems: "库存项目",
      netCash: "净现金",
      lowStock: "低库存提醒",

      customersTitle: "客户",
      addCustomer: "新增客户",
      editCustomer: "编辑客户",
      customerNumber: "客户编号",

      suppliersTitle: "供应商",
      addSupplier: "新增供应商",
      editSupplier: "编辑供应商",
      supplierNumber: "供应商编号",

      purchasesTitle: "采购发票",
      newInvoice: "新发票",
      invoiceNumber: "发票编号",
      referenceNo: "参考编号",
      supplier: "供应商",
      items: "项目",
      addItem: "添加项目",
      itemName: "项目名称",
      cartons: "箱",
      units: "单位",
      price: "价格",
      total: "总计",
      saveInvoice: "保存发票",

      receivingTitle: "收货单",
      newReceiving: "新收货单",
      receivingNumber: "收货编号",
      purchaseInvoice: "采购发票",
      purchaseRef: "采购参考",
      receivedItems: "收货项目",
      received: "已收",
      receivedCartons: "已收箱数",
      receivedUnits: "已收单位",
      damagedUnits: "损坏单位",

      shipmentsTitle: "发货",
      newShipment: "新发货",
      shipmentItems: "发货项目",
      containerNumber: "集装箱号",
      shippingCompany: "运输公司",
      shipped: "已发",
      shippedCartons: "已发箱数",
      shippedUnits: "已发单位",
      saveShipment: "保存发货",
      customer: "客户",
      receivingInvoice: "收货单",

      treasuriesTitle: "金库",
      addTreasury: "新增金库",
      newTreasury: "新金库",
      treasuryName: "金库名称",

      expensesTitle: "费用类别",
      addExpense: "新增费用",
      editExpense: "编辑费用",
      type: "类型",
      expense: "费用",
      expenseSummary: "费用汇总",
      expenseTypeHint: "工资 / 一般 / 等",

      inventoryReport: "库存报表",

      reportsTitle: "财务报表",
      startDate: "开始日期",
      endDate: "结束日期",
      loadReports: "加载报表",
      totalCashIn: "现金收入总额",
      totalCashOut: "现金支出总额",
      netBalance: "净余额",
      categoryId: "类别编号",
      totalSpent: "总支出",
      treasuryMovements: "金库流水",
      receipts: "收款",
      payments: "付款",
      voucher: "凭证",
      treasury: "金库"
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("lang") || "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});

i18n.on("languageChanged", (lng) => {
  localStorage.setItem("lang", lng);
  document.body.dir = lng === "ar" ? "rtl" : "ltr";
});

export default i18n;
